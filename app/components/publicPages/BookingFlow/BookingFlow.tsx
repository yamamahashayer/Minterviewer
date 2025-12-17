"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import SessionCard from "../SessionCard/SessionCard";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Search, Filter } from "lucide-react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface Mentor {
  _id: string;
  name: string;
  photo?: string;
  bio?: string;
  yearsOfExperience?: number;
  rating?: number;
  reviewsCount?: number;
  focusAreas?: string[];
  hourlyRate?: number;
  stripeAccountId?: string;
  company?: string;
  location?: string;
  languages?: string[];
  achievements?: string[];
  sessionOfferings?: SessionOffering[];
}

interface SessionOffering {
  _id: string;
  title: string;
  topic: string;
  sessionType: string;
  duration: number;
  price: number;
  description: string;
  active: boolean;
}

interface BookingFlowProps {
  mentors: Mentor[];
  onBack?: () => void;
  onSuccess?: (sessionId: string) => void;
  onCancel?: () => void;
}

export default function BookingFlow({
  mentors,
  onBack,
  onSuccess,
  onCancel
}: BookingFlowProps) {
  const [selectedSession, setSelectedSession] = useState<{
    mentor: Mentor;
    sessionOffering: SessionOffering;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Filter session offerings from all mentors
  const allSessionOfferings = mentors.flatMap(mentor =>
    (mentor.sessionOfferings || [])
      .filter(offering => offering.active)
      .map(offering => ({
        mentor,
        sessionOffering: offering
      }))
  );

  // Filter based on search and topic
  const filteredOfferings = allSessionOfferings.filter(({ mentor, sessionOffering }) => {
    const matchesSearch = !searchTerm || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sessionOffering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sessionOffering.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.focusAreas?.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTopic = !selectedTopic || sessionOffering.topic === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  // Get unique topics for filter
  const uniqueTopics = Array.from(new Set(allSessionOfferings.map(({ sessionOffering }) => sessionOffering.topic)));

  const handleBookSession = async (mentor: Mentor, sessionOffering: SessionOffering) => {
    setIsProcessing(true);
    
    try {
      // Check if Stripe is configured
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        toast.error('Payment system is not configured. Please contact support.');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Payment system initialization failed. Please try again later.');
        return;
      }

      // Create a temporary session record or use existing time slot logic
      console.log('Creating checkout session with data:', {
        sessionId: `temp-${Date.now()}`,
        mentorId: mentor._id,
        price: sessionOffering.price,
        title: sessionOffering.title,
        mentorName: mentor.name,
        mentorPhoto: mentor.photo,
        sessionOfferingId: sessionOffering._id,
      });

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: `temp-${Date.now()}`, // Temporary ID, will be replaced after payment
          mentorId: mentor._id,
          price: sessionOffering.price,
          title: sessionOffering.title,
          mentorName: mentor.name,
          mentorPhoto: mentor.photo,
          sessionOfferingId: sessionOffering._id,
        }),
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      const { sessionId: checkoutSessionId, error: apiError } = responseData;

      if (apiError) {
        throw new Error(apiError);
      }

      // Redirect to Stripe Checkout
      const result = await (stripe as any).redirectToCheckout({
        sessionId: checkoutSessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // If successful, call onSuccess callback
      if (onSuccess) {
        onSuccess(checkoutSessionId);
      }

    } catch (error: any) {
      console.error('Error booking session:', error);
      toast.error(error.message || 'Failed to book session');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProfile = (mentorId: string) => {
    // Navigate to mentor profile
    window.open(`/dashboard/mentors/${mentorId}`, '_blank');
  };

  if (selectedSession) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => setSelectedSession(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
          
          <SessionCard
            mentor={selectedSession.mentor}
            sessionOffering={selectedSession.sessionOffering}
            onBookSession={handleBookSession}
            onViewProfile={handleViewProfile}
            isBooking={true}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Book a Session
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from available mentorship sessions
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Mentor name, topic, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Topics</option>
              {uniqueTopics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedTopic("");
              }}
              variant="outline"
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredOfferings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to see more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOfferings.map(({ mentor, sessionOffering }, index) => (
              <motion.div
                key={`${mentor._id}-${sessionOffering._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <SessionCard
                  mentor={mentor}
                  sessionOffering={sessionOffering}
                  onBookSession={handleBookSession}
                  onViewProfile={handleViewProfile}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

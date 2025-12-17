"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Clock, 
  Calendar, 
  DollarSign, 
  User, 
  MapPin,
  Award,
  Play,
  Heart,
  Share2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "../../../../Context/ThemeContext";

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
}

interface SessionCardProps {
  mentor: Mentor;
  sessionOffering: SessionOffering;
  onBookSession?: (mentor: Mentor, sessionOffering: SessionOffering) => void;
  onViewProfile?: (mentorId: string) => void;
  isBooking?: boolean;
}

export default function SessionCard({
  mentor,
  sessionOffering,
  onBookSession,
  onViewProfile,
  isBooking = false
}: SessionCardProps) {
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookSession = async () => {
    if (!onBookSession) return;
    
    setIsProcessing(true);
    try {
      await onBookSession(mentor, sessionOffering);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
          : "bg-white border-gray-200 hover:shadow-blue-500/20"
      }`}
    >
      {/* Header Gradient */}
      <div className={`h-2 bg-gradient-to-r ${
        isDark 
          ? "from-blue-600 to-purple-600" 
          : "from-blue-500 to-purple-500"
      }`} />

      <div className="p-6">
        {/* Mentor Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {mentor.photo ? (
                  <img 
                    src={mentor.photo} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-xl font-bold ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {mentor.name.charAt(0)}
                  </div>
                )}
              </div>
              {mentor.rating && mentor.rating >= 4.5 && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Award className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                {mentor.name}
              </h3>
              
              {mentor.company && (
                <p className={`text-sm font-medium ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}>
                  {mentor.company}
                </p>
              )}
              
              <div className="flex items-center gap-3 mt-1">
                {mentor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {mentor.rating.toFixed(1)}
                    </span>
                    {mentor.reviewsCount && (
                      <span className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        ({mentor.reviewsCount} reviews)
                      </span>
                    )}
                  </div>
                )}
                
                {mentor.yearsOfExperience && (
                  <div className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {mentor.yearsOfExperience}+ years
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isLiked 
                    ? "text-red-500 fill-current" 
                    : isDark ? "text-gray-400" : "text-gray-600"
                }`} 
              />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Share2 className={`h-4 w-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`} />
            </button>
          </div>
        </div>

        {/* Session Details */}
        <div className={`mb-6 p-4 rounded-xl ${
          isDark ? "bg-gray-700/50" : "bg-gray-50"
        }`}>
          <h4 className={`font-bold text-lg mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {sessionOffering.title}
          </h4>
          
          <p className={`text-sm mb-3 line-clamp-2 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {sessionOffering.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark 
                ? "bg-blue-900/50 text-blue-300 border border-blue-700/50" 
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}>
              {sessionOffering.topic}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark 
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50" 
                : "bg-purple-100 text-purple-800 border border-purple-200"
            }`}>
              {sessionOffering.sessionType}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              isDark 
                ? "bg-green-900/50 text-green-300 border border-green-700/50" 
                : "bg-green-100 text-green-800 border border-green-200"
            }`}>
              <Clock className="h-3 w-3" />
              {formatDuration(sessionOffering.duration)}
            </span>
          </div>

          {mentor.focusAreas && mentor.focusAreas.length > 0 && (
            <div className="mb-3">
              <p className={`text-xs font-medium mb-2 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Expertise:
              </p>
              <div className="flex flex-wrap gap-1">
                {mentor.focusAreas.slice(0, 3).map((area, index) => (
                  <span
                    key={index}
                    className={`text-[10px] px-2 py-1 rounded-full ${
                      isDark 
                        ? "bg-gray-600 text-gray-300" 
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {area}
                  </span>
                ))}
                {mentor.focusAreas.length > 3 && (
                  <span className={`text-[10px] px-2 py-1 rounded-full ${
                    isDark 
                      ? "bg-gray-600 text-gray-300" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    +{mentor.focusAreas.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              Session Price
            </div>
            <div className={`text-2xl font-bold flex items-center gap-1 ${
              isDark ? "text-green-400" : "text-green-600"
            }`}>
              <DollarSign className="h-5 w-5" />
              {formatPrice(sessionOffering.price)}
            </div>
          </div>

          <div className="flex space-x-3">
            {onViewProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(mentor._id)}
                className={`${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                View Profile
              </Button>
            )}
            
            <Button
              onClick={handleBookSession}
              disabled={isProcessing || !sessionOffering.active}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="sm"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Book Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

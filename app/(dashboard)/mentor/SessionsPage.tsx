"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Filter, Plus, Users, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, MessageSquare, Star, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';

const pendingRequests = [
  {
    id: 101,
    mentee: 'Jessica Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    type: 'Technical Interview',
    requestedDate: 'Oct 16, 2025',
    requestedTime: '3:00 PM - 4:00 PM',
    message: 'Hi! I have an interview coming up with Google and would love your help preparing for technical questions.',
    price: 120,
    submittedTime: '2 hours ago',
    color: 'from-cyan-500 to-blue-500'
  }
];

const upcomingSessions = [
  {
    id: 1,
    mentee: 'Sarah Mitchell',
    type: 'Technical Interview',
    date: 'Oct 14, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'confirmed',
    color: 'from-cyan-500 to-blue-500'
  }
];

const pastSessionsData = [
  {
    id: 5,
    mentee: 'Michael Brown',
    menteeId: 'mnt_1', // Mock ID
    type: 'Cloud Architecture',
    date: 'Oct 8, 2025',
    time: '11:00 AM - 12:00 PM',
    status: 'completed',
    feedback: true
  },
  {
    id: 6,
    mentee: 'Sarah Mitchell',
    menteeId: 'mnt_2',
    type: 'React Components',
    date: 'Oct 10, 2025',
    time: '2:00 PM - 3:00 PM',
    status: 'completed',
    feedback: true
  },
  {
    id: 7,
    mentee: 'James Rodriguez',
    menteeId: 'mnt_3',
    type: 'System Design',
    date: 'Oct 12, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'completed',
    feedback: false
  }
];

export const SessionsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState('all');
  const [requests, setRequests] = useState(pendingRequests);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [pastSessions, setPastSessions] = useState(pastSessionsData);

  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current week view for calendar grid
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const calendarTimeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const calendarSessions = [
    { day: 0, time: '10:00', mentee: 'Sarah Mitchell', type: 'Technical', duration: 1, color: 'cyan' },
  ];

  const handleOpenFeedback = (session: any) => {
    setSelectedSessionForFeedback(session);
    setFeedbackRating(0);
    setFeedbackText('');
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSessionForFeedback) return;
    if (feedbackRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get user from session (mock)
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : { id: 'mentor_123' }; // Fallback

      const payload = {
        sessionId: selectedSessionForFeedback.id, // In real app, this should be the TimeSlot _id
        fromUserId: user.id, // Mentor ID
        toUserId: selectedSessionForFeedback.menteeId || 'mock_mentee_id', // Need mentee user ID
        rating: feedbackRating,
        feedback: feedbackText,
        tags: []
      };

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Feedback submitted successfully!");
        // Update local state to show feedback submitted
        setPastSessions(prev => prev.map(s =>
          s.id === selectedSessionForFeedback.id ? { ...s, feedback: true } : s
        ));
        setIsFeedbackOpen(false);
      } else {
        const json = await res.json();
        toast.error(json.error || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Sessions</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Manage your mentoring sessions and schedule</p>

        {/* Feedback Dialog */}
        <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
          <DialogContent className="max-w-md bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                Feedback for {selectedSessionForFeedback?.mentee}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm text-[var(--foreground-muted)]">How was the session?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setFeedbackRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star
                        className={`w-8 h-8 ${star <= feedbackRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Review</label>
                <Textarea
                  placeholder="Share your thoughts on the mentee's performance..."
                  className="min-h-[120px] bg-[var(--background-muted)] border-[var(--border)]"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || feedbackRating === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ... preserved stats code ... */}
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{ background: 'var(--accent-purple-subtle)', borderColor: 'var(--accent-purple)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-purple-muted)' }}><Calendar className="w-6 h-6" style={{ color: 'var(--accent-purple)' }} /></div>
              <div><p className="text-[var(--foreground-muted)] text-sm">Upcoming</p><p className="text-[var(--foreground)] text-xl">{upcomingSessions.length}</p></div>
            </div>
          </div>
          {/* Other stats mock ... */}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Sessions List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="requests" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="requests">Pending Requests</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Sessions</TabsTrigger>
              </TabsList>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Filter by type" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Types</SelectItem></SelectContent>
              </Select>
            </div>

            <TabsContent value="requests" className="space-y-4">
              {/* Requests ... */}
              {requests.map((request) => (
                <div key={request.id} className="p-4 border rounded-xl bg-[var(--card)]">
                  <div className="flex justify-between items-start">
                    <div><h4 className="font-bold">{request.mentee}</h4><p className="text-sm">{request.type}</p></div>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && <div className="text-center p-8 text-gray-500">No requests</div>}
            </TabsContent>

            <TabsContent value="upcoming">
              {/* Upcoming ... */}
              {upcomingSessions.map(s => (
                <div key={s.id} className="p-6 border rounded-xl bg-[var(--card)] mb-4">
                  <h4 className="font-bold">{s.mentee}</h4>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-purple-600"><Video className="w-4 h-4 mr-2" /> Start</Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                          background: 'linear-gradient(to right, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))'
                        }}>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="text-[var(--foreground)]">{session.mentee}</h4>
                          <Badge className="border" style={{
                            background: 'var(--background-muted)',
                            color: 'var(--foreground-muted)',
                            borderColor: 'var(--border)'
                          }}>
                            {session.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm ml-15" style={{ color: 'var(--foreground-muted)' }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {session.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </div>
                      </div>
                    </div>

                    {session.feedback ? (
                      <Badge className="border" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        borderColor: 'rgba(34, 197, 94, 0.3)'
                      }}>
                        Feedback Added
                      </Badge>
                    ) : (
                      <Badge className="border" style={{
                        background: 'var(--accent-pink-subtle)',
                        color: 'var(--accent-pink)',
                        borderColor: 'var(--accent-pink)'
                      }}>
                        Feedback Pending
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (!session.feedback) {
                        handleOpenFeedback(session);
                      } else {
                        toast.info("Feedback already verified.");
                      }
                    }}
                    style={{
                      borderColor: 'var(--accent-purple)',
                      background: 'var(--accent-purple-subtle)',
                      color: 'var(--accent-purple)'
                    }}
                  >
                    {session.feedback ? 'View Feedback' : 'Add Feedback'}
                  </Button>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Calendar */}
        <div className="space-y-6">
          <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-lg border-[var(--border)]" />
        </div>
      </div>
    </div>
  );
};

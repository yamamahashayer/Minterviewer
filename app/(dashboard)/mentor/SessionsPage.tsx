"use client";

import { useState, useEffect } from 'react';
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

// Mock data removed

export const SessionsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Data State
  const [requests, setRequests] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch Sessions

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No token found in session storage");
          toast.error("Please log in again");
          return;
        }

        const res = await fetch('/api/mentor/sessions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setRequests(json.data.pending || []);
            setUpcomingSessions(json.data.upcoming || []);
            setPastSessions(json.data.past || []);
          }
        } else {
          console.error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
          const text = await res.text();
          console.error('Response body:', text);
          toast.error(`Failed to load sessions: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

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

  const handleAcceptSession = async (sessionId: string) => {
    // Placeholder for acceptance logic - likely needs a specific API endpoint or update to session status
    toast.info("Acceptance logic to be implemented via API");
  };

  const handleStartSession = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      toast.error("Video link not available");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSessionForFeedback) return;
    if (feedbackRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real scenario, we might use a dedicated feedback API or update the session
      // The previous code assumed /api/feedback, let's keep it but ensure payload matches

      const payload = {
        sessionId: selectedSessionForFeedback.id,
        // mentorId is handled by backend auth session usually, but we can pass if needed.
        // The original code tried to use sessionStorage 'user', which might be unreliable.
        // Ideally backend extracts 'fromUser' from token.
        targetUserId: selectedSessionForFeedback.menteeId, // ID of the mentee user
        rating: feedbackRating,
        reviewText: feedbackText, // Renamed to match likely schema
      };

      // Create a specific endpoint for Mentor -> Mentee feedback if generic one doesn't exist?
      // For now, let's assume /api/mentor/feedbacks/create matches or similar.
      // Based on file list, there is 'app/api/mentor/feedbacks/route.ts' (plural).

      const res = await fetch('/api/mentor/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Feedback submitted successfully!");
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

  // Calculate modifiers for calendar
  const sessionDates = [
    ...requests.map(s => new Date(s.scheduledTime)),
    ...upcomingSessions.map(s => new Date(s.scheduledTime)),
    ...pastSessions.map(s => new Date(s.scheduledTime))
  ];

  const hasSessionModifier = {
    hasSession: sessionDates
  };

  const hasSessionStyles = {
    hasSession: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--accent-purple)'
    }
  };

  // Filter sessions based on selected date
  const filteredRequests = selectedDate
    ? requests.filter(s => new Date(s.scheduledTime).toDateString() === selectedDate.toDateString())
    : requests;

  const filteredUpcoming = selectedDate
    ? upcomingSessions.filter(s => new Date(s.scheduledTime).toDateString() === selectedDate.toDateString())
    : upcomingSessions;

  const filteredPast = selectedDate
    ? pastSessions.filter(s => new Date(s.scheduledTime).toDateString() === selectedDate.toDateString())
    : pastSessions;

  const isDateSelected = selectedDate !== undefined;

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
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30"><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
              <div><p className="text-[var(--foreground-muted)] text-sm">Total Sessions</p><p className="text-[var(--foreground)] text-xl">{upcomingSessions.length + pastSessions.length}</p></div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{ background: 'var(--accent-purple-subtle)', borderColor: 'var(--accent-purple)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-purple-muted)' }}><Calendar className="w-6 h-6" style={{ color: 'var(--accent-purple)' }} /></div>
              <div><p className="text-[var(--foreground-muted)] text-sm">Upcoming</p><p className="text-[var(--foreground)] text-xl">{upcomingSessions.length}</p></div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900/30"><Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" /></div>
              <div><p className="text-[var(--foreground-muted)] text-sm">Pending</p><p className="text-[var(--foreground)] text-xl">{requests.length}</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Sessions List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="requests" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="requests">Pending Requests ({filteredRequests.length})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({filteredUpcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Past Sessions ({filteredPast.length})</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {isDateSelected && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)} className="text-red-500 hover:text-red-600">
                    Clear Date Filter
                  </Button>
                )}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Types</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="requests" className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-xl bg-[var(--card)]">
                  <div className="flex justify-between items-start">
                    <div><h4 className="font-bold">{request.mentee}</h4><p className="text-sm">{request.type}</p></div>
                    <Button size="sm" onClick={() => handleAcceptSession(request.id)}>Accept</Button>
                  </div>
                </div>
              ))}
              {filteredRequests.length === 0 && <div className="text-center p-8 text-gray-500">No requests {isDateSelected ? 'for this date' : ''}</div>}
            </TabsContent>

            <TabsContent value="upcoming">
              {filteredUpcoming.map(s => (
                <div key={s.id} className="p-6 border rounded-xl bg-[var(--card)] mb-4">
                  <h4 className="font-bold">{s.mentee}</h4>
                  <p className="text-sm text-gray-500 mb-2">{s.date} at {s.time}</p>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-purple-600" onClick={() => handleStartSession(s.jitsiLink)}><Video className="w-4 h-4 mr-2" /> Start</Button>
                  </div>
                </div>
              ))}
              {filteredUpcoming.length === 0 && <div className="text-center p-8 text-gray-500">No upcoming sessions {isDateSelected ? 'for this date' : ''}</div>}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {filteredPast.map((session, index) => (
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
              {filteredPast.length === 0 && <div className="text-center p-8 text-gray-500">No past sessions {isDateSelected ? 'for this date' : ''}</div>}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Calendar */}
        <div className="space-y-6">
          <div className="p-4 border rounded-xl bg-[var(--card)]">
            <h3 className="font-semibold mb-4">Calendar</h3>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border-[var(--border)]"
              modifiers={hasSessionModifier}
              modifiersStyles={hasSessionStyles}
            />
            <div className="mt-4 text-sm text-[var(--foreground-muted)] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--accent-purple)]"></div>
              <span>Underlined dates have sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

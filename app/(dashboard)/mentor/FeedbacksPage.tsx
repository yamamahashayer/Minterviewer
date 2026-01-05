"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { MessageSquare, Star, TrendingUp, Send, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Interfaces
interface PendingFeedback {
  id: string;
  menteeId: string;
  menteeName: string;
  sessionTitle: string;
  date: string;
  rawDate: string;
}

interface SubmittedFeedback {
  id: string;
  menteeName: string;
  sessionTitle: string;
  date: string;
  rating: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface ReceivedFeedback {
  id: string;
  studentName: string;
  sessionTitle: string;
  date: string;
  rating: number;
  feedback: string;
  tags: string[];
}

const aiSuggestions = [
  'Great improvement in technical problem-solving! Keep up the excellent work.',
  'Shows strong analytical thinking and attention to detail.',
  'Demonstrated excellent communication skills during the session.',
  'Ready to move to more advanced topics in the next session.',
  'Consider focusing more on edge cases and error handling.'
];

export const FeedbacksPage = () => {
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [completedFeedback, setCompletedFeedback] = useState<SubmittedFeedback[]>([]);
  const [receivedFeedback, setReceivedFeedback] = useState<ReceivedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState('all');

  // Form State
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [activeSession, setActiveSession] = useState<PendingFeedback | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/mentor/feedbacks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingFeedback(data.data.pending);
        setCompletedFeedback(data.data.submitted);
        setReceivedFeedback(data.data.received);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!activeSession || rating === 0 || !feedbackText) return;

    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/mentor/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: activeSession.id,
          menteeId: activeSession.menteeId,
          rating,
          feedback: feedbackText,
          strengths: [], // Can implement tag input later
          improvements: []
        })
      });

      if (res.ok) {
        // Refresh Data
        await fetchFeedbacks();
        setFeedbackText('');
        setRating(0);
        setActiveSession(null);
        // Close dialog logic handled by state reset or UI trigger ref if needed
        // For now assuming dialog closes or we force re-render
      }
    } catch (error) {
      console.error("Error submitting feedback", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPending = selectedMentee === 'all'
    ? pendingFeedback
    : pendingFeedback.filter(f => f.menteeName === selectedMentee);

  if (loading) return <div className="p-8 text-center text-white">Loading feedbacks...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Feedbacks</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Manage feedbacks given and view reviews received.</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Reviews Received</p>
                <p className="text-[var(--foreground)] text-xl">{receivedFeedback.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Given Feedback</p>
                <p className="text-[var(--foreground)] text-xl">{completedFeedback.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Pending</p>
                <p className="text-[var(--foreground)] text-xl">{pendingFeedback.length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Feedback List */}
        <div className="lg:col-span-2 space-y-6">

          <Tabs defaultValue="received" className="w-full">
            <TabsList className="mb-4 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger value="received" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">Reviews Received</TabsTrigger>
              <TabsTrigger value="given" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">Feedback Given</TabsTrigger>
            </TabsList>

            <TabsContent value="given" className="space-y-6">
              {/* Pending Feedback Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]">Pending Feedback</h3>
                  {/* Filter can go here */}
                </div>

                <div className="space-y-4">
                  {filteredPending.length === 0 && <p className="text-gray-500 italic">No pending feedback tasks.</p>}
                  {filteredPending.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-[var(--foreground)] mb-1">{item.menteeName}</h4>
                          <p className="text-[var(--foreground-muted)] text-sm">{item.sessionTitle}</p>
                          <p className="text-[var(--foreground-subtle)] text-xs mt-1">{item.date}</p>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">Pending</Badge>
                      </div>

                      <Dialog onOpenChange={(open) => { if (open) setActiveSession(item); }}>
                        <DialogTrigger className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-300 hover:from-orange-500/30 hover:to-red-500/30 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                          <Send className="w-4 h-4 mr-2" /> Give Feedback
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <DialogHeader>
                            <DialogTitle>Add Feedback for {item.menteeName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="mb-2 block" style={{ color: 'var(--foreground)' }}>Session Rating</label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={`w-8 h-8 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} onClick={() => setRating(star)} />
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="mb-2 block" style={{ color: 'var(--foreground)' }}>Feedback</label>
                              <Textarea placeholder="Write your feedback here..." className="min-h-32" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white" onClick={handleSubmitFeedback} disabled={submitting}>
                              <Send className="w-4 h-4 mr-2" /> {submitting ? 'Submitting...' : 'Submit Feedback'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Submitted Feedback History */}
              <div>
                <h3 className="text-[var(--foreground)] mb-4">You Said (History)</h3>
                <div className="space-y-4">
                  {completedFeedback.length === 0 && <p className="text-gray-500 italic">No feedbacks given yet.</p>}
                  {completedFeedback.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-all"
                      style={{ background: 'var(--card)' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                              <span className="text-white text-sm">{(item.menteeName || "U").charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="text-[var(--foreground)]">{item.menteeName}</h4>
                              <p className="text-[var(--foreground-muted)] text-sm">{item.sessionTitle}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white">{item.rating}</span>
                          </div>
                          <p className="text-gray-500 text-xs">{item.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{item.feedback}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="received" className="space-y-4">
              <h3 className="text-[var(--foreground)] mb-4">Reviews from Mentees</h3>
              <div className="space-y-4">
                {receivedFeedback.length === 0 && <p className="text-gray-500 italic">No reviews received yet.</p>}
                {receivedFeedback.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all bg-purple-500/5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white text-sm">{(item.studentName || "S").charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="text-[var(--foreground)]">{item.studentName}</h4>
                            <p className="text-[var(--foreground-muted)] text-sm">{item.sessionTitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{item.rating}</span>
                        </div>
                        <p className="text-gray-500 text-xs">{item.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">"{item.feedback}"</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

        </div>

        {/* Right - AI Suggestions (Existing) */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/40 p-6 sticky top-8"
            style={{ background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 style={{ color: 'var(--foreground)' }}>AI Suggestions</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Quick feedback phrases</p>
                <p className="text-xs text-purple-400 mt-1">Use specific feedback to help your mentees improve.</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-lg p-3 border cursor-pointer transition-all text-sm hover:border-purple-500/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground-muted)'
                  }}
                  onClick={() => setFeedbackText(suggestion)}
                >
                  "{suggestion}"
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

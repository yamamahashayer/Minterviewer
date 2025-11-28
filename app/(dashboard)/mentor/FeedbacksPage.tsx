"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { MessageSquare, Star, TrendingUp, Send, Sparkles, User } from 'lucide-react';
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

const feedbackData = [
  {
    id: 1,
    mentee: 'Sarah Mitchell',
    session: 'Technical Interview Practice',
    date: 'Oct 10, 2025',
    rating: 4.5,
    feedback: 'Excellent progress in component architecture and state management. Shows strong understanding of React hooks.',
    strengths: ['Problem Solving', 'Code Quality', 'Communication'],
    improvements: ['System Design', 'Time Management']
  },
  {
    id: 2,
    mentee: 'James Rodriguez',
    session: 'System Design Mock',
    date: 'Oct 12, 2025',
    rating: 4.0,
    feedback: 'Strong technical foundation. Could improve on explaining trade-offs in architectural decisions.',
    strengths: ['Technical Knowledge', 'Problem Analysis'],
    improvements: ['Communication', 'Whiteboarding']
  },
  {
    id: 3,
    mentee: 'Emily Chen',
    session: 'Advanced Algorithms',
    date: 'Oct 13, 2025',
    rating: 5.0,
    feedback: 'Outstanding performance! Excellent at explaining complex solutions clearly. Ready for senior-level interviews.',
    strengths: ['Algorithms', 'Code Optimization', 'Communication', 'Confidence'],
    improvements: []
  }
];

const pendingFeedback = [
  { id: 4, mentee: 'Michael Brown', session: 'Cloud Architecture Review', date: 'Oct 8, 2025' },
  { id: 5, mentee: 'Lisa Wang', session: 'Mobile Architecture', date: 'Oct 11, 2025' }
];

const aiSuggestions = [
  'Great improvement in technical problem-solving! Keep up the excellent work.',
  'Shows strong analytical thinking and attention to detail.',
  'Demonstrated excellent communication skills during the session.',
  'Ready to move to more advanced topics in the next session.',
  'Consider focusing more on edge cases and error handling.'
];

export const FeedbacksPage = () => {
  const [selectedMentee, setSelectedMentee] = useState('all');
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Feedbacks</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Manage and provide feedback to your mentees</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Total Feedback</p>
                <p className="text-[var(--foreground)] text-xl">{feedbackData.length}</p>
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

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Avg Rating</p>
                <p className="text-white text-xl">4.5</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-white text-xl">24</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Feedback List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]">Pending Feedback</h3>
              <Select value={selectedMentee} onValueChange={setSelectedMentee}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by mentee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mentees</SelectItem>
                  <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                  <SelectItem value="james">James Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {pendingFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-[var(--foreground)] mb-1">{item.mentee}</h4>
                      <p className="text-[var(--foreground-muted)] text-sm">{item.session}</p>
                      <p className="text-[var(--foreground-subtle)] text-xs mt-1">{item.date}</p>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                      Pending
                    </Badge>
                  </div>

                  <Dialog>
                    <DialogTrigger className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-300 hover:from-orange-500/30 hover:to-red-500/30 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      <Send className="w-4 h-4 mr-2" />
                      Add Feedback
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <DialogHeader>
                        <DialogTitle>Add Feedback for {item.mentee}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="mb-2 block" style={{ color: 'var(--foreground)' }}>Session Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400 cursor-pointer" />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block" style={{ color: 'var(--foreground)' }}>Feedback</label>
                          <Textarea
                            placeholder="Write your feedback here..."
                            className="min-h-32"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                          />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submitted Feedback */}
          <div>
            <h3 className="text-[var(--foreground)] mb-4">Recent Feedback</h3>
            <div className="space-y-4">
              {feedbackData.map((item, index) => (
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
                          <span className="text-white text-sm">{item.mentee.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-[var(--foreground)]">{item.mentee}</h4>
                          <p className="text-[var(--foreground-muted)] text-sm">{item.session}</p>
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

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-2">Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {item.strengths.map((strength, i) => (
                          <Badge key={i} className="bg-green-500/20 text-green-300 border-green-500/30">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {item.improvements.length > 0 && (
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs mb-2">Areas to Improve</p>
                        <div className="flex flex-wrap gap-2">
                          {item.improvements.map((improvement, i) => (
                            <Badge key={i} className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - AI Suggestions */}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--foreground-muted)';
                  }}
                  onClick={() => setFeedbackText(suggestion)}
                >
                  "{suggestion}"
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Feedback
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { FileText, Upload, Download, Send, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const pendingReviews = [
  {
    id: 1,
    mentee: 'Sarah Mitchell',
    avatar: 'S',
    submittedDate: 'Oct 12, 2025',
    fileName: 'Sarah_Mitchell_Resume.pdf',
    targetRole: 'Senior Frontend Developer',
    priority: 'high'
  },
  {
    id: 2,
    mentee: 'James Rodriguez',
    avatar: 'J',
    submittedDate: 'Oct 11, 2025',
    fileName: 'James_Rodriguez_CV.pdf',
    targetRole: 'Full Stack Engineer',
    priority: 'medium'
  }
];

const completedReviews = [
  {
    id: 3,
    mentee: 'Emily Chen',
    avatar: 'E',
    submittedDate: 'Oct 8, 2025',
    completedDate: 'Oct 9, 2025',
    fileName: 'Emily_Chen_Resume.pdf',
    targetRole: 'Software Engineer',
    feedback: 'Excellent technical skills section. Consider adding more quantifiable achievements and impact metrics. Overall structure is strong.'
  },
  {
    id: 4,
    mentee: 'Michael Brown',
    avatar: 'M',
    submittedDate: 'Oct 5, 2025',
    completedDate: 'Oct 6, 2025',
    fileName: 'Michael_Brown_CV.pdf',
    targetRole: 'Backend Developer',
    feedback: 'Good experience section but needs better formatting. Add more specific technical skills and remove outdated technologies.'
  }
];

const aiSuggestions = [
  'Strong technical skills but consider reorganizing to highlight most relevant experience first',
  'Add quantifiable achievements (e.g., "Improved performance by 40%")',
  'Include keywords from target job description for ATS optimization',
  'Consider adding a brief professional summary at the top',
  'Update skills section to include latest technologies and frameworks'
];

export const CVReviewPage = () => {
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">CV Review & Career Guidance</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Provide professional feedback on mentee resumes and career paths</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Pending</p>
                <p className="text-[var(--foreground)] text-xl">{pendingReviews.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Completed</p>
                <p className="text-[var(--foreground)] text-xl">{completedReviews.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Total Reviews</p>
                <p className="text-[var(--foreground)] text-xl">47</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Avg Rating</p>
                <p className="text-[var(--foreground)] text-xl">4.9</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Pending Reviews
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Completed
              </TabsTrigger>
            </TabsList>

            {/* Pending Reviews */}
            <TabsContent value="pending" className="space-y-4">
              {pendingReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-orange-500/30 p-6"
                  style={{ background: 'var(--card)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white">{review.avatar}</span>
                      </div>
                      <div>
                        <h4 className="text-[var(--foreground)] mb-1">{review.mentee}</h4>
                        <p className="text-[var(--foreground-muted)] text-sm">Submitted: {review.submittedDate}</p>
                      </div>
                    </div>
                    <Badge className={
                      review.priority === 'high'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }>
                      {review.priority} priority
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <p className="text-[var(--foreground)] text-sm">{review.fileName}</p>
                    </div>
                    <p className="text-[var(--foreground-muted)] text-sm">Target Role: <span className="text-[var(--foreground)]">{review.targetRole}</span></p>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your detailed feedback here..."
                      className="min-h-32"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30">
                        <Download className="w-4 h-4 mr-2" />
                        Download CV
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Completed Reviews */}
            <TabsContent value="completed" className="space-y-4">
              {completedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-green-500/30 p-6"
                  style={{ background: 'var(--card)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-[var(--foreground)] mb-1">{review.mentee}</h4>
                        <p className="text-[var(--foreground-muted)] text-sm">Completed: {review.completedDate}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Completed
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <p className="text-[var(--foreground)] text-sm">{review.fileName}</p>
                    </div>
                    <p className="text-[var(--foreground-muted)] text-sm">Target Role: <span className="text-[var(--foreground)]">{review.targetRole}</span></p>
                  </div>

                  <div className="rounded-lg p-4" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                    <h5 className="text-[var(--foreground)] text-sm mb-2">Your Feedback:</h5>
                    <p className="text-[var(--foreground)] text-sm">{review.feedback}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Suggestions Sidebar */}
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
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Common feedback points</p>
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
                  onClick={() => setFeedbackText(prev => prev + (prev ? '\n\n' : '') + '• ' + suggestion)}
                >
                  {suggestion}
                </motion.div>
              ))}
            </div>

            <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Review
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

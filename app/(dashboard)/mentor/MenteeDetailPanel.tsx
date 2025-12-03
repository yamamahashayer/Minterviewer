"use client";

import { motion ,AnimatePresence} from "framer-motion";

import { X, Mail, MessageSquare, FileText, Calendar, TrendingUp, Target } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from './ImageWithFallback';

interface MenteeDetailPanelProps {
  mentee: {
    id: number;
    name: string;
    role: string;
    image: string;
    progress: number;
    aiConfidence: number;
    lastSession: string;
    status: 'active' | 'inactive';
    skillArea: string;
    skills: { name: string; level: number }[];
    recentFeedback: string[];
    nextSession: string;
  } | null;
  onClose: () => void;
}

export const MenteeDetailPanel = ({ mentee, onClose }: MenteeDetailPanelProps) => {
  return (
    <AnimatePresence>
      {mentee && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-950 border-l border-gray-700 overflow-y-auto z-50 shadow-[0_0_60px_rgba(6,182,212,0.3)]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-700 p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-cyan-500/50 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                      <ImageWithFallback
                        src={mentee.image}
                        alt={mentee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-gray-900 ${
                      mentee.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    } shadow-lg`} />
                  </div>
                  <div>
                    <h2 className="text-[var(--foreground)] mb-1">{mentee.name}</h2>
                    <p className="text-[var(--foreground-muted)]">{mentee.role}</p>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mt-2">
                      {mentee.skillArea}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-[var(--background-muted)]"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-[var(--foreground-muted)] text-xs mb-1">Overall Progress</p>
                  <p className="text-[var(--foreground)] text-xl">{mentee.progress}%</p>
                  <Progress value={mentee.progress} className="h-1.5 mt-2" />
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-[var(--foreground-muted)] text-xs mb-1">AI Confidence</p>
                  <p className="text-[var(--foreground)] text-xl">{mentee.aiConfidence}%</p>
                  <Progress value={mentee.aiConfidence} className="h-1.5 mt-2 [&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-green-500" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Skills & Strengths */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-[var(--foreground)]">Skills & Strengths</h3>
                </div>
                <div className="space-y-3">
                  {mentee.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm">{skill.name}</span>
                        <span className="text-cyan-400 text-sm">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-purple-500/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <h3 className="text-[var(--foreground)]">Recent Interview Feedback</h3>
                </div>
                <div className="space-y-3">
                  {mentee.recentFeedback.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 border border-gray-700/30 text-gray-300 text-sm"
                    >
                      "{feedback}"
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Session */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-teal-500/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  <h3 className="text-[var(--foreground)]">Next Scheduled Session</h3>
                </div>
                <p className="text-[var(--foreground-muted)] mb-4">{mentee.nextSession}</p>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-[0_0_20px_rgba(20,184,166,0.4)] text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule Session
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-[var(--foreground)] mb-4">Quick Actions</h3>
                <Button className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] justify-start">
                  <Mail className="w-4 h-4 mr-3" />
                  Send Message
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] justify-start">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Add Feedback
                </Button>
                <Button className="w-full bg-gradient-to-r from-teal-500/20 to-green-500/20 border border-teal-500/50 text-teal-300 hover:from-teal-500/30 hover:to-green-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  View Full Report
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

"use client";

import { motion } from "framer-motion";
import { MessageSquare, Plus, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const mentees = [
  { 
    id: 1, 
    name: 'Sarah Mitchell', 
    initial: 'S', 
    color: 'from-cyan-500 to-blue-500',
    lastFeedback: '2 days ago'
  },
  { 
    id: 2, 
    name: 'James Rodriguez', 
    initial: 'J', 
    color: 'from-teal-500 to-green-500',
    lastFeedback: '5 days ago'
  },
  { 
    id: 3, 
    name: 'Emily Chen', 
    initial: 'E', 
    color: 'from-purple-500 to-pink-500',
    lastFeedback: '1 day ago'
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    initial: 'M', 
    color: 'from-orange-500 to-red-500',
    lastFeedback: '1 week ago'
  }
];

const aiSuggestions = [
  "Great improvement in technical problem-solving! Keep up the excellent work.",
  "Focus on clearer communication during system design discussions.",
  "Outstanding progress in behavioral interview confidence."
];

export const FeedbackManager = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--accent-cyan)',
        boxShadow: '0 0 30px var(--glow-cyan), 0 4px 16px var(--shadow-md)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
            background: 'var(--accent-cyan-subtle)'
          }}>
            <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <h3 className="text-[var(--foreground)]">Feedback Manager</h3>
            <p className="text-[var(--foreground-muted)] text-sm">Provide feedback to your mentees</p>
          </div>
        </div>
      </div>

      {/* Mentees List */}
      <div className="space-y-3 mb-6">
        {mentees.map((mentee, index) => (
          <motion.div
            key={mentee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-lg border p-4 transition-all"
            style={{
              background: 'var(--background-muted)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${mentee.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-white">{mentee.initial}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-[var(--foreground)]">{mentee.name}</h4>
                <p className="text-[var(--foreground-muted)] text-xs">Last feedback: {mentee.lastFeedback}</p>
              </div>
              <Button 
                size="sm" 
                className={`bg-gradient-to-r ${mentee.color} text-white`}
              >
                <Plus className="w-4 h-4 mr-1" />
                Give Feedback
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="rounded-lg border p-4" style={{
        background: 'var(--accent-purple-subtle)',
        borderColor: 'var(--accent-purple)'
      }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-purple)' }} />
          <h4 className="text-[var(--foreground)]">AI Suggested Feedback Phrases</h4>
        </div>
        <div className="space-y-2">
          {aiSuggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="w-full text-left p-3 rounded-lg border transition-all"
              style={{
                background: 'var(--background-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--foreground-muted)'
              }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

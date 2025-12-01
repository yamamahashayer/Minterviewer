"use client";

import { motion } from "framer-motion";
import { Send, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';

const actions = [
  {
    icon: Send,
    label: 'Message Mentee',
    color: 'from-cyan-500 to-blue-500',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
  },
  {
    icon: Calendar,
    label: 'Schedule Session',
    color: 'from-teal-500 to-green-500',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]'
  },
  {
    icon: BarChart3,
    label: 'Analyze Progress',
    color: 'from-purple-500 to-pink-500',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'
  },
  {
    icon: Sparkles,
    label: 'AI Recommendation',
    color: 'from-yellow-500 to-orange-500',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]'
  }
];

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 4px 16px var(--shadow-md)'
      }}
    >
      <h3 className="text-[var(--foreground)] mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full h-14 bg-gradient-to-r ${action.color} text-white transition-all ${action.hoverShadow} justify-start px-5`}
            >
              <action.icon className="w-5 h-5 mr-3" />
              <span>{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

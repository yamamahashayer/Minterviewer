"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles } from 'lucide-react';

export const HighlightBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
      style={{
        background: 'linear-gradient(135deg, var(--warning), var(--accent-purple))',
        borderColor: 'var(--warning)',
        boxShadow: '0 0 40px rgba(249, 184, 79, 0.3), 0 8px 24px var(--shadow-md)'
      }}
    >
      {/* Animated Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 w-full h-full blur-2xl"
        style={{ background: 'linear-gradient(to right, rgba(249, 184, 79, 0.2), rgba(123, 97, 232, 0.2))' }}
      />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--warning), var(--error))',
            boxShadow: '0 0 30px rgba(249, 184, 79, 0.6)'
          }}
        >
          <Trophy className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="text-white">This Week's Highlight</h3>
          </div>
          <p className="text-white/90">
            Your mentee <span className="text-white">Sara Hamdan</span> achieved{' '}
            <span className="text-white">92% improvement</span> in behavioral interviews 🎉
          </p>
        </div>

        {/* Celebration Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full">
          <span className="text-yellow-300">Outstanding!</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 right-2">
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

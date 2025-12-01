"use client";

import { motion } from "framer-motion";
import { Edit, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from './ImageWithFallback';

export const ProfileOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-[var(--card)] backdrop-blur-xl border border-[var(--accent-cyan)]/30 p-8"
      style={{ boxShadow: '0 0 40px var(--card-shadow), 0 8px 32px var(--shadow-lg)' }}
    >
      {/* Glowing Background Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ background: `linear-gradient(to bottom right, var(--glow-cyan), var(--glow-teal))` }} />
      
      <div className="relative flex items-start gap-6">
        {/* Profile Photo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full border-4 overflow-hidden" style={{ borderColor: 'var(--accent-cyan)', boxShadow: '0 0 30px var(--glow-cyan)' }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
              alt="Mentor Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-[var(--warning)] to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4" style={{ borderColor: 'var(--background)' }}>
            <Award className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1">
          <div>
            <h1 className="text-[var(--foreground)] mb-2">Dr. Michael Chen</h1>
            <p className="text-[var(--foreground-muted)] mb-3">Senior Software Architect | Ex-Google, Ex-Meta</p>
            <Badge className="border" style={{ 
              background: `linear-gradient(to right, var(--accent-cyan-subtle), var(--accent-teal-subtle))`,
              borderColor: 'var(--accent-cyan)',
              color: 'var(--accent-cyan)'
            }}>
              Level 3 Mentor
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-[var(--background-muted)] rounded-lg p-4 border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-cyan-subtle)' }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)] text-sm">Total Mentees</p>
                  <p className="text-[var(--foreground)]">32</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--background-muted)] rounded-lg p-4 border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-teal-subtle)' }}>
                  <Award className="w-6 h-6" style={{ color: 'var(--accent-teal)' }} />
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)] text-sm">Completed Sessions</p>
                  <p className="text-[var(--foreground)]">248</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--background-muted)] rounded-lg p-4 border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-subtle)' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--warning)' }} />
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)] text-sm">Average Rating</p>
                  <p className="text-[var(--foreground)]">4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Bottom of Profile */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 transition-all"
              style={{
                borderColor: 'var(--accent-cyan)',
                background: 'var(--accent-cyan-subtle)',
                color: 'var(--accent-cyan)'
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button className="flex-1 text-white" style={{ 
              background: `linear-gradient(to right, var(--accent-cyan), var(--accent-teal))`,
              boxShadow: '0 0 20px var(--glow-cyan)'
            }}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Stats
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

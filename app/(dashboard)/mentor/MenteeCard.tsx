"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Video, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from './ImageWithFallback';

interface MenteeCardProps {
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
  };
  onClick: () => void;
}

export const MenteeCard = ({ mentee, onClick }: MenteeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl backdrop-blur-xl border p-6 cursor-pointer transition-all"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 4px 16px var(--shadow-md)'
      }}
    >
      {/* Glowing Background Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{
        background: 'linear-gradient(135deg, var(--glow-cyan), var(--glow-teal))'
      }} />
      
      <div className="relative">
        {/* Header with Profile */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 overflow-hidden" style={{
              borderColor: 'var(--accent-cyan)',
              boxShadow: '0 0 20px var(--glow-cyan)'
            }}>
              <ImageWithFallback
                src={mentee.image}
                alt={mentee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${
              mentee.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
            }`} style={{ borderColor: 'var(--card)' }} />
          </div>

          <div className="flex-1">
            <h4 className="text-[var(--foreground)] mb-1">{mentee.name}</h4>
            <p className="text-[var(--foreground-muted)] text-sm mb-2">{mentee.role}</p>
            <Badge style={{
              background: 'var(--accent-cyan-subtle)',
              color: 'var(--accent-cyan)',
              borderColor: 'var(--accent-cyan)'
            }} className="text-xs">
              {mentee.skillArea}
            </Badge>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--foreground-muted)] text-sm">Overall Progress</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{mentee.progress}%</span>
            </div>
            <Progress value={mentee.progress} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--foreground-muted)] text-sm">AI Confidence Score</span>
              <span style={{ color: 'var(--accent-teal)' }}>{mentee.aiConfidence}%</span>
            </div>
            <Progress value={mentee.aiConfidence} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-green-500" />
          </div>
        </div>

        {/* Last Session */}
        <div className="flex items-center gap-2 mb-4 text-sm text-[var(--foreground-muted)]">
          <Calendar className="w-4 h-4" />
          <span>Last session: {mentee.lastSession}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1 border"
            variant="outline"
            style={{
              background: 'var(--accent-cyan-subtle)',
              color: 'var(--accent-cyan)',
              borderColor: 'var(--accent-cyan)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            style={{
              boxShadow: '0 0 15px var(--glow-cyan)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Video className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

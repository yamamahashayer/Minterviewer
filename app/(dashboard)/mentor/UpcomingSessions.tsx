import { motion } from "framer-motion";
import { Calendar, Clock, Video } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const sessions = [
  {
    id: 1,
    mentee: 'Sarah Mitchell',
    type: 'Technical Interview',
    date: 'Oct 14, 2025',
    time: '10:00 AM',
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30'
  },
  {
    id: 2,
    mentee: 'James Rodriguez',
    type: 'Behavioral Mock',
    date: 'Oct 14, 2025',
    time: '2:30 PM',
    color: 'from-teal-500 to-green-500',
    borderColor: 'border-teal-500/30'
  },
  {
    id: 3,
    mentee: 'Emily Chen',
    type: 'AI Mock Interview',
    date: 'Oct 15, 2025',
    time: '11:00 AM',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30'
  }
];

export const UpcomingSessions = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--foreground)]">Upcoming Sessions</h3>
        <Badge style={{
          background: 'var(--accent-cyan-subtle)',
          color: 'var(--accent-cyan)',
          borderColor: 'var(--accent-cyan)'
        }}>
          {sessions.length} Scheduled
        </Badge>
      </div>

      <div className="grid gap-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-xl backdrop-blur-xl border ${session.borderColor} p-5 cursor-pointer group transition-all`}
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: '0 2px 8px var(--shadow-md)'
            }}
          >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${session.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${session.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white">{session.mentee.charAt(0)}</span>
                </div>

                {/* Session Info */}
                <div className="flex-1">
                  <h4 className="text-[var(--foreground)] mb-1">{session.mentee}</h4>
                  <Badge style={{
                    background: 'var(--background-muted)',
                    color: 'var(--foreground-muted)',
                    borderColor: 'var(--border)'
                  }} className="mb-2">
                    {session.type}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
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
              </div>

              {/* Start Button - Full Width */}
              <Button className={`w-full bg-gradient-to-r ${session.color} hover:opacity-90 text-white`} style={{
                boxShadow: '0 0 20px var(--glow-cyan)'
              }}>
                <Video className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// app/(dashboard)/mentor/PerformanceStats.tsx
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Award, Users, TrendingUp, Trophy } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

const COLORS = ['#14b8a6', 'var(--background-muted)'];

interface StatsProps {
  stats: {
    satisfaction: string;
    sessionsThisWeek: number;
    rank: string;
    level: number;
    xp: number;
    maxXp: number;
    progress: number;
  };
}

export const PerformanceStats = ({ stats }: StatsProps) => {
  if (!stats) return null;

  const levelData = [
    { name: 'Completed', value: stats.progress },
    { name: 'Remaining', value: 100 - stats.progress }
  ];

  const displayStats = [
    {
      icon: Users,
      label: 'Mentee Satisfaction',
      value: stats.satisfaction,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      icon: Award,
      label: 'Sessions This Week',
      value: stats.sessionsThisWeek.toString(),
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-500/20 to-green-500/20'
    },
    {
      icon: Trophy,
      label: 'Current Level',
      value: `Lvl ${stats.level}`,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-500/20 to-orange-500/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--accent-teal)',
        boxShadow: '0 0 30px var(--glow-teal), 0 4px 16px var(--shadow-md)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
          background: 'rgba(13, 148, 136, 0.15)',
          border: '1px solid rgba(13, 148, 136, 0.3)'
        }}>
          <Trophy className="w-5 h-5" style={{ color: '#0D9488' }} />
        </div>
        <div>
          <h3 className="text-[var(--foreground)]">Mentor Performance Stats</h3>
          <p className="text-[var(--foreground-muted)] text-sm">Your impact and achievements</p>
        </div>
      </div>

      {/* Level Progress Chart */}
      <div className="mb-6 rounded-lg p-6 border" style={{
        background: 'var(--background-muted)',
        borderColor: 'var(--border)'
      }}>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[var(--foreground)]">{stats.progress}%</p>
                <p className="text-[var(--foreground-muted)] text-xs">Level {stats.level}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-[var(--foreground)] mb-2">Mentor Level Progress</h4>
            <p className="text-[var(--foreground-muted)] text-sm mb-3">
              {100 - stats.progress}% until Level {stats.level + 1}
            </p>
            <Progress value={stats.progress} className="h-2" />
            <p className="text-sm mt-2" style={{ color: 'var(--accent-teal)' }}>
              {stats.xp} / {stats.maxXp} XP
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {displayStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg p-4 border"
            style={{
              background: 'var(--background-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--foreground-muted)] text-xs">{stat.label}</p>
                <p className="text-[var(--foreground)] mt-0.5">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

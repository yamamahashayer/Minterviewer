"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const data = [
  { week: 'Week 1', progress: 45 },
  { week: 'Week 2', progress: 52 },
  { week: 'Week 3', progress: 61 },
  { week: 'Week 4', progress: 68 },
  { week: 'Week 5', progress: 75 },
  { week: 'Week 6', progress: 82 },
  { week: 'Week 7', progress: 88 }
];

export const MenteesProgress = () => {
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
            background: 'var(--accent-teal-subtle)'
          }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-teal)' }} />
          </div>
          <div>
            <h3 className="text-[var(--foreground)]">Mentees Progress Overview</h3>
            <p className="text-[var(--foreground-muted)] text-sm">Average improvement tracking</p>
          </div>
        </div>

        {/* Filter */}
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select mentee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mentees</SelectItem>
            <SelectItem value="sarah">Sarah Mitchell</SelectItem>
            <SelectItem value="james">James Rodriguez</SelectItem>
            <SelectItem value="emily">Emily Chen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--foreground-muted)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--foreground-muted)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--accent-teal)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ fill: '#14b8a6', r: 5 }}
              activeDot={{ r: 7, fill: '#0d9488' }}
              fill="url(#colorProgress)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-[var(--foreground-muted)] text-sm">Average Progress</p>
          <p className="text-[var(--foreground)] mt-1">68%</p>
        </div>
        <div>
          <p className="text-[var(--foreground-muted)] text-sm">Top Performer</p>
          <p className="text-[var(--foreground)] mt-1">Emily Chen</p>
        </div>
        <div>
          <p className="text-[var(--foreground-muted)] text-sm">Growth Rate</p>
          <p className="mt-1" style={{ color: 'var(--accent-teal)' }}>+12% this week</p>
        </div>
      </div>
    </motion.div>
  );
};

"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Search, Plus, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { MenteeCard } from './MenteeCard';
import { MenteeDetailPanel } from './MenteeDetailPanel';

const menteesData = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Frontend Developer',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMzIxODAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 78,
    aiConfidence: 82,
    lastSession: 'Oct 10, 2025',
    status: 'active' as const,
    skillArea: 'React & TypeScript',
    skills: [
      { name: 'React Development', level: 85 },
      { name: 'TypeScript', level: 78 },
      { name: 'System Design', level: 65 },
      { name: 'Communication', level: 90 }
    ],
    recentFeedback: [
      'Excellent progress in component architecture and state management',
      'Shows strong understanding of React hooks and performance optimization',
      'Needs to work on explaining technical decisions more clearly'
    ],
    nextSession: 'October 16, 2025 at 2:00 PM - Technical Interview Practice'
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Full Stack Engineer',
    image: 'https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjAzMTg5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 65,
    aiConfidence: 70,
    lastSession: 'Oct 12, 2025',
    status: 'active' as const,
    skillArea: 'Backend & APIs',
    skills: [
      { name: 'Node.js & Express', level: 80 },
      { name: 'Database Design', level: 72 },
      { name: 'API Development', level: 75 },
      { name: 'Problem Solving', level: 68 }
    ],
    recentFeedback: [
      'Strong technical foundation in backend development',
      'Could improve on explaining trade-offs in architectural decisions',
      'Great progress in behavioral interview scenarios'
    ],
    nextSession: 'October 15, 2025 at 10:00 AM - System Design Mock'
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1681887001651-a15c749c1ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjAzMzIwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 92,
    aiConfidence: 88,
    lastSession: 'Oct 13, 2025',
    status: 'active' as const,
    skillArea: 'Algorithms & DS',
    skills: [
      { name: 'Data Structures', level: 92 },
      { name: 'Algorithms', level: 88 },
      { name: 'Code Optimization', level: 85 },
      { name: 'Technical Communication', level: 90 }
    ],
    recentFeedback: [
      'Outstanding performance in algorithm challenges',
      'Excellent at explaining complex solutions clearly',
      'Ready for senior-level technical interviews'
    ],
    nextSession: 'October 14, 2025 at 3:00 PM - Advanced Algorithms'
  },
  {
    id: 4,
    name: 'Michael Brown',
    role: 'Backend Developer',
    image: 'https://images.unsplash.com/photo-1637856794303-d864ce316444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRlY2glMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYwMzMyMDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 58,
    aiConfidence: 62,
    lastSession: 'Oct 8, 2025',
    status: 'active' as const,
    skillArea: 'Cloud & DevOps',
    skills: [
      { name: 'AWS Services', level: 70 },
      { name: 'Docker & K8s', level: 65 },
      { name: 'CI/CD Pipelines', level: 60 },
      { name: 'System Architecture', level: 55 }
    ],
    recentFeedback: [
      'Good understanding of cloud fundamentals',
      'Needs more practice with real-world system design scenarios',
      'Improving confidence in technical discussions'
    ],
    nextSession: 'October 17, 2025 at 11:00 AM - Cloud Architecture Review'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Mobile Developer',
    image: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDMwMDI5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 71,
    aiConfidence: 76,
    lastSession: 'Oct 11, 2025',
    status: 'active' as const,
    skillArea: 'React Native',
    skills: [
      { name: 'React Native', level: 82 },
      { name: 'Mobile UX/UI', level: 78 },
      { name: 'Performance', level: 70 },
      { name: 'Cross-platform', level: 75 }
    ],
    recentFeedback: [
      'Excellent mobile development skills',
      'Great attention to user experience details',
      'Should focus more on performance optimization techniques'
    ],
    nextSession: 'October 16, 2025 at 1:00 PM - Mobile Architecture'
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Data Engineer',
    image: 'https://images.unsplash.com/photo-1737574107736-9e02ca5d5387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYwMzMyMDg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 45,
    aiConfidence: 52,
    lastSession: 'Oct 5, 2025',
    status: 'inactive' as const,
    skillArea: 'Data Pipelines',
    skills: [
      { name: 'Python & SQL', level: 65 },
      { name: 'Data Modeling', level: 58 },
      { name: 'ETL Processes', level: 50 },
      { name: 'Big Data Tools', level: 45 }
    ],
    recentFeedback: [
      'Solid foundation in data fundamentals',
      'Needs more hands-on practice with real datasets',
      'Showing improvement in SQL optimization'
    ],
    nextSession: 'Not scheduled - Follow up needed'
  }
];

export const MyMenteesContent = () => {
  const [selectedMentee, setSelectedMentee] = useState<typeof menteesData[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  const filteredMentees = menteesData
    .filter((mentee) => {
      const matchesSearch = mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mentee.skillArea.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || mentee.status === statusFilter;
      const matchesSkill = skillFilter === 'all' || mentee.skillArea.includes(skillFilter);
      
      return matchesSearch && matchesStatus && matchesSkill;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'confidence') return b.aiConfidence - a.aiConfidence;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">My Mentees</h1>
        <p className="text-[var(--foreground-muted)] mb-6">View, analyze, and manage your mentee profiles and progress.</p>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="lg:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Skill Area Filter */}
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Skill Area" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Algorithms">Algorithms</SelectItem>
              <SelectItem value="Cloud">Cloud</SelectItem>
              <SelectItem value="Native">Mobile</SelectItem>
              <SelectItem value="Data">Data</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="progress">Sort by Progress</SelectItem>
              <SelectItem value="confidence">Sort by AI Confidence</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Total Mentees</p>
              <p className="text-[var(--foreground)] text-xl">{menteesData.length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Active Mentees</p>
              <p className="text-[var(--foreground)] text-xl">{menteesData.filter(m => m.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Avg Progress</p>
              <p className="text-[var(--foreground)] text-xl">
                {Math.round(menteesData.reduce((sum, m) => sum + m.progress, 0) / menteesData.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-teal-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Avg AI Score</p>
              <p className="text-[var(--foreground)] text-xl">
                {Math.round(menteesData.reduce((sum, m) => sum + m.aiConfidence, 0) / menteesData.length)}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mentees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMentees.map((mentee, index) => (
          <motion.div
            key={mentee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MenteeCard
              mentee={mentee}
              onClick={() => setSelectedMentee(mentee)}
            />
          </motion.div>
        ))}
      </div>

      {filteredMentees.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-400">No mentees found matching your filters.</p>
        </motion.div>
      )}

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/30 p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-[var(--foreground)]">AI Insights for Mentors</h2>
              <p className="text-[var(--foreground-muted)] text-sm">Smart analytics based on your mentees' performance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="text-[var(--foreground)] mb-2">Weekly Improvement</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    3 mentees improved their communication skills by <span style={{ color: 'var(--success)' }}>12%</span> this week
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-[var(--foreground)] mb-2">Recommended Focus</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    Schedule more <span style={{ color: 'var(--accent-cyan)' }}>Technical problem-solving sessions</span> for optimal progress
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Add Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="fixed bottom-8 right-8 z-30"
      >
        <Button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-[0_0_40px_rgba(6,182,212,0.6)] text-white hover:shadow-[0_0_60px_rgba(6,182,212,0.8)] transition-all"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* Detail Panel */}
      <MenteeDetailPanel
        mentee={selectedMentee}
        onClose={() => setSelectedMentee(null)}
      />
    </div>
  );
};

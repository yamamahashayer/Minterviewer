"use client";

import { useState, useEffect } from 'react';
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

// Assuming there's a way to get the current user ID
// If using custom hook, import here. For now, we will simulate or get from sessionStorage
// import { useAuth } from '@/lib/hooks/useAuth'; 

export const MyMenteesContent = () => {
  const [menteesData, setMenteesData] = useState<any[]>([]); // Initialize empty
  const [loading, setLoading] = useState(true);

  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  // Fetch Mentees
  useEffect(() => {
    async function fetchMentees() {
      try {
        setLoading(true);
        // Getting userID from session storage for now as fallback
        const userData = sessionStorage.getItem("user");
        if (!userData) {
          console.warn("No user logged in");
          setLoading(false);
          return;
        }
        const user = JSON.parse(userData);

        const res = await fetch(`/api/mentor/mentees?userId=${user.id}`);
        const json = await res.json();

        if (json.ok) {
          setMenteesData(json.mentees || []);
        } else {
          console.error("Failed to fetch mentees:", json.error);
        }
      } catch (err) {
        console.error("Error loading mentees:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMentees();
  }, []);

  const filteredMentees = menteesData
    .filter((mentee) => {
      const matchesSearch = mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentee.skillArea && mentee.skillArea.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || mentee.status === statusFilter;
      // const matchesSkill = skillFilter === 'all' || (mentee.skillArea && mentee.skillArea.includes(skillFilter));
      // Simplified skill matching for now as dynamic data structure might vary
      const matchesSkill = skillFilter === 'all' || true;

      return matchesSearch && matchesStatus && matchesSkill;
    })
    .sort((a, b) => {
      // Add safe guards for missing properties
      if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
      if (sortBy === 'confidence') return (b.aiConfidence || 0) - (a.aiConfidence || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading mentees...</div>;
  }

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
              placeholder="Search by name..."
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

          {/* Skill Area Filter - Placeholder for now until we have real skills data */}
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Skill Area" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Skills</SelectItem>
              {/* Populate dynamically if available */}
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
                {menteesData.length > 0 ? Math.round(menteesData.reduce((sum, m) => sum + (m.progress || 0), 0) / menteesData.length) : 0}%
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
                {menteesData.length > 0 ? Math.round(menteesData.reduce((sum, m) => sum + (m.aiConfidence || 0), 0) / menteesData.length) : 0}%
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

      {/* AI Insights Section (Static for now, could be dynamic later) */}
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

          <div className="text-sm text-gray-400 italic">Insights require more session data to activate.</div>
        </div>
      </motion.div>

      {/* Detail Panel */}
      <MenteeDetailPanel
        mentee={selectedMentee}
        onClose={() => setSelectedMentee(null)}
      />
    </div>
  );
};


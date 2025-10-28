'use client';
import React, { useState, useMemo } from 'react';
import HeroSection from '../components/MentorsComponents/HeroSection';
import SearchFilters from '../components/MentorsComponents/SearchFilters';
import MentorsGrid from '../components/MentorsComponents/MentorsGrid';
import ContentSections from '../components/MentorsComponents/ContentSections';
import type { Mentor, FilterState } from '../../types/types';
import { useTheme } from "../../Context/ThemeContext";
import MainLayout from '../main-layout';

const PublicMentors: React.FC = () => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedSpecialty: 'all',
    selectedExperience: 'all',
    selectedRating: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mentors: Mentor[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      rating: 4.9,
      reviews: 127,
      experience: 8,
      location: "San Francisco, CA",
      hourlyRate: 85,
      specialties: ["Technical Interviews", "System Design", "Coding Challenges"],
      avatar: "SJ",
      isOnline: true,
      responseTime: "< 2 hours",
      totalSessions: 340,
      successRate: 94,
      badge: "Top Rated"
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Product Manager",
      company: "Microsoft",
      rating: 4.8,
      reviews: 94,
      experience: "6+ years",
      location: "Seattle, WA",
      hourlyRate: 75,
      specialties: ["Product Management", "Case Studies", "Behavioral Interviews"],
      avatar: "MC",
      isOnline: false,
      responseTime: "< 4 hours",
      totalSessions: 280,
      successRate: 89
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "UX Design Lead",
      company: "Adobe",
      rating: 4.9,
      reviews: 156,
      experience: "10+ years",
      location: "New York, NY",
      hourlyRate: 90,
      specialties: ["Design Interviews", "Portfolio Review", "Creative Challenges"],
      avatar: "ER",
      isOnline: true,
      responseTime: "< 1 hour",
      totalSessions: 425,
      successRate: 96,
      badge: "Expert"
    },
    {
      id: "4",
      name: "David Kim",
      title: "Data Science Manager",
      company: "Netflix",
      rating: 4.7,
      reviews: 82,
      experience: "7+ years",
      location: "Los Angeles, CA",
      hourlyRate: 80,
      specialties: ["Data Science", "Machine Learning", "Statistics"],
      avatar: "DK",
      isOnline: true,
      responseTime: "< 3 hours",
      totalSessions: 195,
      successRate: 91
    },
    {
      id: "5",
      name: "Lisa Thompson",
      title: "Marketing Director",
      company: "Spotify",
      rating: 4.8,
      reviews: 118,
      experience: "9+ years",
      location: "Austin, TX",
      hourlyRate: 70,
      specialties: ["Marketing Strategy", "Brand Management", "Digital Marketing"],
      avatar: "LT",
      isOnline: false,
      responseTime: "< 6 hours",
      totalSessions: 312,
      successRate: 87
    },
    {
      id: "6",
      name: "James Wilson",
      title: "Finance VP",
      company: "Goldman Sachs",
      rating: 4.9,
      reviews: 203,
      experience: "12+ years",
      location: "New York, NY",
      hourlyRate: 120,
      specialties: ["Finance Interviews", "Investment Banking", "Financial Modeling"],
      avatar: "JW",
      isOnline: true,
      responseTime: "< 2 hours",
      totalSessions: 567,
      successRate: 98,
      badge: "Top Rated"
    }
  ];

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesSpecialty = filters.selectedSpecialty === 'all' ||
        mentor.specialties.some(spec => spec.includes(filters.selectedSpecialty));

      const matchesExperience = filters.selectedExperience === 'all' ||
        mentor.experience.includes(filters.selectedExperience.split('+')[0]);

      const matchesRating = filters.selectedRating === 'all' ||
        mentor.rating >= parseFloat(filters.selectedRating);

      return matchesSearch && matchesSpecialty && matchesExperience && matchesRating;
    });
  }, [mentors, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <MainLayout>
      <div className={`w-full transition-colors duration-300 ${isDark
        ? 'bg-[#06171c] text-white'
        : 'bg-[#96fbf1] text-gray-900'
        }`}>
        <HeroSection />
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filteredCount={filteredMentors.length}
        />
        <MentorsGrid mentors={filteredMentors} />
        <ContentSections />
      </div>
    </MainLayout>
  );
};

export default PublicMentors;
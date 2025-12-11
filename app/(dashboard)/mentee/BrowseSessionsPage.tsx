"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Search, Calendar, DollarSign, Filter, Star, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface TimeSlot {
    _id: string;
    startTime: string;
    endTime: string;
    duration: number;
    notes?: string;
    mentor: {
        _id: string;
        name: string;
        photo: string;
        bio: string;
        focusAreas: string[];
        experience: number;
        rating: number;
        reviews: number;
    };
    session: {
        title: string;
        topic: string;
        type: string;
        price: number;
        description: string;
    };
}

export default function BrowseSessionsPage() {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [maxPrice, setMaxPrice] = useState(200);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (topic) params.append('topic', topic);
            if (date) params.append('date', date);
            if (maxPrice < 200) params.append('maxPrice', maxPrice.toString());

            const res = await fetch(`/api/mentees/browse-sessions?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setSlots(data.slots);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSessions();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Find a Mentor</h1>
                <p className="text-[var(--foreground-muted)]">Browse available sessions and book your next step</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 mb-8 backdrop-blur-xl border border-[var(--border)] bg-[var(--card)]"
            >
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Topic or Skill</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground-muted)]" />
                            <input
                                type="text"
                                placeholder="React, System Design..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground-muted)]" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-[var(--foreground-muted)] mb-2 block">
                            Max Price: ${maxPrice}
                        </label>
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="10"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>
                </form>
            </motion.div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-12 text-[var(--foreground-muted)]">Loading sessions...</div>
            ) : slots.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[var(--background-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[var(--foreground-muted)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">No sessions found</h3>
                    <p className="text-[var(--foreground-muted)]">Try adjusting your filters to see more results.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slots.map((slot) => (
                        <motion.div
                            key={slot._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:shadow-xl transition-all duration-300"
                        >
                            <div className="p-6">
                                {/* Mentor Info */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {slot.mentor.photo ? (
                                            <img src={slot.mentor.photo} alt={slot.mentor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                                                {slot.mentor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)]">{slot.mentor.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] mb-1">
                                            <span>{slot.mentor.experience}+ years exp</span>
                                            {slot.mentor.rating > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                    <span>{slot.mentor.rating} ({slot.mentor.reviews})</span>
                                                </>
                                            )}
                                        </div>
                                        {slot.mentor.focusAreas && (
                                            <div className="flex flex-wrap gap-1">
                                                {slot.mentor.focusAreas.slice(0, 3).map((area: string) => (
                                                    <span key={area} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--background-muted)] text-[var(--foreground-muted)] border border-[var(--border)]">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Session Info */}
                                <div className="mb-4">
                                    <h4 className="font-bold text-lg text-[var(--foreground)] mb-1">
                                        {slot.session?.title || "Mentorship Session"}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium">
                                            {slot.session?.topic || "General"}
                                        </span>
                                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
                                            {slot.session?.type || "1:1 Session"}
                                        </span>
                                    </div>
                                    {slot.notes && (
                                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 italic">
                                            "{slot.notes}"
                                        </p>
                                    )}
                                </div>

                                {/* Time & Price */}
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                    <div className="text-sm">
                                        <div className="flex items-center gap-1 text-[var(--foreground)] font-medium">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            {formatDate(slot.startTime)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[var(--foreground-muted)] mt-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-[var(--accent-cyan)]">
                                            ${(slot.session?.price / 100).toFixed(2) || "0.00"}
                                        </div>
                                        <Button size="sm" className="mt-1 bg-[var(--foreground)] text-[var(--background)] hover:opacity-90">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

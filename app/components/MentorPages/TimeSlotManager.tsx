"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface TimeSlot {
    _id: string;
    startTime: string;
    endTime: string;
    duration: number;
    sessionOffering: string;
    notes?: string;
    status: 'available' | 'booked' | 'blocked';
    session?: {
        status: string;
        topic: string;
        sessionType: string;
    };
}

interface SessionOffering {
    _id: string;
    title: string;
    topic: string;
    sessionType: string;
    duration: number;
    price: number;
    active: boolean;
}

export const TimeSlotManager = () => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [offerings, setOfferings] = useState<SessionOffering[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Form state
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedOffering, setSelectedOffering] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchTimeSlots();
        fetchOfferings();
    }, []);

    const fetchOfferings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('/api/mentors/session-offerings', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                setOfferings(data.sessionOfferings.filter((o: SessionOffering) => o.active));
            }
        } catch (error) {
            console.error('Error fetching offerings:', error);
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('/api/mentors/time-slots', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                setTimeSlots(data.timeSlots);
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
            toast.error('Failed to load time slots');
        } finally {
            setLoading(false);
        }
    };

    const createTimeSlot = async () => {
        if (!selectedDate || !startTime || !endTime || !selectedOffering) {
            toast.error('Please fill all required fields');
            return;
        }

        setCreating(true);
        try {
            // Parse date and time values - construct as local time, not UTC
            const [year, month, day] = selectedDate.split('-').map(Number);
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            // Create dates in local timezone
            const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
            const endDateTime = new Date(year, month - 1, day, endHour, endMinute);

            // If end time is earlier than start time, assume it's next day
            if (endDateTime <= startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            const duration = (endDateTime.getTime() - startDateTime.getTime()) / 60000;

            const requestBody = {
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                duration,
                sessionOffering: selectedOffering,
                notes: notes.trim()
            };

            console.log('[TimeSlot] Creating with:', requestBody);

            const token = sessionStorage.getItem('token');
            const res = await fetch('/api/mentors/time-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(requestBody)
            });

            if (res.ok) {
                toast.success('Time slot created successfully! 🎉');
                setSelectedDate('');
                setStartTime('');
                setEndTime('');
                setSelectedOffering('');
                setNotes('');
                fetchTimeSlots();
            } else {
                const data = await res.json();
                console.error('[TimeSlot] Error response:', data);
                toast.error(data.error || 'Failed to create time slot');
            }
        } catch (error) {
            console.error('Error creating time slot:', error);
            toast.error('Failed to create time slot');
        } finally {
            setCreating(false);
        }
    };

    const deleteTimeSlot = async (id: string) => {
        if (!confirm('Are you sure you want to delete this time slot?')) return;

        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`/api/mentors/time-slots/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
                toast.success('Time slot deleted');
                fetchTimeSlots();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete time slot');
            }
        } catch (error) {
            console.error('Error deleting time slot:', error);
            toast.error('Failed to delete time slot');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get min date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-[var(--foreground)] mb-2">Time Slot Management</h1>
                <p className="text-[var(--foreground-muted)]">Create individual time slots for mentees to book</p>
            </motion.div>

            {/* Create New Slot Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl backdrop-blur-xl p-6 mb-8"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
                <h3 className="text-[var(--foreground)] mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
                    Create New Time Slot
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-[var(--foreground)] text-sm mb-2 block">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDate}
                            className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                        />
                    </div>

                    <div>
                        <label className="text-[var(--foreground)] text-sm mb-2 block">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                        />
                    </div>

                    <div>
                        <label className="text-[var(--foreground)] text-sm mb-2 block">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[var(--foreground)] text-sm mb-2 block">
                            Session Offering <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={selectedOffering}
                            onChange={(e) => setSelectedOffering(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                            required
                        >
                            <option value="">Select an offering</option>
                            {offerings.map((offering) => (
                                <option key={offering._id} value={offering._id}>
                                    {offering.title} - ${(offering.price / 100).toFixed(2)} ({offering.duration}min)
                                </option>
                            ))}
                        </select>
                        {offerings.length === 0 && (
                            <p className="text-xs text-yellow-400 mt-1">
                                ⚠️ Create session offerings first in the "Session Offerings" tab
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-[var(--foreground)] text-sm mb-2 block">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="E.g., Focus on system design patterns..."
                            className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)] resize-none"
                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                        />
                    </div>
                </div>

                <Button
                    onClick={createTimeSlot}
                    disabled={creating || !selectedDate || !startTime || !endTime || !selectedOffering}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {creating ? 'Creating...' : 'Create Time Slot'}
                </Button>
            </motion.div>

            {/* Time Slots List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-[var(--foreground)] mb-4">Your Time Slots</h3>

                {loading ? (
                    <div className="text-center py-8 text-[var(--foreground-muted)]">Loading...</div>
                ) : timeSlots.length === 0 ? (
                    <div className="text-center py-12 rounded-xl" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-[var(--foreground-muted)]" />
                        <p className="text-[var(--foreground-muted)]">No time slots created yet</p>
                        <p className="text-[var(--foreground-subtle)] text-sm">Create your first time slot above</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {timeSlots.map((slot) => (
                            <div
                                key={slot._id}
                                className={`rounded-xl p-5 border transition-all ${slot.status === 'available'
                                    ? 'bg-purple-500/5 border-purple-500/30'
                                    : slot.status === 'booked'
                                        ? 'bg-green-500/5 border-green-500/30'
                                        : 'bg-gray-500/5 border-gray-500/30'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className={`w-5 h-5 ${slot.status === 'available' ? 'text-purple-400' :
                                            slot.status === 'booked' ? 'text-green-400' : 'text-gray-400'
                                            }`} />
                                        <span className={`text-xs px-2 py-1 rounded-full ${slot.status === 'available' ? 'bg-purple-500/20 text-purple-300' :
                                            slot.status === 'booked' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {slot.status}
                                        </span>
                                    </div>
                                    {slot.status === 'available' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => deleteTimeSlot(slot._id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="text-[var(--foreground)] mb-2">
                                    {formatDate(slot.startTime)}
                                </div>
                                <div className="text-[var(--foreground)] text-lg font-semibold">
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                                <div className="text-[var(--foreground-muted)] text-sm">
                                    {slot.duration} minutes
                                </div>

                                {slot.session && (
                                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                                        <div className="text-sm text-[var(--foreground-muted)]">
                                            Booked: {slot.session.topic} - {slot.session.sessionType}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

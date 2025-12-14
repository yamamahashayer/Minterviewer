"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, DollarSign, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface SessionOffering {
    _id: string;
    title: string;
    topic: string;
    sessionType: string;
    duration: number;
    price: number;
    description: string;
    active: boolean;
}

export const SessionOfferingsManager = () => {
    const [offerings, setOfferings] = useState<SessionOffering[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        sessionType: '',
        duration: 60,
        price: 0,
        description: ''
    });

    useEffect(() => {
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
                setOfferings(data.sessionOfferings);
            }
        } catch (error) {
            console.error('Error fetching offerings:', error);
            toast.error('Failed to load session offerings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.topic || !formData.sessionType || !formData.duration || !formData.price) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const url = editingId
                ? `/api/mentors/session-offerings/${editingId}`
                : '/api/mentors/session-offerings';

            const token = sessionStorage.getItem('token');
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    ...formData,
                    price: Math.round(formData.price * 100) // Convert to cents
                })
            });

            if (res.ok) {
                toast.success(editingId ? 'Offering updated!' : 'Offering created!');
                resetForm();
                fetchOfferings();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save offering');
            }
        } catch (error) {
            console.error('Error saving offering:', error);
            toast.error('Failed to save offering');
        }
    };

    const handleEdit = (offering: SessionOffering) => {
        setFormData({
            title: offering.title,
            topic: offering.topic,
            sessionType: offering.sessionType,
            duration: offering.duration,
            price: offering.price / 100, // Convert from cents
            description: offering.description
        });
        setEditingId(offering._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to deactivate this offering?')) return;

        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`/api/mentors/session-offerings/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
                toast.success('Offering deactivated');
                fetchOfferings();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete offering');
            }
        } catch (error) {
            console.error('Error deleting offering:', error);
            toast.error('Failed to delete offering');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            topic: '',
            sessionType: '',
            duration: 60,
            price: 0,
            description: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const activeOfferings = offerings.filter(o => o.active);

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-[var(--foreground)] mb-2">Session Offerings</h1>
                    <p className="text-[var(--foreground-muted)]">Define the types of sessions you offer with pricing</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {showForm ? 'Cancel' : 'Add Offering'}
                </Button>
            </motion.div>

            {/* Create/Edit Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl backdrop-blur-xl p-6 mb-8"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                    <h3 className="text-[var(--foreground)] mb-6">
                        {editingId ? 'Edit Offering' : 'Create New Offering'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[var(--foreground)] text-sm mb-2 block">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., React Interview Preparation"
                                    className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[var(--foreground)] text-sm mb-2 block">
                                    Topic <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    placeholder="e.g., React, System Design"
                                    className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[var(--foreground)] text-sm mb-2 block">
                                    Session Type <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.sessionType}
                                    onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="Mock Interview">Mock Interview</option>
                                    <option value="CV Review">CV Review</option>
                                    <option value="Career Coaching">Career Coaching</option>
                                    <option value="Technical Guidance">Technical Guidance</option>
                                    <option value="Behavioral Interview">Behavioral Interview</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[var(--foreground)] text-sm mb-2 block">
                                    Duration (minutes) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    min="15"
                                    step="15"
                                    className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[var(--foreground)] text-sm mb-2 block">
                                    Price (USD) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    min="0"
                                    step="0.01"
                                    placeholder="50.00"
                                    className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)]"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[var(--foreground)] text-sm mb-2 block">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Describe what this session includes..."
                                className="w-full px-4 py-2 rounded-lg border text-[var(--foreground)] resize-none"
                                style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                                {editingId ? 'Update Offering' : 'Create Offering'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Offerings List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-[var(--foreground)] mb-4">Your Offerings ({activeOfferings.length})</h3>

                {loading ? (
                    <div className="text-center py-8 text-[var(--foreground-muted)]">Loading...</div>
                ) : activeOfferings.length === 0 ? (
                    <div className="text-center py-12 rounded-xl" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-[var(--foreground-muted)]" />
                        <p className="text-[var(--foreground-muted)]">No session offerings yet</p>
                        <p className="text-[var(--foreground-subtle)] text-sm">Create your first offering above</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeOfferings.map((offering) => (
                            <div
                                key={offering._id}
                                className="rounded-xl p-6 bg-purple-500/5 border border-purple-500/30 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="text-[var(--foreground)] font-semibold text-lg mb-1">
                                            {offering.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                                            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                                {offering.topic}
                                            </span>
                                            <span>•</span>
                                            <span>{offering.sessionType}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-3 text-sm">
                                    <div className="flex items-center gap-1 text-[var(--foreground-muted)]">
                                        <Clock className="w-4 h-4" />
                                        {offering.duration} min
                                    </div>
                                    <div className="flex items-center gap-1 text-purple-400 font-semibold">
                                        <DollarSign className="w-4 h-4" />
                                        {(offering.price / 100).toFixed(2)}
                                    </div>
                                </div>

                                {offering.description && (
                                    <p className="text-[var(--foreground-muted)] text-sm mb-4">
                                        {offering.description}
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(offering)}
                                        className="flex-1"
                                    >
                                        <Edit2 className="w-3 h-3 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(offering._id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-3 h-3 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

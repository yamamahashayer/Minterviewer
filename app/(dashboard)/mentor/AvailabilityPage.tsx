"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Clock, Calendar, Plus, X, Save, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultAvailability = {
  Monday: [{ start: '09:00', end: '17:00', enabled: true }],
  Tuesday: [{ start: '09:00', end: '17:00', enabled: true }],
  Wednesday: [{ start: '09:00', end: '17:00', enabled: true }],
  Thursday: [{ start: '09:00', end: '17:00', enabled: true }],
  Friday: [{ start: '09:00', end: '17:00', enabled: true }],
  Saturday: [{ start: '10:00', end: '14:00', enabled: false }],
  Sunday: [{ start: '10:00', end: '14:00', enabled: false }]
};

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

// Sample booked sessions
const bookedSessionsData = [
  { day: 0, start: 9, end: 10, mentee: 'Sarah Mitchell', type: 'Technical Interview' },
  { day: 0, start: 14, end: 15, mentee: 'James Rodriguez', type: 'System Design' },
  { day: 1, start: 11, end: 12, mentee: 'Emily Chen', type: 'AI Mock' },
  { day: 3, start: 13, end: 14, mentee: 'Lisa Wang', type: 'CV Review' },
  { day: 4, start: 10, end: 11, mentee: 'David Kumar', type: 'Behavioral' },
];

export const AvailabilityPage = () => {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [autoAccept, setAutoAccept] = useState(true);
  const [bufferTime, setBufferTime] = useState('15');
  
  // Current week view
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDaysForCalendar = getWeekDays(currentWeekStart);

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const prevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map(slot => ({ ...slot, enabled: !slot.enabled }))
    }));
  };

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00', enabled: true }]
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const handleSaveSchedule = () => {
    toast.success('Availability schedule saved successfully! 🎉');
  };

  // Calculate stats
  const totalHours = Object.values(availability).reduce((acc, day) => {
    return acc + day.filter(s => s.enabled).reduce((sum, slot) => {
      const start = parseInt(slot.start.split(':')[0]);
      const end = parseInt(slot.end.split(':')[0]);
      return sum + (end - start);
    }, 0);
  }, 0);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Availability Management</h1>
        <p className="text-[var(--foreground-muted)]">Set your weekly schedule and manage booking preferences</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Hours/Week</p>
              <p className="text-[var(--foreground)] text-xl">{totalHours}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Booked</p>
              <p className="text-[var(--foreground)] text-xl">{bookedSessionsData.length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-xl border border-indigo-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Available Slots</p>
              <p className="text-[var(--foreground)] text-xl">{totalHours - bookedSessionsData.length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Buffer Time</p>
              <p className="text-[var(--foreground)] text-xl">{bufferTime}m</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
            <Clock className="w-4 h-4 mr-2" />
            Calendar Overview
          </TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6 sticky top-8"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
                  Booking Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[var(--foreground)] text-sm">Auto-accept bookings</h4>
                      <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
                    </div>
                    <p className="text-[var(--foreground-muted)] text-xs">
                      Automatically confirm session requests without manual approval
                    </p>
                  </div>

                  <div className="p-4 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                    <h4 className="text-[var(--foreground)] text-sm mb-3">Buffer between sessions</h4>
                    <Select value={bufferTime} onValueChange={setBufferTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No buffer</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[var(--foreground-muted)] text-xs mt-2">
                      Rest time between back-to-back sessions
                    </p>
                  </div>

                  <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Quick Stats</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">Active days</span>
                        <span className="text-[var(--foreground)]">
                          {Object.values(availability).filter(d => d[0].enabled).length}/7
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">Total hours</span>
                        <span className="text-[var(--foreground)]">{totalHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">Booked</span>
                        <span className="text-green-400">{bookedSessionsData.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Schedule Configuration */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-[var(--foreground)] mb-6">Set Your Weekly Availability</h3>

                <div className="space-y-3">
                  {weekDays.map((day, dayIndex) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dayIndex * 0.05 }}
                      className={`rounded-lg border p-4 transition-all ${
                        availability[day][0].enabled
                          ? 'bg-purple-500/5 border-purple-500/30'
                          : 'border-gray-700'
                      }`}
                      style={!availability[day][0].enabled ? { background: 'var(--background-muted)' } : {}}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Switch
                          checked={availability[day][0].enabled}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <div className="flex-1">
                          <h4 className="text-[var(--foreground)]">{day}</h4>
                          <p className="text-[var(--foreground-muted)] text-xs">
                            {availability[day][0].enabled 
                              ? `${availability[day].length} time slot${availability[day].length > 1 ? 's' : ''} configured`
                              : 'Day off'}
                          </p>
                        </div>
                        {availability[day][0].enabled && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            Active
                          </Badge>
                        )}
                      </div>

                      {availability[day][0].enabled && (
                        <div className="space-y-2 pl-11">
                          {availability[day].map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-2">
                              <Select defaultValue={slot.start}>
                                <SelectTrigger className="flex-1 h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <span className="text-[var(--foreground-muted)] text-xs">to</span>

                              <Select defaultValue={slot.end}>
                                <SelectTrigger className="flex-1 h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {availability[day].length > 1 && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeTimeSlot(day, slotIndex)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 w-9"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(day)}
                            className="w-full border-purple-500/30 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 h-8 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            Add Time Slot
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <Button variant="outline">
                    Reset to Default
                  </Button>
                  <Button 
                    onClick={handleSaveSchedule}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Schedule
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Calendar Overview Tab */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[var(--foreground)]">Week Overview</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={prevWeek}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-[var(--foreground)] text-sm px-4 min-w-[200px] text-center">
                  {weekDaysForCalendar[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDaysForCalendar[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={nextWeek}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mb-6 p-5 rounded-lg" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500/50 to-pink-500/50 border-2 border-purple-500 rounded shadow-[0_0_12px_rgba(168,85,247,0.3)]"></div>
                <span className="text-[var(--foreground)]">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500/60 to-emerald-500/60 border-2 border-green-500 rounded shadow-[0_0_12px_rgba(34,197,94,0.3)]"></div>
                <span className="text-[var(--foreground)]">Booked</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 rounded" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}></div>
                <span className="text-[var(--foreground)]">Unavailable</span>
              </div>
            </div>

            {/* Daily Bars */}
            <div className="space-y-4">
              {weekDaysForCalendar.map((date, dayIdx) => {
                const dayName = weekDays[dayIdx];
                const dayAvailability = availability[dayName];
                const isEnabled = dayAvailability && dayAvailability[0].enabled;
                
                const bookedSessions = bookedSessionsData.filter(s => s.day === dayIdx);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div 
                    key={dayIdx} 
                    className={`rounded-xl border p-5 transition-all ${
                      isToday 
                        ? 'bg-purple-500/5 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : ''
                    }`}
                    style={!isToday ? { background: 'var(--background-muted)', borderColor: 'var(--border)' } : {}}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          isToday 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                            : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                        }`}>
                          <div className="text-center">
                            <div className={`${isToday ? 'text-white' : 'text-purple-300'}`}>
                              {weekDays[dayIdx].slice(0, 3)}
                            </div>
                            <div className={`text-sm ${isToday ? 'text-white' : 'text-[var(--foreground-muted)]'}`}>
                              {date.getDate()}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[var(--foreground)] mb-1 flex items-center gap-2">
                            {weekDays[dayIdx]}
                            {isToday && (
                              <Badge className="bg-purple-500 text-white">Today</Badge>
                            )}
                          </h4>
                          <p className="text-[var(--foreground-muted)] text-sm">
                            {isEnabled 
                              ? `${dayAvailability[0].start} - ${dayAvailability[0].end}` 
                              : 'Day off'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isEnabled && (
                          <>
                            <p className="text-[var(--foreground-muted)] text-xs mb-1">Sessions</p>
                            <p className="text-[var(--foreground)]">{bookedSessions.length} booked</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    {isEnabled ? (
                      <div className="relative">
                        {/* Time Labels */}
                        <div className="flex justify-between text-xs mb-2 px-1" style={{ color: 'var(--foreground-subtle)' }}>
                          <span>8 AM</span>
                          <span>12 PM</span>
                          <span>4 PM</span>
                          <span>8 PM</span>
                        </div>

                        {/* Timeline Track */}
                        <div className="relative h-14 rounded-lg border overflow-hidden" style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}>
                          {/* Available Time Blocks */}
                          {dayAvailability.map((slot, idx) => {
                            if (!slot.enabled) return null;
                            const startHour = parseInt(slot.start.split(':')[0]);
                            const endHour = parseInt(slot.end.split(':')[0]);
                            const leftPercent = ((startHour - 8) / 12) * 100;
                            const widthPercent = ((endHour - startHour) / 12) * 100;

                            return (
                              <div
                                key={idx}
                                className="absolute h-full bg-gradient-to-r from-purple-500/50 to-pink-500/50 border-l-2 border-r-2 border-purple-500 shadow-[0_4px_12px_rgba(168,85,247,0.2)]"
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`
                                }}
                              />
                            );
                          })}

                          {/* Booked Sessions */}
                          {bookedSessions.map((session, idx) => {
                            const leftPercent = ((session.start - 8) / 12) * 100;
                            const widthPercent = ((session.end - session.start) / 12) * 100;

                            return (
                              <div
                                key={idx}
                                className="absolute h-full bg-gradient-to-r from-green-500/60 to-emerald-500/60 border-l-2 border-r-2 border-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.2)] flex flex-col items-center justify-center px-2"
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`
                                }}
                              >
                                <span className="text-white text-xs font-medium">{session.mentee}</span>
                                <span className="text-green-200 text-xs">{session.type}</span>
                              </div>
                            );
                          })}

                          {/* Time Grid Lines */}
                          {[25, 50, 75].map((percent) => (
                            <div
                              key={percent}
                              className="absolute top-0 bottom-0 w-px"
                              style={{ background: 'var(--border)', opacity: 0.5, left: `${percent}%` }}
                            />
                          ))}
                        </div>

                        {/* Session Details */}
                        {bookedSessions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {bookedSessions.map((session, idx) => (
                              <Badge key={idx} className="bg-green-500/30 text-green-400 border-green-500 shadow-[0_2px_8px_rgba(34,197,94,0.25)]" style={{ fontWeight: 500 }}>
                                {session.start}:00 - {session.end}:00 • {session.mentee}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-14 rounded-lg border flex items-center justify-center" style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}>
                        <span className="text-[var(--foreground-subtle)] text-sm">No availability set for this day</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

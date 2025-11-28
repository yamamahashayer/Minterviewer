"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Filter, Plus, Users, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

const pendingRequests = [
  {
    id: 101,
    mentee: 'Jessica Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    type: 'Technical Interview',
    requestedDate: 'Oct 16, 2025',
    requestedTime: '3:00 PM - 4:00 PM',
    message: 'Hi! I have an interview coming up with Google and would love your help preparing for technical questions.',
    price: 120,
    submittedTime: '2 hours ago',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 102,
    mentee: 'David Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    type: 'System Design',
    requestedDate: 'Oct 17, 2025',
    requestedTime: '10:00 AM - 11:30 AM',
    message: 'Looking forward to learning system design patterns from you. Specifically interested in microservices architecture.',
    price: 150,
    submittedTime: '5 hours ago',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 103,
    mentee: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    type: 'CV Review',
    requestedDate: 'Oct 15, 2025',
    requestedTime: '2:00 PM - 2:30 PM',
    message: 'Need feedback on my CV before applying to senior positions at FAANG companies.',
    price: 80,
    submittedTime: '1 day ago',
    color: 'from-green-500 to-teal-500'
  }
];

const upcomingSessions = [
  {
    id: 1,
    mentee: 'Sarah Mitchell',
    type: 'Technical Interview',
    date: 'Oct 14, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'confirmed',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 2,
    mentee: 'James Rodriguez',
    type: 'Behavioral Mock',
    date: 'Oct 14, 2025',
    time: '2:30 PM - 3:30 PM',
    status: 'confirmed',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 3,
    mentee: 'Emily Chen',
    type: 'AI Mock Interview',
    date: 'Oct 15, 2025',
    time: '11:00 AM - 12:00 PM',
    status: 'pending',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 4,
    mentee: 'Lisa Wang',
    type: 'Mobile Architecture',
    date: 'Oct 16, 2025',
    time: '1:00 PM - 2:00 PM',
    status: 'confirmed',
    color: 'from-orange-500 to-red-500'
  }
];

const pastSessions = [
  {
    id: 5,
    mentee: 'Michael Brown',
    type: 'Cloud Architecture',
    date: 'Oct 8, 2025',
    time: '11:00 AM - 12:00 PM',
    status: 'completed',
    feedback: true
  },
  {
    id: 6,
    mentee: 'Sarah Mitchell',
    type: 'React Components',
    date: 'Oct 10, 2025',
    time: '2:00 PM - 3:00 PM',
    status: 'completed',
    feedback: true
  },
  {
    id: 7,
    mentee: 'James Rodriguez',
    type: 'System Design',
    date: 'Oct 12, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'completed',
    feedback: false
  }
];

export const SessionsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState('all');
  const [requests, setRequests] = useState(pendingRequests);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Current week view for calendar grid
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  // Generate time slots for calendar view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const calendarTimeSlots = generateTimeSlots();

  // Sample sessions for calendar view
  const calendarSessions = [
    { day: 0, time: '10:00', mentee: 'Sarah Mitchell', type: 'Technical', duration: 1, color: 'cyan' },
    { day: 0, time: '14:00', mentee: 'James Rodriguez', type: 'Behavioral', duration: 1, color: 'teal' },
    { day: 1, time: '11:00', mentee: 'Emily Chen', type: 'AI Mock', duration: 1, color: 'purple' },
    { day: 3, time: '13:00', mentee: 'Lisa Wang', type: 'Mobile Arch', duration: 1, color: 'orange' },
  ];

  const getSessionAtSlot = (dayIndex: number, time: string) => {
    return calendarSessions.find(s => s.day === dayIndex && s.time === time);
  };

  const handleAcceptRequest = (id: number, menteeName: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    toast.success(`Session request from ${menteeName} accepted! 🎉`);
  };

  const handleDeclineRequest = (id: number, menteeName: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    toast.error(`Session request from ${menteeName} declined.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[var(--foreground)] mb-2">Sessions</h1>
        <p className="text-[var(--foreground-muted)] mb-6">Manage your mentoring sessions and schedule</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{
            background: 'var(--accent-purple-subtle)',
            borderColor: 'var(--accent-purple)'
          }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'var(--accent-purple-muted)'
              }}>
                <Calendar className="w-6 h-6" style={{ color: 'var(--accent-purple)' }} />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Upcoming</p>
                <p className="text-[var(--foreground)] text-xl">{upcomingSessions.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{
            background: 'linear-gradient(to br, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))',
            borderColor: 'rgba(34, 197, 94, 0.3)'
          }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'rgba(34, 197, 94, 0.2)'
              }}>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Completed</p>
                <p className="text-[var(--foreground)] text-xl">{pastSessions.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{
            background: 'var(--accent-pink-subtle)',
            borderColor: 'var(--accent-pink)'
          }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'var(--accent-pink-muted)'
              }}>
                <AlertCircle className="w-6 h-6" style={{ color: 'var(--accent-pink)' }} />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Pending Requests</p>
                <p className="text-[var(--foreground)] text-xl">{requests.length}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-5" style={{
            background: 'linear-gradient(to br, var(--accent-purple-subtle), var(--accent-pink-subtle))',
            borderColor: 'var(--accent-purple)'
          }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'var(--accent-purple-muted)'
              }}>
                <Users className="w-6 h-6" style={{ color: 'var(--accent-purple)' }} />
              </div>
              <div>
                <p className="text-[var(--foreground-muted)] text-sm">Total Hours</p>
                <p className="text-[var(--foreground)] text-xl">156</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Sessions List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="requests" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="requests" className="data-[state=active]:text-[var(--accent-purple)]" style={{
                  ['--tab-active-bg' as any]: 'var(--accent-purple-subtle)'
                }}>
                  Pending Requests
                  {requests.length > 0 && (
                    <Badge className="ml-2 text-white" style={{ background: 'var(--accent-pink)' }}>{requests.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:text-[var(--accent-purple)]" style={{
                  ['--tab-active-bg' as any]: 'var(--accent-purple-subtle)'
                }}>
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:text-[var(--accent-purple)]" style={{
                  ['--tab-active-bg' as any]: 'var(--accent-purple-subtle)'
                }}>
                  Past Sessions
                </TabsTrigger>
              </TabsList>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="mock">AI Mock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pending Requests Tab */}
            <TabsContent value="requests" className="space-y-4">
              {requests.length === 0 ? (
                <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-12 text-center" style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)'
                }}>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground-muted)' }} />
                  <h3 className="text-[var(--foreground)] mb-2">No Pending Requests</h3>
                  <p className="text-[var(--foreground-muted)]">You're all caught up! New session requests will appear here.</p>
                </div>
              ) : (
                requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6 transition-all group"
                    style={{ 
                      background: 'var(--card)',
                      borderColor: 'var(--accent-pink)',
                      boxShadow: '0 0 20px var(--glow-pink)'
                    }}
                  >
                    {/* New badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="text-white" style={{
                        background: 'linear-gradient(to right, var(--accent-purple), var(--accent-pink))'
                      }}>
                        New Request
                      </Badge>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${request.color} flex items-center justify-center shadow-lg overflow-hidden`}>
                        <img src={request.avatar} alt={request.mentee} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-[var(--foreground)] mb-1">{request.mentee}</h4>
                            <Badge className="border" style={{ 
                              background: 'var(--background-muted)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground-muted)' 
                            }}>
                              {request.type}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p style={{ color: 'var(--accent-purple)' }}>${request.price}</p>
                            <p className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>per session</p>
                          </div>
                        </div>

                        {/* Request Details */}
                        <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {request.requestedDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {request.requestedTime}
                          </div>
                        </div>

                        {/* Message */}
                        <div className="rounded-lg p-3 mb-4" style={{
                          background: 'var(--background-muted)',
                          border: '1px solid var(--border-muted)'
                        }}>
                          <p className="text-[var(--foreground)] text-sm">{request.message}</p>
                        </div>

                        {/* Submitted Time */}
                        <p className="text-xs mb-4" style={{ color: 'var(--foreground-subtle)' }}>Submitted {request.submittedTime}</p>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleAcceptRequest(request.id, request.mentee)}
                            className="flex-1 text-white"
                            style={{
                              background: 'linear-gradient(to right, #22c55e, #14b8a6)',
                              boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Request
                          </Button>
                          <Button 
                            onClick={() => handleDeclineRequest(request.id, request.mentee)}
                            variant="outline" 
                            className="text-red-500 hover:bg-red-500/10"
                            style={{
                              borderColor: 'rgba(239, 68, 68, 0.5)',
                              background: 'rgba(239, 68, 68, 0.05)'
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                    style={viewMode === 'list' ? {
                      background: 'var(--accent-purple-subtle)',
                      color: 'var(--accent-purple)',
                      borderColor: 'var(--accent-purple)'
                    } : {
                      borderColor: 'var(--border)'
                    }}
                  >
                    List View
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'calendar' ? 'default' : 'outline'}
                    onClick={() => setViewMode('calendar')}
                    style={viewMode === 'calendar' ? {
                      background: 'var(--accent-purple-subtle)',
                      color: 'var(--accent-purple)',
                      borderColor: 'var(--accent-purple)'
                    } : {
                      borderColor: 'var(--border)'
                    }}
                  >
                    Calendar View
                  </Button>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6 transition-all group"
                  style={{ 
                    background: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-purple)';
                    e.currentTarget.style.boxShadow = '0 0 30px var(--glow-purple)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${session.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-white">{session.mentee.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-[var(--foreground)]">{session.mentee}</h4>
                          <Badge className="border" style={{
                            background: 'var(--background-muted)',
                            color: 'var(--foreground-muted)',
                            borderColor: 'var(--border)'
                          }}>
                            {session.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm ml-15" style={{ color: 'var(--foreground-muted)' }}>
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

                    <Badge className={`${
                      session.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {session.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" style={{
                      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                      border: 'none'
                    }}>
                      <Video className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                    <Button variant="outline" style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground-muted)'
                    }}>
                      Reschedule
                    </Button>
                  </div>
                </motion.div>
              ))}
                </div>
              )}

              {/* Calendar View */}
              {viewMode === 'calendar' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
                  style={{ 
                    background: 'var(--card)',
                    borderColor: 'var(--accent-purple)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[var(--foreground)]">Weekly Schedule</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={prevWeek}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--foreground-muted)'
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm px-3" style={{ color: 'var(--foreground-muted)' }}>
                        {weekDaysForCalendar[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDaysForCalendar[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={nextWeek}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--foreground-muted)'
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                      {/* Header Row */}
                      <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-sm p-2" style={{ color: 'var(--foreground-muted)' }}>Time</div>
                        {weekDaysForCalendar.map((date, idx) => (
                          <div key={idx} className="text-center p-2">
                            <div className="text-sm" style={{ color: 'var(--foreground)' }}>{weekDays[idx].slice(0, 3)}</div>
                            <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{date.getDate()}</div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-1">
                        {calendarTimeSlots.map((time) => (
                          <div key={time} className="grid grid-cols-8 gap-2">
                            <div className="text-xs p-2 flex items-center" style={{ color: 'var(--foreground-muted)' }}>
                              {time}
                            </div>
                            {weekDaysForCalendar.map((date, dayIdx) => {
                              const session = getSessionAtSlot(dayIdx, time);
                              
                              return (
                                <div
                                  key={dayIdx}
                                  className={`min-h-16 rounded border transition-all ${
                                    session ? 'p-2' : ''
                                  }`}
                                  style={session ? {
                                    background: `linear-gradient(to bottom right, ${session.color.includes('purple') ? 'var(--accent-purple-subtle)' : 'rgba(124, 58, 237, 0.1)'}, ${session.color.includes('purple') ? 'var(--accent-purple-muted)' : 'rgba(124, 58, 237, 0.2)'})`,
                                    borderColor: 'var(--accent-purple)'
                                  } : {
                                    background: 'var(--background-muted)',
                                    borderColor: 'var(--border-muted)'
                                  }}
                                >
                                  {session && (
                                    <div>
                                      <div className="text-xs mb-1" style={{ color: 'var(--accent-purple)' }}>
                                        {session.mentee}
                                      </div>
                                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                                        {session.type}
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" style={{ color: 'var(--accent-purple)' }} />
                                        <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{session.duration}h</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                          background: 'linear-gradient(to right, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))'
                        }}>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="text-[var(--foreground)]">{session.mentee}</h4>
                          <Badge className="border" style={{
                            background: 'var(--background-muted)',
                            color: 'var(--foreground-muted)',
                            borderColor: 'var(--border)'
                          }}>
                            {session.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm ml-15" style={{ color: 'var(--foreground-muted)' }}>
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

                    {session.feedback ? (
                      <Badge className="border" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        borderColor: 'rgba(34, 197, 94, 0.3)'
                      }}>
                        Feedback Added
                      </Badge>
                    ) : (
                      <Badge className="border" style={{
                        background: 'var(--accent-pink-subtle)',
                        color: 'var(--accent-pink)',
                        borderColor: 'var(--accent-pink)'
                      }}>
                        Feedback Pending
                      </Badge>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    style={{
                      borderColor: 'var(--accent-purple)',
                      background: 'var(--accent-purple-subtle)',
                      color: 'var(--accent-purple)'
                    }}
                  >
                    {session.feedback ? 'View Feedback' : 'Add Feedback'}
                  </Button>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Calendar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-xl backdrop-blur-xl border p-6"
            style={{ 
              background: 'var(--card)',
              borderColor: 'var(--accent-purple)'
            }}
          >
            <h3 className="text-[var(--foreground)] mb-4">Calendar</h3>
            <div className="[&_.rdp]:text-[var(--foreground)] [&_.rdp-caption]:text-[var(--foreground)] [&_.rdp-day]:text-[var(--foreground-muted)] [&_.rdp-day_button]:text-[var(--foreground-muted)] [&_.rdp-day_button:hover]:text-[var(--foreground)] [&_.rdp-day_selected]:text-white" style={{
              ['--rdp-hover-bg' as any]: 'var(--accent-purple-subtle)',
              ['--rdp-selected-bg' as any]: 'var(--accent-purple)'
            }}>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button className="w-full text-white h-12" style={{
              background: 'linear-gradient(to right, var(--accent-purple), var(--accent-pink))',
              boxShadow: '0 0 20px var(--glow-purple)'
            }}>
              <Plus className="w-5 h-5 mr-2" />
              Schedule New Session
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

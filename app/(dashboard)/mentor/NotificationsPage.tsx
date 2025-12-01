"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Star, 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp,
  Filter,
  CheckCheck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'session' | 'message' | 'feedback' | 'payment' | 'mentee' | 'review' | 'achievement' | 'system' | 'request';
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  icon: React.ElementType;
  color: string;
  // For session requests
  isRequest?: boolean;
  requestData?: {
    mentee: string;
    avatar: string;
    sessionType: string;
    requestedDate: string;
    requestedTime: string;
    price: number;
  };
}

export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    // Today - Session Requests
    {
      id: 'req1',
      type: 'request',
      title: 'New Session Request',
      message: 'Jessica Thompson wants to book a Technical Interview session with you.',
      time: '2 hours ago',
      date: 'Today',
      read: false,
      icon: Users,
      color: 'orange',
      isRequest: true,
      requestData: {
        mentee: 'Jessica Thompson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        sessionType: 'Technical Interview',
        requestedDate: 'Oct 16, 2025',
        requestedTime: '3:00 PM - 4:00 PM',
        price: 120
      }
    },
    {
      id: 'req2',
      type: 'request',
      title: 'New Session Request',
      message: 'David Kumar wants to book a System Design session with you.',
      time: '5 hours ago',
      date: 'Today',
      read: false,
      icon: Users,
      color: 'orange',
      isRequest: true,
      requestData: {
        mentee: 'David Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        sessionType: 'System Design',
        requestedDate: 'Oct 17, 2025',
        requestedTime: '10:00 AM - 11:30 AM',
        price: 150
      }
    },
    {
      id: '1',
      type: 'session',
      title: 'Upcoming Session Reminder',
      message: 'Technical Interview with Sarah Mitchell starts in 30 minutes. Make sure you\'re ready!',
      time: '2 mins ago',
      date: 'Today',
      read: false,
      icon: Calendar,
      color: 'cyan'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Mentee',
      message: 'James Rodriguez: "Hi, I have a question about the feedback you provided on my system design..."',
      time: '15 mins ago',
      date: 'Today',
      read: false,
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: '3',
      type: 'feedback',
      title: 'Feedback Request',
      message: 'Please provide feedback for your completed session with Alex Chen from yesterday.',
      time: '1 hour ago',
      date: 'Today',
      read: false,
      icon: Star,
      color: 'yellow'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      message: '$120 payment received for Technical Interview session with Sarah Mitchell.',
      time: '2 hours ago',
      date: 'Today',
      read: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: '5',
      type: 'session',
      title: 'Session Completed',
      message: 'Your System Design session with Michael Brown has been completed successfully.',
      time: '4 hours ago',
      date: 'Today',
      read: true,
      icon: Check,
      color: 'green'
    },
    // Yesterday
    {
      id: '6',
      type: 'mentee',
      title: 'New Mentee Request',
      message: 'Emily Davis wants to book a System Design session with you. Review their profile and availability.',
      time: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: Users,
      color: 'purple'
    },
    {
      id: '7',
      type: 'review',
      title: 'New 5-Star Review',
      message: 'Sarah Mitchell left you a 5-star review: "Excellent mentor! Very insightful feedback and practical advice."',
      time: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: Star,
      color: 'yellow'
    },
    {
      id: '8',
      type: 'payment',
      title: 'Weekly Payout Processed',
      message: '$2,340 has been transferred to your bank account ending in 4567.',
      time: 'Yesterday',
      date: 'Yesterday',
      read: true,
      icon: DollarSign,
      color: 'green'
    },
    // This Week
    {
      id: '9',
      type: 'achievement',
      title: 'Milestone Achieved! 🎉',
      message: 'Congratulations! You\'ve completed 250 mentoring sessions. Keep up the great work!',
      time: '2 days ago',
      date: 'This Week',
      read: true,
      icon: TrendingUp,
      color: 'cyan'
    },
    {
      id: '10',
      type: 'feedback',
      title: 'Positive Feedback Received',
      message: 'James Rodriguez rated your CV review session 5 stars with excellent comments.',
      time: '3 days ago',
      date: 'This Week',
      read: true,
      icon: Star,
      color: 'yellow'
    },
    {
      id: '11',
      type: 'system',
      title: 'Platform Update',
      message: 'New AI Insights feature is now available! Check out enhanced analytics on your dashboard.',
      time: '4 days ago',
      date: 'This Week',
      read: true,
      icon: Bell,
      color: 'blue'
    },
    {
      id: '12',
      type: 'session',
      title: 'Session Rescheduled',
      message: 'Your session with Lisa Anderson has been rescheduled to next Monday at 3:00 PM.',
      time: '5 days ago',
      date: 'This Week',
      read: true,
      icon: Calendar,
      color: 'orange'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const todayCount = notifications.filter(n => n.date === 'Today').length;

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
    const date = notif.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notif);
    return groups;
  }, {} as Record<string, Notification[]>);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleAcceptRequest = (id: string, menteeName: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success(`Session request from ${menteeName} accepted! 🎉`);
  };

  const handleDeclineRequest = (id: string, menteeName: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.error(`Session request from ${menteeName} declined.`);
  };

  const getBgColor = (color: string) => {
    return `from-${color}-500/20 to-${color}-600/20`;
  };

  const getIconColor = (color: string, read: boolean) => {
    const opacity = read ? '400' : '500';
    return `text-${color}-${opacity}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-[var(--foreground)]">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        <p className="text-[var(--foreground-muted)]">Stay updated with your mentoring activities</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Total Notifications</p>
              <p className="text-[var(--foreground)] text-xl">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Today</p>
              <p className="text-[var(--foreground)] text-xl">{todayCount}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-xl border border-indigo-500/30 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] text-sm">Unread</p>
              <p className="text-[var(--foreground)] text-xl">{unreadCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-[var(--foreground-muted)]" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="session">Sessions</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="mentee">Mentees</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="relative overflow-hidden rounded-xl backdrop-blur-xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--foreground-subtle)' }} />
            <h3 className="text-[var(--foreground)] mb-2">No notifications</h3>
            <p className="text-[var(--foreground-muted)]">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date}>
              <h3 className="text-[var(--foreground-muted)] text-sm mb-3 uppercase tracking-wider">{date}</h3>
              <div className="space-y-3">
                {notifs.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative overflow-hidden rounded-xl backdrop-blur-xl border transition-all group hover:border-purple-500/50 ${
                      !notif.read ? 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : ''
                    }`}
                    style={{ 
                      background: 'var(--card)',
                      borderColor: notif.read ? 'var(--border)' : undefined
                    }}
                  >
                    <div className="p-5 flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${getBgColor(notif.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <notif.icon className={`w-6 h-6 ${getIconColor(notif.color, notif.read)}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`${notif.read ? 'text-[var(--foreground-muted)]' : 'text-[var(--foreground)]'}`} style={!notif.read ? { fontWeight: 600 } : {}}>
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                            )}
                          </div>
                          <span className="text-[var(--foreground-subtle)] text-sm flex-shrink-0">{notif.time}</span>
                        </div>
                        <p className={`text-sm mb-3 ${notif.read ? 'text-[var(--foreground-subtle)]' : 'text-[var(--foreground-muted)]'}`}>
                          {notif.message}
                        </p>

                        {/* Session Request Details */}
                        {notif.isRequest && notif.requestData && (
                          <div className="rounded-lg p-3 mb-3" style={{ background: 'var(--background-muted)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-3 mb-2">
                              <img 
                                src={notif.requestData.avatar} 
                                alt={notif.requestData.mentee}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <p className="text-[var(--foreground)] text-sm">{notif.requestData.mentee}</p>
                                <p className="text-[var(--foreground-muted)] text-xs">{notif.requestData.sessionType}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-purple-400 text-sm">${notif.requestData.price}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {notif.requestData.requestedDate}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notif.requestData.requestedTime}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notif.isRequest ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(notif.id, notif.requestData?.mentee || '')}
                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeclineRequest(notif.id, notif.requestData?.mentee || '')}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                            </>
                          ) : (
                            <>
                              {!notif.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsRead(notif.id)}
                                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteNotification(notif.id)}
                                className="hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}

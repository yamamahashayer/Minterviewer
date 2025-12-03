"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Calendar, MessageSquare, Star, DollarSign, Users, FileText, TrendingUp } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'session' | 'message' | 'feedback' | 'payment' | 'mentee' | 'review' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  color: string;
}

interface NotificationBellProps {
  onViewAll?: () => void;
}

export function NotificationBell({ onViewAll }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'session',
      title: 'Upcoming Session',
      message: 'Technical Interview with Sarah Mitchell starts in 30 minutes',
      time: '2 mins ago',
      read: false,
      icon: Calendar,
      color: 'cyan'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'James Rodriguez sent you a message about CV feedback',
      time: '15 mins ago',
      read: false,
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: '3',
      type: 'feedback',
      title: 'Feedback Request',
      message: 'Please provide feedback for completed session with Alex Chen',
      time: '1 hour ago',
      read: false,
      icon: Star,
      color: 'yellow'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      message: '$120 payment received for Technical Interview session',
      time: '2 hours ago',
      read: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: '5',
      type: 'mentee',
      title: 'New Mentee Request',
      message: 'Emily Davis wants to book a System Design session',
      time: '3 hours ago',
      read: true,
      icon: Users,
      color: 'purple'
    },
    {
      id: '6',
      type: 'review',
      title: 'New Review',
      message: 'Sarah Mitchell left you a 5-star review',
      time: '5 hours ago',
      read: true,
      icon: Star,
      color: 'yellow'
    },
    {
      id: '7',
      type: 'achievement',
      title: 'Milestone Achieved!',
      message: 'Congratulations! You\'ve completed 250 sessions',
      time: '1 day ago',
      read: true,
      icon: TrendingUp,
      color: 'cyan'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIconColor = (color: string, read: boolean) => {
    const opacity = read ? '40' : '400';
    return `text-${color}-${opacity}`;
  };

  const getBgColor = (color: string) => {
    return `from-${color}-500/20 to-${color}-600/20`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border hover:border-purple-500/50 transition-all"
        style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
      >
        <Bell className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs">{unreadCount}</span>
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 border rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--background-muted)' }}>
                <div>
                  <h3 style={{ color: 'var(--foreground)' }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>
                      {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--foreground-subtle)' }} />
                    <p style={{ color: 'var(--foreground-muted)' }}>No notifications</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--foreground-subtle)' }}>You're all caught up!</p>
                  </div>
                ) : (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 transition-colors relative group ${
                          !notif.read ? 'bg-purple-500/10 hover:bg-purple-500/15' : ''
                        }`}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          background: notif.read ? 'transparent' : undefined
                        }}
                        onMouseEnter={(e) => {
                          if (notif.read) {
                            e.currentTarget.style.background = 'var(--background-muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (notif.read) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 bg-gradient-to-br ${getBgColor(notif.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <notif.icon className={`w-5 h-5 ${getIconColor(notif.color, notif.read)}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm ${notif.read ? '' : ''}`} style={{ color: notif.read ? 'var(--foreground-muted)' : 'var(--foreground)', fontWeight: notif.read ? 400 : 600 }}>
                                {notif.title}
                              </h4>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-1 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                              )}
                            </div>
                            <p className={`text-xs mb-2`} style={{ color: notif.read ? 'var(--foreground-subtle)' : 'var(--foreground-muted)' }}>
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{notif.time}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {!notif.read && (
                                  <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="p-1 rounded hover:text-purple-400"
                                    style={{ color: 'var(--foreground-muted)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background-muted)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    title="Mark as read"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => removeNotification(notif.id)}
                                  className="p-1 rounded hover:text-red-400"
                                  style={{ color: 'var(--foreground-muted)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background-muted)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  title="Remove"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--background-muted)' }}>
                  <Button
                    variant="ghost"
                    className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    onClick={() => {
                      setIsOpen(false);
                      onViewAll?.();
                    }}
                  >
                    View All Notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

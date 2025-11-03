import { useState } from "react";
import { 
  Bell,
  Award,
  MessageSquare,
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  X,
  Check,
  Trash2,
  Filter,
  Settings as SettingsIcon,
  Mail,
  MailOpen,
  Clock,
  Star
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function NotificationsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      title: "New Achievement Unlocked! 🏆",
      message: "You've completed 50 interviews! You've earned the 'Interview Master' badge.",
      time: "5 minutes ago",
      read: false,
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30"
    },
    {
      id: 2,
      type: "message",
      title: "New Message from AI Coach",
      message: "Great job on your last technical interview! Here are some areas to focus on for improvement.",
      time: "1 hour ago",
      read: false,
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      id: 3,
      type: "reminder",
      title: "Upcoming Interview Reminder",
      message: "You have a System Design interview scheduled for tomorrow at 2:00 PM.",
      time: "2 hours ago",
      read: false,
      icon: Calendar,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30"
    },
    {
      id: 4,
      type: "performance",
      title: "Performance Report Ready",
      message: "Your monthly performance report for September 2025 is now available for download.",
      time: "3 hours ago",
      read: true,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30"
    },
    {
      id: 5,
      type: "goal",
      title: "Goal Milestone Reached!",
      message: "You've completed 75% of your 'Master System Design' goal. Keep up the great work!",
      time: "5 hours ago",
      read: true,
      icon: Target,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      borderColor: "border-teal-500/30"
    },
    {
      id: 6,
      type: "system",
      title: "System Update Available",
      message: "A new version of Minterviewer is available with enhanced features and bug fixes.",
      time: "1 day ago",
      read: true,
      icon: AlertCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30"
    },
    {
      id: 7,
      type: "achievement",
      title: "Streak Achievement! 🔥",
      message: "You've maintained a 15-day practice streak! You're on fire!",
      time: "1 day ago",
      read: true,
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30"
    },
    {
      id: 8,
      type: "message",
      title: "Feedback on Technical Interview",
      message: "Your interviewer has left detailed feedback on your recent coding challenge.",
      time: "2 days ago",
      read: true,
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      id: 9,
      type: "reminder",
      title: "Practice Reminder",
      message: "It's time for your daily coding practice! 30 minutes recommended.",
      time: "2 days ago",
      read: true,
      icon: Clock,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30"
    },
    {
      id: 10,
      type: "performance",
      title: "Score Improvement Detected",
      message: "Your average interview score has improved by 12% this month. Excellent progress!",
      time: "3 days ago",
      read: true,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const notificationTypes = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "achievement", label: "Achievements", count: notifications.filter(n => n.type === "achievement").length },
    { id: "message", label: "Messages", count: notifications.filter(n => n.type === "message").length },
    { id: "reminder", label: "Reminders", count: notifications.filter(n => n.type === "reminder").length },
    { id: "performance", label: "Performance", count: notifications.filter(n => n.type === "performance").length },
  ];

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{fontWeight: 700}}>Notifications 🔔</h1>
              {unreadCount > 0 && (
                <Badge className={isDark ? "bg-teal-500 text-white border-none" : "bg-purple-600 text-white border-none font-semibold"}>
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Stay updated with your interview preparation journey</p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <Button 
                onClick={markAllAsRead}
                className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 hover:border-green-400 font-semibold shadow-sm"}
              >
                <CheckCircle2 size={16} className="mr-2" />
                Mark All as Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                onClick={clearAll}
                className={isDark ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-2 border-red-400/50 hover:border-red-400/70 shadow-md shadow-red-500/10" : "bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 hover:border-red-400 font-semibold shadow-sm"}
              >
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div className={`h-1 w-[200px] rounded-full ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <div className="flex items-center justify-between mb-2">
            <Bell className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
            <Badge className={isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"}>Total</Badge>
          </div>
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{notifications.length}</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>All Notifications</p>
        </div>

        <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <div className="flex items-center justify-between mb-2">
            <Mail className={isDark ? "text-blue-400" : "text-pink-600"} size={24} />
            <Badge className={isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-pink-100 text-pink-700 border-pink-300 font-semibold"}>Unread</Badge>
          </div>
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{unreadCount}</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>New Notifications</p>
        </div>

        <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <div className="flex items-center justify-between mb-2">
            <Award className={isDark ? "text-amber-400" : "text-amber-600"} size={24} />
            <Badge className={isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300 font-semibold"}>Achievements</Badge>
          </div>
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{notifications.filter(n => n.type === "achievement").length}</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Achievement Alerts</p>
        </div>

        <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className={isDark ? "text-violet-400" : "text-purple-600"} size={24} />
            <Badge className={isDark ? "bg-violet-500/20 text-violet-300 border-violet-500/30" : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"}>Messages</Badge>
          </div>
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{notifications.filter(n => n.type === "message").length}</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Coach Messages</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`mb-6 flex-wrap h-auto ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]" : "bg-white border-[#ddd6fe] shadow-sm"} border`}>
          {notificationTypes.map((type) => (
            <TabsTrigger 
              key={type.id}
              value={type.id} 
              className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold text-[#6b21a8]"}
            >
              {type.label}
              {type.count > 0 && (
                <Badge className={`ml-2 text-xs px-1.5 py-0 ${isDark ? "bg-teal-500/30 text-teal-200 border-teal-500/40" : "bg-purple-200 text-purple-700 border-purple-300"}`}>
                  {type.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredNotifications.length === 0 ? (
            <div className={`rounded-xl p-12 backdrop-blur-sm text-center ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
              <Bell className={isDark ? "text-[#99a1af]" : "text-purple-300"} size={48} />
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold mt-4`}>No notifications</h3>
              <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`border rounded-xl p-5 backdrop-blur-sm transition-all ${
                      isDark 
                        ? `bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] hover:shadow-lg hover:shadow-teal-500/5 ${
                            notification.read 
                              ? 'border-[rgba(94,234,212,0.15)]' 
                              : 'border-[rgba(94,234,212,0.3)] shadow-md shadow-teal-500/10'
                          }`
                        : `bg-white shadow-md hover:shadow-xl ${
                            notification.read
                              ? 'border-purple-200'
                              : 'border-purple-400 shadow-purple-200'
                          }`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${notification.bgColor} border ${notification.borderColor} flex items-center justify-center shrink-0`}>
                        <Icon className={notification.color} size={24} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{notification.title}</h4>
                              {!notification.read && (
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-teal-400" : "bg-purple-600"}`} />
                              )}
                            </div>
                            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm leading-relaxed`}>{notification.message}</p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleRead(notification.id)}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                                notification.read
                                  ? (isDark 
                                      ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-[#99a1af] hover:text-teal-300 hover:border-[rgba(94,234,212,0.4)]'
                                      : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-400')
                                  : (isDark
                                      ? 'bg-teal-500/20 border-teal-500/30 text-teal-300 hover:bg-teal-500/30'
                                      : 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200')
                              }`}
                              title={notification.read ? "Mark as unread" : "Mark as read"}
                            >
                              {notification.read ? <Mail size={16} /> : <MailOpen size={16} />}
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center ${
                                isDark
                                  ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-[#99a1af] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30'
                                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-400'
                              }`}
                              title="Delete notification"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-purple-200"}`}>
                          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-[#6a7282]" : "text-purple-500"}`}>
                            <Clock size={12} />
                            <span>{notification.time}</span>
                          </div>
                          <Badge className={`${notification.bgColor} ${notification.color} border-${notification.borderColor} text-xs`}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <div className={`mt-8 rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 flex items-center gap-2 font-semibold`}>
            <SettingsIcon size={20} className={isDark ? "text-teal-300" : "text-purple-600"} />
            Notification Preferences
          </h3>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-4`}>
            Manage how you receive notifications and customize your alert preferences in Settings.
          </p>
          <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold shadow-sm"}>
            <SettingsIcon size={16} className="mr-2" />
            Notification Settings
          </Button>
        </div>
      )}
    </div>
  );
}

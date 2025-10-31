'use client';
import { 
  TrendingUp, 
  Award,
  Target,
  Calendar,
  Clock,
  Star,
  Zap,
  Trophy,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Activity,
  Brain,
  Code,
  MessageSquare,
  Video,
  FileText,
  Users,
  Play,
  Upload
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";

export default function OverviewPage({ onNavigate, theme = "dark" }: { onNavigate?: (page: string) => void; theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const weeklyData = [
    { day: "Mon", score: 8.2, time: 1.5 },
    { day: "Tue", score: 8.5, time: 2.0 },
    { day: "Wed", score: 8.3, time: 1.8 },
    { day: "Thu", score: 8.8, time: 2.2 },
    { day: "Fri", score: 8.9, time: 2.5 },
    { day: "Sat", score: 8.7, time: 2.0 },
    { day: "Sun", score: 9.0, time: 1.5 },
  ];

  const stats = [
    { 
      label: "Overall Score", 
      value: "8.7/10", 
      change: "+12%", 
      trend: "up",
      icon: Award,
      color: "text-teal-300",
      bgGradient: "from-teal-500/20 to-emerald-500/10"
    },
    { 
      label: "Total Interviews", 
      value: "127", 
      change: "+15", 
      trend: "up",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-teal-500/10"
    },
    { 
      label: "Practice Streak", 
      value: "15 days", 
      change: "+3", 
      trend: "up",
      icon: Zap,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/10"
    },
    { 
      label: "This Week", 
      value: "12.5h", 
      change: "+2.5h", 
      trend: "up",
      icon: Clock,
      color: "text-violet-400",
      bgGradient: "from-violet-500/20 to-purple-500/10"
    },
  ];

  const upcomingInterviews = [
    { id: 1, title: "Technical Interview", type: "technical", time: "Today, 10:00 AM", duration: "60 min" },
    { id: 2, title: "System Design", type: "system-design", time: "Today, 2:00 PM", duration: "90 min" },
    { id: 3, title: "Behavioral Prep", type: "behavioral", time: "Tomorrow, 11:00 AM", duration: "45 min" },
  ];

  const recentAchievements = [
    { id: 1, title: "Interview Master", icon: Trophy, color: "text-amber-400", date: "2 days ago" },
    { id: 2, title: "Top Performer", icon: Star, color: "text-teal-400", date: "5 days ago" },
    { id: 3, title: "Streak Champion", icon: Zap, color: "text-emerald-400", date: "1 week ago" },
  ];

  const quickActionsTop = [
    {
      id: "practice",
      title: "Start AI Interview",
      description: "Practice with AI-powered mock interviews",
      icon: Play,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      borderColor: "border-teal-500/30",
      action: "interview-practice"
    },
    {
      id: "cv",
      title: "Upload CV for Review",
      description: "Get AI feedback on your resume",
      icon: Upload,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      action: "cv-review"
    },
    {
      id: "mentor",
      title: "Book Mentor Session",
      description: "Connect with industry experts",
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30",
      action: "mentors"
    },
    {
      id: "schedule",
      title: "Schedule Interview",
      description: "Book your next mock interview",
      icon: Calendar,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      action: "schedule"
    }
  ];

  const currentGoals = [
    { id: 1, title: "Complete 50 Technical Interviews", progress: 84, current: 42, target: 50 },
    { id: 2, title: "Achieve 9.0 Average Score", progress: 72, current: 8.7, target: 9.0 },
    { id: 3, title: "30-Day Practice Streak", progress: 50, current: 15, target: 30 },
  ];

  const quickActions = [
    { id: 1, title: "Start Interview", icon: Video, gradient: "from-teal-500 to-emerald-500" },
    { id: 2, title: "Practice Coding", icon: Code, gradient: "from-violet-500 to-purple-500" },
    { id: 3, title: "Review Feedback", icon: MessageSquare, gradient: "from-amber-500 to-orange-500" },
    { id: 4, title: "Check Schedule", icon: Calendar, gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Dashboard Overview 🎯</h1>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Your interview preparation journey at a glance</p>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActionsTop.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onNavigate?.(action.action)}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-md hover:shadow-xl"} border ${isDark ? action.borderColor : "border-[#c4b5fd]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)] hover:shadow-teal-500/10" : "hover:border-[#a855f7] hover:shadow-purple-200"} transition-all text-left group`}
            >
              <div className={`w-12 h-12 rounded-lg ${action.bgColor} border ${isDark ? action.borderColor : "border-[#ddd6fe]"} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={action.color} size={24} />
              </div>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 text-sm font-semibold`}>{action.title}</h3>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? `bg-gradient-to-br ${stat.bgGradient}` : "bg-white shadow-md"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-lg"} transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={isDark ? stat.color : "text-purple-600"} size={28} />
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUp className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                  ) : (
                    <ArrowDown className={isDark ? "text-red-400" : "text-red-600"} size={16} />
                  )}
                  <span className={stat.trend === "up" ? (isDark ? "text-emerald-400 text-xs" : "text-green-600 text-xs font-semibold") : (isDark ? "text-red-400 text-xs" : "text-red-600 text-xs font-semibold")}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Weekly Performance Chart */}
        <div className={`col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex items-center gap-2 font-semibold`}>
              <TrendingUp className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Weekly Performance
            </h3>
            <Badge className={isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-green-100 text-green-700 border-green-300 font-semibold"}>
              +8% vs last week
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
              <XAxis dataKey="day" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} domain={[7, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                  border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#2e1065',
                  fontWeight: 600
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={isDark ? "#5EEAD4" : "#7c3aed"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Zap className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg ${isDark ? `bg-gradient-to-r ${action.gradient}` : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"} hover:opacity-90 transition-all text-white font-medium shadow-md`}
                >
                  <Icon size={20} />
                  <span>{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Upcoming Interviews */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Calendar className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Upcoming Today
          </h3>
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className={`${isDark ? "bg-[rgba(255,255,255,0.03)]" : "bg-purple-50"} border ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} rounded-lg p-4 ${isDark ? "hover:border-[rgba(94,234,212,0.3)]" : "hover:border-[#a855f7] hover:shadow-md"} transition-all`}
              >
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>{interview.title}</h4>
                <div className={`flex items-center gap-2 text-xs ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} mb-2`}>
                  <Clock size={12} />
                  <span className="font-medium">{interview.time}</span>
                </div>
                <Badge className={isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs" : "bg-purple-100 text-purple-700 border-purple-300 text-xs font-semibold"}>
                  {interview.duration}
                </Badge>
              </div>
            ))}
          </div>
          <Button className={`w-full mt-4 ${isDark ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold shadow-md"}`}>
            View All Schedule
          </Button>
        </div>

        {/* Current Goals */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Target className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Current Goals
          </h3>
          <div className="space-y-4">
            {currentGoals.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className={isDark ? "text-[#d1d5dc] text-sm font-medium" : "text-[#2e1065] text-sm font-medium"}>{goal.title}</span>
                  <span className={isDark ? "text-teal-300 text-xs font-bold" : "text-purple-600 text-xs font-bold"}>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className={isDark ? "h-2 bg-[rgba(255,255,255,0.05)]" : "h-2 bg-purple-100"} />
                <p className={isDark ? "text-[#6a7282] text-xs mt-1 font-medium" : "text-[#7c3aed] text-xs mt-1 font-medium"}>
                  {goal.current} / {goal.target}
                </p>
              </div>
            ))}
          </div>
          <Button className={isDark ? "w-full mt-4 bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]" : "w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold shadow-md"}>
            Manage Goals
          </Button>
        </div>

        {/* Recent Achievements */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Award className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`${isDark ? "bg-[rgba(255,255,255,0.03)]" : "bg-purple-50"} border ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} rounded-lg p-4 ${isDark ? "hover:border-[rgba(94,234,212,0.3)]" : "hover:border-[#a855f7] hover:shadow-md"} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isDark ? "bg-gradient-to-br from-[rgba(94,234,212,0.2)] to-[rgba(52,211,153,0.1)]" : "bg-gradient-to-br from-purple-100 to-pink-100"} flex items-center justify-center`}>
                      <Icon className={isDark ? achievement.color : "text-purple-600"} size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-1 font-semibold`}>{achievement.title}</h4>
                      <p className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs font-medium`}>{achievement.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button className={`w-full mt-4 ${isDark ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold shadow-md"}`}>
            View All Achievements
          </Button>
        </div>
      </div>
    </div>
  );
}
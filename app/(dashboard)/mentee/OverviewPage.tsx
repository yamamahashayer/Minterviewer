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
  Upload,
  LucideIcon,
  ThumbsUp,
  Lightbulb
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
import { useEffect, useState } from "react";

interface DashboardData {
  stats: {
    overallScore: number;
    totalInterviews: number;
    hoursThisWeek: number | string;
    totalHours: number | string;
    activeDays?: number;
  };
  weeklyData: { day: string; score: number; time: number }[];
  upcomingInterviews: {
    id: string;
    title: string;
    type?: string;
    time: string;
    duration: string;
  }[];
  currentGoals: {
    id: string;
    title: string;
    progress: number;
    current: number;
    target: number;
  }[];
  recentAchievements: {
    id: string;
    title: string;
    icon?: string;
    color?: string;
    date: string;
  }[];
  lastInterviewFeedback?: {
    id: string;
    date: string;
    score: number;
    strengths: string[];
    improvements: string[];
    skills: string[];
  } | null;
  monthlyData?: {
    month: string;
    avgScore: number;
    interviewCount: number;
    sessionHours: number;
  }[];
  skillsBreakdown?: {
    skill: string;
    avgScore: number;
    attempts: number;
  }[];
  activityPattern?: {
    date: string;
    count: number;
  }[];
  sessionMetrics?: {
    completionRate: number;
    totalBooked: number;
    totalCompleted: number;
    avgDuration: number;
  };
  progressMetrics?: {
    improvement: number;
    consistency: number;
    currentStreak: number;
  };
}

const iconMap: { [key: string]: LucideIcon } = {
  Trophy,
  Star,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp
};

export default function OverviewPage({ onNavigate, theme = "dark" }: { onNavigate?: (page: string) => void; theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/mentee/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        } else {
          const errorText = await res.text();
          console.error("Failed to fetch dashboard data:", res.status, errorText);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Default fallbacks while loading or if data missing
  const weeklyData = dashboardData?.weeklyData || [
    { day: "Mon", score: 0, time: 0 },
    { day: "Tue", score: 0, time: 0 },
    { day: "Wed", score: 0, time: 0 },
    { day: "Thu", score: 0, time: 0 },
    { day: "Fri", score: 0, time: 0 },
    { day: "Sat", score: 0, time: 0 },
    { day: "Sun", score: 0, time: 0 },
  ];

  const statsValues = dashboardData?.stats || {
    overallScore: 0,
    totalInterviews: 0,
    hoursThisWeek: 0,
    totalHours: 0
  };

  const stats = [
    {
      label: "Overall Score",
      value: `${(statsValues.overallScore ? (statsValues.overallScore <= 10 ? statsValues.overallScore : statsValues.overallScore / 10) : 0).toFixed(1)}/10`,
      change: "",
      trend: "up",
      icon: Award,
      color: "text-teal-300",
      bgGradient: "from-teal-500/20 to-emerald-500/10"
    },
    {
      label: "Total Interviews",
      value: (statsValues.totalInterviews || 0).toString(),
      change: "",
      trend: "up",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-teal-500/10"
    },
    {
      label: "Active Days",
      value: (statsValues.activeDays || 0).toString(),
      change: "",
      trend: "up",
      icon: Zap,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/10"
    },
    {
      label: "Total Hours",
      value: `${statsValues.totalHours || 0}h`,
      change: "",
      trend: "up",
      icon: Clock,
      color: "text-violet-400",
      bgGradient: "from-violet-500/20 to-purple-500/10"
    },
  ];

  const upcomingInterviews = dashboardData?.upcomingInterviews || [];
  const recentAchievements = dashboardData?.recentAchievements || [];
  const currentGoals = dashboardData?.currentGoals || [];
  const lastInterview = dashboardData?.lastInterviewFeedback;

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

  if (loading) {
    return <div className={`min-h-screen p-8 flex items-center justify-center ${isDark ? "text-white" : "text-purple-900"}`}>Loading Dashboard...</div>;
  }

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Dashboard Overview 🎯</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Weekly Performance Chart */}
        <div className={`col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex items-center gap-2 font-semibold`}>
              <TrendingUp className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Weekly Performance
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
              <XAxis dataKey="day" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} domain={[0, 10]} />
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

        {/* Last Interview Insights (Replaces Quick Actions) */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm flex flex-col`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 flex items-center gap-2 font-semibold`}>
            <Brain className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Latest Insights
          </h3>

          {lastInterview ? (
            <div className="flex-1 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Date: {lastInterview.date}</span>
                <Badge variant="outline" className={isDark ? "border-teal-500/50 text-teal-300" : "border-purple-500 text-purple-700"}>
                  Score: {Math.round(lastInterview.score)}%
                </Badge>
              </div>

              {lastInterview.strengths && lastInterview.strengths.length > 0 && (
                <div>
                  <h4 className={`flex items-center gap-2 font-medium mb-2 ${isDark ? "text-emerald-400" : "text-green-600"}`}>
                    <ThumbsUp size={14} /> Strengths
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {lastInterview.strengths.slice(0, 2).map((s, i) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lastInterview.improvements && lastInterview.improvements.length > 0 && (
                <div>
                  <h4 className={`flex items-center gap-2 font-medium mb-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                    <Lightbulb size={14} /> Suggestions
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {lastInterview.improvements.slice(0, 2).map((s, i) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-2">
                {lastInterview.skills.map((skill, k) => (
                  <Badge key={k} variant="secondary" className={`${isDark ? "bg-white/10 text-white" : "bg-purple-100 text-purple-800"}`}>
                    {skill}
                  </Badge>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <Brain size={40} className="mb-2" />
              <p>No interview insights yet.</p>
              <Button variant="link" onClick={() => onNavigate?.("interview-practice")}>Start one now</Button>
            </div>
          )}
        </div>
      </div>

      {/* Three Column Layout */}
      {/* New Analytics Sections */}

      {/* Monthly Performance Trend */}
      {dashboardData?.monthlyData && dashboardData.monthlyData.length > 0 && (
        <div className={`mt-8 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm mb-8`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold text-lg`}>
            <TrendingUp className={isDark ? "text-teal-300" : "text-purple-600"} size={22} />
            6-Month Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
              <XAxis
                dataKey="month"
                stroke={isDark ? "#99a1af" : "#6b21a8"}
                style={{ fontSize: '12px', fontWeight: 500 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year.slice(2)}`;
                }}
              />
              <YAxis yAxisId="left" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)',
                  border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(value) => {
                  const [year, month] = value.split('-');
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return `${monthNames[parseInt(month) - 1]} ${year}`;
                }}
              />
              <Bar yAxisId="left" dataKey="interviewCount" fill={isDark ? "#5EEAD4" : "#7c3aed"} name="Interviews" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="sessionHours" fill={isDark ? "#34D399" : "#ec4899"} name="Session Hours" radius={[8, 8, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke={isDark ? "#FCD34D" : "#f59e0b"} strokeWidth={2} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skills & Session Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Skills Performance Breakdown */}
        {dashboardData?.skillsBreakdown && dashboardData.skillsBreakdown.length > 0 && (
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Code className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Top Skills Performance
            </h3>
            <div className="space-y-4">
              {dashboardData.skillsBreakdown.slice(0, 8).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium truncate`}>{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`${isDark ? "text-teal-300" : "text-purple-600"} text-xs font-bold`}>{skill.avgScore.toFixed(1)}%</span>
                      <Badge variant="outline" className={`${isDark ? "border-teal-500/50 text-teal-300" : "border-purple-500 text-purple-700"} text-xs`}>
                        {skill.attempts}x
                      </Badge>
                    </div>
                  </div>
                  <Progress value={skill.avgScore} className={`h-2 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Analytics */}
        {dashboardData?.sessionMetrics && (
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Calendar className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Session Analytics
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>Completion Rate</span>
                  <span className={`${isDark ? "text-teal-300" : "text-purple-600"} text-lg font-bold`}>{dashboardData.sessionMetrics.completionRate}%</span>
                </div>
                <Progress value={dashboardData.sessionMetrics.completionRate} className={`h-3 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"}`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`${isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-purple-50"} rounded-lg p-4`}>
                  <div className={`${isDark ? "text-teal-300" : "text-purple-600"} text-2xl font-bold mb-1`}>{dashboardData.sessionMetrics.totalBooked}</div>
                  <div className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>Total Booked</div>
                </div>
                <div className={`${isDark ? "bg-[rgba(52,211,153,0.1)]" : "bg-pink-50"} rounded-lg p-4`}>
                  <div className={`${isDark ? "text-emerald-300" : "text-pink-600"} text-2xl font-bold mb-1`}>{dashboardData.sessionMetrics.totalCompleted}</div>
                  <div className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>Completed</div>
                </div>
              </div>

              <div className={`${isDark ? "bg-[rgba(251,191,36,0.1)]" : "bg-amber-50"} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <span className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm`}>Avg Duration</span>
                  <div className="flex items-center gap-2">
                    <Clock className={isDark ? "text-amber-300" : "text-amber-600"} size={18} />
                    <span className={`${isDark ? "text-amber-300" : "text-amber-600"} text-lg font-bold`}>{dashboardData.sessionMetrics.avgDuration} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Metrics Cards */}
      {dashboardData?.progressMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(16,185,129,0.1)]" : "bg-gradient-to-br from-green-50 to-emerald-50"} border ${isDark ? "border-[rgba(52,211,153,0.3)]" : "border-green-200"} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className={isDark ? "text-emerald-300" : "text-green-600"} size={28} />
              <Badge className={`${isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-green-100 text-green-700 border-green-300"}`}>
                {dashboardData.progressMetrics.improvement > 0 ? '+' : ''}{dashboardData.progressMetrics.improvement}%
              </Badge>
            </div>
            <div className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-bold mb-1`}>Improvement</div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>Recent vs Initial Performance</p>
          </div>

          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(251,191,36,0.2)] to-[rgba(245,158,11,0.1)]" : "bg-gradient-to-br from-amber-50 to-yellow-50"} border ${isDark ? "border-[rgba(251,191,36,0.3)]" : "border-amber-200"} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <Activity className={isDark ? "text-amber-300" : "text-amber-600"} size={28} />
              <Badge className={`${isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300"}`}>
                {dashboardData.progressMetrics.consistency.toFixed(0)}/100
              </Badge>
            </div>
            <div className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-bold mb-1`}>Consistency</div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>Performance Stability Score</p>
          </div>

          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(251,113,133,0.2)] to-[rgba(244,63,94,0.1)]" : "bg-gradient-to-br from-rose-50 to-pink-50"} border ${isDark ? "border-[rgba(251,113,133,0.3)]" : "border-rose-200"} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <Zap className={isDark ? "text-rose-300" : "text-rose-600"} size={28} />
              <Badge className={`${isDark ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-rose-100 text-rose-700 border-rose-300"}`}>
                {dashboardData.progressMetrics.currentStreak} days
              </Badge>
            </div>
            <div className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-bold mb-1`}>Current Streak</div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>Consecutive Active Days</p>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Award,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Brain,
  Code,
  Users,
  Settings as SettingsIcon
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPie, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from "recharts";

export default function PerformancePage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState("30days");

  // Performance trend data
  const performanceTrendData = [
    { date: "Week 1", score: 7.2, interviews: 8 },
    { date: "Week 2", score: 7.8, interviews: 12 },
    { date: "Week 3", score: 8.1, interviews: 10 },
    { date: "Week 4", score: 8.5, interviews: 15 },
    { date: "Week 5", score: 8.7, interviews: 14 },
    { date: "Week 6", score: 8.9, interviews: 16 },
  ];

  // Category performance data
  const categoryData = [
    { category: "Technical", score: 92 },
    { category: "Behavioral", score: 85 },
    { category: "System Design", score: 88 },
    { category: "Problem Solving", score: 90 },
    { category: "Communication", score: 87 },
    { category: "Leadership", score: 83 },
  ];

  // Interview type distribution
  const interviewTypeData = [
    { name: "Technical", value: 45, color: "#5EEAD4" },
    { name: "Behavioral", value: 25, color: "#34D399" },
    { name: "System Design", value: 20, color: "#A78BFA" },
    { name: "Coding", value: 10, color: "#F59E0B" },
  ];

  // Time investment data
  const timeInvestmentData = [
    { month: "Jan", hours: 32 },
    { month: "Feb", hours: 38 },
    { month: "Mar", hours: 42 },
    { month: "Apr", hours: 45 },
    { month: "May", hours: 48 },
    { month: "Jun", hours: 52 },
  ];

  // Overall stats
  const overallStats = [
    { 
      label: "Overall Score", 
      value: "8.7/10", 
      change: "+12%",
      trend: "up",
      icon: Award,
      color: "text-teal-300"
    },
    { 
      label: "Completion Rate", 
      value: "94%", 
      change: "+5%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-emerald-400"
    },
    { 
      label: "Avg Response Time", 
      value: "2.3 min", 
      change: "-8%",
      trend: "up",
      icon: Clock,
      color: "text-violet-400"
    },
    { 
      label: "Practice Streak", 
      value: "15 days", 
      change: "+3 days",
      trend: "up",
      icon: Zap,
      color: "text-amber-400"
    },
  ];

  // Recent interviews detailed
  const recentInterviews = [
    {
      id: 1,
      title: "Senior Software Engineer - Technical",
      company: "Tech Corp",
      date: "Oct 9, 2025",
      score: 9.2,
      duration: "45 min",
      status: "excellent",
      strengths: ["Problem solving", "Code quality"],
      improvements: ["Time management"]
    },
    {
      id: 2,
      title: "System Design - E-commerce Platform",
      company: "Online Store Inc",
      date: "Oct 8, 2025",
      score: 8.8,
      duration: "60 min",
      status: "good",
      strengths: ["Scalability design", "Database choices"],
      improvements: ["Caching strategy"]
    },
    {
      id: 3,
      title: "Behavioral - Leadership Questions",
      company: "Startup XYZ",
      date: "Oct 7, 2025",
      score: 8.5,
      duration: "30 min",
      status: "good",
      strengths: ["Communication", "Examples"],
      improvements: ["STAR method"]
    },
    {
      id: 4,
      title: "Coding Challenge - Algorithms",
      company: "Big Tech Co",
      date: "Oct 6, 2025",
      score: 9.0,
      duration: "50 min",
      status: "excellent",
      strengths: ["Algorithm efficiency", "Edge cases"],
      improvements: ["Code readability"]
    },
  ];

  // Skill breakdown
  const skillBreakdown = [
    { skill: "Data Structures", level: 92, trend: "up" },
    { skill: "Algorithms", level: 90, trend: "up" },
    { skill: "System Architecture", level: 88, trend: "up" },
    { skill: "Communication", level: 87, trend: "stable" },
    { skill: "Problem Analysis", level: 89, trend: "up" },
    { skill: "Code Quality", level: 91, trend: "up" },
  ];

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case "excellent": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        case "good": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
        case "average": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      }
    } else {
      switch (status) {
        case "excellent": return "bg-green-100 text-green-700 border-green-300 font-semibold";
        case "good": return "bg-purple-100 text-purple-700 border-purple-300 font-semibold";
        case "average": return "bg-orange-100 text-orange-700 border-orange-300 font-semibold";
        default: return "bg-gray-100 text-gray-700 border-gray-300 font-semibold";
      }
    }
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Performance Analytics 📊</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Track your progress and improve your interview skills</p>
          </div>
          <div className="flex gap-3">
            <Button className={isDark ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]" : "bg-white hover:bg-purple-50 text-purple-700 border-2 border-[#ddd6fe] hover:border-[#a855f7] font-medium shadow-sm"}>
              <Calendar size={16} className="mr-2" />
              {timeRange === "7days" ? "Last 7 Days" : timeRange === "30days" ? "Last 30 Days" : "Last 90 Days"}
            </Button>
            <Button className={isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}>
              Export Report
            </Button>
          </div>
        </div>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overallStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={isDark ? stat.color : "text-purple-600"} size={24} />
                {stat.trend === "up" ? (
                  <TrendingUp className={isDark ? "text-emerald-400" : "text-green-600"} size={18} />
                ) : (
                  <TrendingDown className={isDark ? "text-red-400" : "text-red-600"} size={18} />
                )}
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs mb-2`}>{stat.label}</p>
              <div className="flex items-center gap-1">
                <span className={stat.trend === "up" ? (isDark ? "text-emerald-400 text-xs" : "text-green-600 text-xs font-semibold") : (isDark ? "text-red-400 text-xs" : "text-red-600 text-xs font-semibold")}>
                  {stat.change}
                </span>
                <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Trend Chart */}
        <div className={`lg:col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <BarChart3 className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceTrendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isDark ? "#5EEAD4" : "#7c3aed"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
              <XAxis dataKey="date" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
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

        {/* Interview Type Distribution */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <PieChart className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Interview Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={interviewTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {interviewTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                  border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#2e1065',
                  fontWeight: 600
                }} 
              />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {interviewTypeData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs font-medium`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance & Time Investment */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Category Performance Radar */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Activity className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Category Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={categoryData}>
              <PolarGrid stroke={isDark ? "rgba(94,234,212,0.2)" : "rgba(124,58,237,0.15)"} />
              <PolarAngleAxis 
                dataKey="category" 
                stroke={isDark ? "#99a1af" : "#6b21a8"}
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                stroke={isDark ? "#99a1af" : "#6b21a8"}
                style={{ fontSize: '10px', fontWeight: 500 }}
              />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke={isDark ? "#5EEAD4" : "#7c3aed"} 
                fill={isDark ? "#5EEAD4" : "#7c3aed"} 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                  border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#2e1065',
                  fontWeight: 600
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Investment */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Clock className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Time Investment
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeInvestmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(94,234,212,0.1)" : "rgba(124,58,237,0.1)"} />
              <XAxis dataKey="month" stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke={isDark ? "#99a1af" : "#6b21a8"} style={{ fontSize: '12px', fontWeight: 500 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.98)', 
                  border: isDark ? '1px solid rgba(94,234,212,0.3)' : '1px solid #ddd6fe',
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#2e1065',
                  fontWeight: 600
                }} 
              />
              <Bar dataKey="hours" fill={isDark ? "#5EEAD4" : "#7c3aed"} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Breakdown & Recent Interviews */}
      <div className="grid grid-cols-3 gap-6">
        {/* Skills Breakdown */}
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Brain className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Skills Breakdown
          </h3>
          <div className="space-y-4">
            {skillBreakdown.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${isDark ? "text-teal-300" : "text-purple-600"} font-semibold`}>{skill.level}%</span>
                    {skill.trend === "up" && <TrendingUp className={isDark ? "text-emerald-400" : "text-green-600"} size={14} />}
                  </div>
                </div>
                <div className={`h-2 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${isDark ? "bg-gradient-to-r from-teal-300 to-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className={`col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
            <Target className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
            Recent Interviews
          </h3>
          <div className="space-y-4">
            {recentInterviews.map((interview) => (
              <div
                key={interview.id}
                className={`${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe] hover:border-[#a855f7] shadow-md hover:shadow-lg"} border rounded-lg p-4 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{interview.title}</h4>
                    <div className={`flex items-center gap-3 text-xs ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} font-medium`}>
                      <span>{interview.company}</span>
                      <span>•</span>
                      <span>{interview.date}</span>
                      <span>•</span>
                      <span>{interview.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <div className={`${isDark ? "text-teal-300" : "text-purple-600"} font-bold text-lg`}>{interview.score}/10</div>
                  </div>
                </div>
                <div className={`grid grid-cols-2 gap-4 pt-3 border-t ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={14} />
                      <span className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs font-medium`}>Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {interview.strengths.map((strength, idx) => (
                        <Badge key={idx} className={isDark ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs" : "bg-green-100 text-green-700 border-green-300 text-xs font-medium"}>
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className={isDark ? "text-amber-400" : "text-orange-500"} size={14} />
                      <span className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs font-medium`}>Areas to Improve</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {interview.improvements.map((improvement, idx) => (
                        <Badge key={idx} className={isDark ? "bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs" : "bg-orange-100 text-orange-700 border-orange-300 text-xs font-medium"}>
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
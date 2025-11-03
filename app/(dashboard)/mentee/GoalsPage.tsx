
import { useState } from "react";
import { 
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Flag,
  Clock,
  BarChart3
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Goal {
  id: number;
  title: string;
  description: string;
  category: "technical" | "behavioral" | "performance" | "career";
  progress: number;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  status: "active" | "completed" | "paused";
  priority: "high" | "medium" | "low";
  milestones: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
}

export default function GoalsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Complete 50 Technical Interviews",
      description: "Master technical interview skills by completing 50 AI-powered technical interview sessions",
      category: "technical",
      progress: 84,
      current: 42,
      target: 50,
      unit: "interviews",
      deadline: "Nov 30, 2025",
      status: "active",
      priority: "high",
      milestones: [
        { id: 1, title: "Complete 10 interviews", completed: true },
        { id: 2, title: "Complete 25 interviews", completed: true },
        { id: 3, title: "Complete 40 interviews", completed: true },
        { id: 4, title: "Complete 50 interviews", completed: false },
      ]
    },
    {
      id: 2,
      title: "Achieve 9.0 Average Score",
      description: "Improve interview performance to achieve and maintain a 9.0/10 average score",
      category: "performance",
      progress: 72,
      current: 8.7,
      target: 9.0,
      unit: "score",
      deadline: "Dec 15, 2025",
      status: "active",
      priority: "high",
      milestones: [
        { id: 1, title: "Reach 8.0 average", completed: true },
        { id: 2, title: "Reach 8.5 average", completed: true },
        { id: 3, title: "Reach 9.0 average", completed: false },
        { id: 4, title: "Maintain 9.0+ for 2 weeks", completed: false },
      ]
    },
    {
      id: 3,
      title: "30-Day Practice Streak",
      description: "Build consistency by maintaining a 30-day continuous practice streak",
      category: "performance",
      progress: 50,
      current: 15,
      target: 30,
      unit: "days",
      deadline: "Nov 10, 2025",
      status: "active",
      priority: "medium",
      milestones: [
        { id: 1, title: "7-day streak", completed: true },
        { id: 2, title: "15-day streak", completed: true },
        { id: 3, title: "30-day streak", completed: false },
      ]
    },
    {
      id: 4,
      title: "Master System Design",
      description: "Complete 20 system design interview sessions with 8.5+ average score",
      category: "technical",
      progress: 30,
      current: 6,
      target: 20,
      unit: "sessions",
      deadline: "Dec 31, 2025",
      status: "active",
      priority: "medium",
      milestones: [
        { id: 1, title: "Complete 5 sessions", completed: true },
        { id: 2, title: "Complete 10 sessions", completed: false },
        { id: 3, title: "Complete 15 sessions", completed: false },
        { id: 4, title: "Complete 20 sessions", completed: false },
      ]
    },
    {
      id: 5,
      title: "Behavioral Excellence",
      description: "Achieve 9.0+ in 10 behavioral interview sessions",
      category: "behavioral",
      progress: 40,
      current: 4,
      target: 10,
      unit: "sessions",
      deadline: "Nov 20, 2025",
      status: "active",
      priority: "low",
      milestones: [
        { id: 1, title: "Complete 3 sessions with 9.0+", completed: true },
        { id: 2, title: "Complete 7 sessions with 9.0+", completed: false },
        { id: 3, title: "Complete 10 sessions with 9.0+", completed: false },
      ]
    },
    {
      id: 6,
      title: "Land Dream Job",
      description: "Successfully prepare for and ace interviews at top tech companies",
      category: "career",
      progress: 15,
      current: 3,
      target: 20,
      unit: "applications",
      deadline: "Jan 31, 2026",
      status: "active",
      priority: "high",
      milestones: [
        { id: 1, title: "Update resume and portfolio", completed: true },
        { id: 2, title: "Apply to 10 companies", completed: false },
        { id: 3, title: "Complete 5 onsite interviews", completed: false },
        { id: 4, title: "Receive job offer", completed: false },
      ]
    },
  ]);

  const stats = [
    { label: "Active Goals", value: "6", icon: Target, color: "text-teal-300" },
    { label: "Completed", value: "12", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Total Progress", value: "67%", icon: TrendingUp, color: "text-violet-400" },
    { label: "On Track", value: "5/6", icon: Flag, color: "text-amber-400" },
  ];

  const getCategoryColor = (category: string) => {
    if (isDark) {
      switch (category) {
        case "technical": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
        case "behavioral": return "bg-violet-500/20 text-violet-300 border-violet-500/30";
        case "performance": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        case "career": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      }
    } else {
      switch (category) {
        case "technical": return "bg-purple-100 text-purple-700 border-purple-300 font-medium";
        case "behavioral": return "bg-pink-100 text-pink-700 border-pink-300 font-medium";
        case "performance": return "bg-green-100 text-green-700 border-green-300 font-medium";
        case "career": return "bg-orange-100 text-orange-700 border-orange-300 font-medium";
        default: return "bg-gray-100 text-gray-700 border-gray-300 font-medium";
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    if (isDark) {
      switch (priority) {
        case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
        case "medium": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
        case "low": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      }
    } else {
      switch (priority) {
        case "high": return "bg-red-100 text-red-700 border-red-300 font-semibold";
        case "medium": return "bg-orange-100 text-orange-700 border-orange-300 font-semibold";
        case "low": return "bg-blue-100 text-blue-700 border-blue-300 font-semibold";
        default: return "bg-gray-100 text-gray-700 border-gray-300 font-semibold";
      }
    }
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Goals & Targets 🎯</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Set and track your career development goals</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 ${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white transition-colors`}>
                <Plus size={16} />
                Create Goal
              </button>
            </DialogTrigger>
            <DialogContent className={`${isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"} max-w-md`}>
              <DialogHeader>
                <DialogTitle className={isDark ? "text-white" : "text-[#2e1065]"}>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="goal-title" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Complete 50 Technical Interviews"
                    className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>
                <div>
                  <Label htmlFor="category" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Category</Label>
                  <Select>
                    <SelectTrigger className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="technical" className={isDark ? "text-white" : "text-[#2e1065]"}>Technical</SelectItem>
                      <SelectItem value="behavioral" className={isDark ? "text-white" : "text-[#2e1065]"}>Behavioral</SelectItem>
                      <SelectItem value="performance" className={isDark ? "text-white" : "text-[#2e1065]"}>Performance</SelectItem>
                      <SelectItem value="career" className={isDark ? "text-white" : "text-[#2e1065]"}>Career</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Target</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="50"
                      className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Priority</Label>
                  <Select>
                    <SelectTrigger className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                      <SelectItem value="high" className={isDark ? "text-white" : "text-[#2e1065]"}>High</SelectItem>
                      <SelectItem value="medium" className={isDark ? "text-white" : "text-[#2e1065]"}>Medium</SelectItem>
                      <SelectItem value="low" className={isDark ? "text-white" : "text-[#2e1065]"}>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal..."
                    className={`mt-1 min-h-[80px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 ${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white transition-colors`}>
                    Create Goal
                  </button>
                  <button
                    className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 ${isDark ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.3)] text-white hover:bg-[rgba(255,255,255,0.1)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"} transition-colors`}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={isDark ? stat.color : "text-purple-600"} size={24} />
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Goals List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className={`${isDark ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)]" : "bg-white border-2 border-[#ddd6fe] shadow-sm"} mb-6`}>
          <TabsTrigger value="active" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            Active Goals ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            Completed ({completedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="all" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            All Goals ({goals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeGoals.map((goal) => (
            <div
              key={goal.id}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{goal.title}</h3>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-3`}>{goal.description}</p>
                  <div className={`flex items-center gap-4 text-sm ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}`}>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className={isDark ? "text-teal-300" : "text-purple-600"} />
                      <span>Due: {goal.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} className={isDark ? "text-teal-300" : "text-purple-600"} />
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`inline-flex items-center justify-center h-8 w-8 p-0 rounded-md ${isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]" : "text-purple-600 hover:bg-purple-100"} transition-colors`}>
                    <Edit size={14} />
                  </button>
                  <button className={`inline-flex items-center justify-center h-8 w-8 p-0 rounded-md ${isDark ? "text-red-400 hover:bg-[rgba(220,38,38,0.1)]" : "text-red-600 hover:bg-red-100"} transition-colors`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>Overall Progress</span>
                  <span className={`${isDark ? "text-teal-300" : "text-purple-600"} font-semibold`}>{goal.progress}%</span>
                </div>
                <div className={`h-3 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${isDark ? "bg-gradient-to-r from-teal-300 to-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} transition-all duration-500`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-3 font-semibold`}>Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      {milestone.completed ? (
                        <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={18} />
                      ) : (
                        <Circle className={isDark ? "text-[#6a7282]" : "text-purple-300"} size={18} />
                      )}
                      <span className={`text-sm font-medium ${milestone.completed ? (isDark ? 'text-emerald-400' : 'text-green-600') : (isDark ? 'text-[#99a1af]' : 'text-[#6b21a8]')}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="text-center py-12">
            <Award className={isDark ? "text-[#6a7282]" : "text-purple-300"} size={64} />
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>No completed goals yet</h3>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Keep working on your active goals to see them here</p>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{goal.title}</h3>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-3`}>{goal.description}</p>
                  <div className={`flex items-center gap-4 text-sm ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}`}>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className={isDark ? "text-teal-300" : "text-purple-600"} />
                      <span>Due: {goal.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} className={isDark ? "text-teal-300" : "text-purple-600"} />
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`inline-flex items-center justify-center h-8 w-8 p-0 rounded-md ${isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]" : "text-purple-600 hover:bg-purple-100"} transition-colors`}>
                    <Edit size={14} />
                  </button>
                  <button className={`inline-flex items-center justify-center h-8 w-8 p-0 rounded-md ${isDark ? "text-red-400 hover:bg-[rgba(220,38,38,0.1)]" : "text-red-600 hover:bg-red-100"} transition-colors`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>Overall Progress</span>
                  <span className={`${isDark ? "text-teal-300" : "text-purple-600"} font-semibold`}>{goal.progress}%</span>
                </div>
                <div className={`h-3 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${isDark ? "bg-gradient-to-r from-teal-300 to-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} transition-all duration-500`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-3 font-semibold`}>Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      {milestone.completed ? (
                        <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={18} />
                      ) : (
                        <Circle className={isDark ? "text-[#6a7282]" : "text-purple-300"} size={18} />
                      )}
                      <span className={`text-sm font-medium ${milestone.completed ? (isDark ? 'text-emerald-400' : 'text-green-600') : (isDark ? 'text-[#99a1af]' : 'text-[#6b21a8]')}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

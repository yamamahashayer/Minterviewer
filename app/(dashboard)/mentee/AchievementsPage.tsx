'use client';
import { 
  Trophy,
  Award,
  Star,
  Zap,
  Target,
  TrendingUp,
  Crown,
  Medal,
  Flame,
  CheckCircle2,
  Lock,
  Calendar
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export default function AchievementsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const stats = [
    { label: "Total Achievements", value: "24", icon: Trophy, color: "text-amber-400" },
    { label: "Points Earned", value: "3,240", icon: Star, color: "text-teal-300" },
    { label: "Current Streak", value: "15 days", icon: Flame, color: "text-orange-400" },
    { label: "Rank", value: "Top 10%", icon: Crown, color: "text-violet-400" },
  ];

  const achievements = [
    {
      id: 1,
      title: "Interview Master",
      description: "Complete 50+ AI interviews",
      icon: Trophy,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/10",
      progress: 100,
      current: 52,
      target: 50,
      points: 500,
      unlocked: true,
      unlockedDate: "Oct 5, 2025"
    },
    {
      id: 2,
      title: "Top Performer",
      description: "Achieve top 10% ranking",
      icon: Award,
      color: "text-teal-400",
      bgGradient: "from-teal-500/20 to-emerald-500/10",
      progress: 100,
      current: 100,
      target: 100,
      points: 300,
      unlocked: true,
      unlockedDate: "Oct 8, 2025"
    },
    {
      id: 3,
      title: "Streak Champion",
      description: "Maintain 15-day practice streak",
      icon: Flame,
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/10",
      progress: 100,
      current: 15,
      target: 15,
      points: 200,
      unlocked: true,
      unlockedDate: "Oct 10, 2025"
    },
    {
      id: 4,
      title: "Quick Learner",
      description: "Improve score by 40%",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-teal-500/10",
      progress: 100,
      current: 45,
      target: 40,
      points: 250,
      unlocked: true,
      unlockedDate: "Oct 3, 2025"
    },
    {
      id: 5,
      title: "Perfect Score",
      description: "Achieve 10/10 in any interview",
      icon: Star,
      color: "text-violet-400",
      bgGradient: "from-violet-500/20 to-purple-500/10",
      progress: 80,
      current: 8,
      target: 10,
      points: 400,
      unlocked: false
    },
    {
      id: 6,
      title: "Marathon Runner",
      description: "Complete 30-day streak",
      icon: Target,
      color: "text-rose-400",
      bgGradient: "from-rose-500/20 to-pink-500/10",
      progress: 50,
      current: 15,
      target: 30,
      points: 600,
      unlocked: false
    },
    {
      id: 7,
      title: "Technical Wizard",
      description: "Score 9+ in 20 technical interviews",
      icon: Zap,
      color: "text-cyan-400",
      bgGradient: "from-cyan-500/20 to-blue-500/10",
      progress: 65,
      current: 13,
      target: 20,
      points: 350,
      unlocked: false
    },
    {
      id: 8,
      title: "System Designer",
      description: "Complete 15 system design sessions",
      icon: Medal,
      color: "text-indigo-400",
      bgGradient: "from-indigo-500/20 to-violet-500/10",
      progress: 40,
      current: 6,
      target: 15,
      points: 300,
      unlocked: false
    },
    {
      id: 9,
      title: "Century Club",
      description: "Complete 100 interviews",
      icon: Crown,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 to-amber-500/10",
      progress: 27,
      current: 27,
      target: 100,
      points: 1000,
      unlocked: false
    },
  ];

  const milestones = [
    { id: 1, title: "First Interview", date: "Aug 15, 2025", completed: true },
    { id: 2, title: "10 Interviews", date: "Aug 22, 2025", completed: true },
    { id: 3, title: "50 Interviews", date: "Sep 18, 2025", completed: true },
    { id: 4, title: "100 Interviews", date: "Not yet", completed: false },
    { id: 5, title: "500 Hours Practice", date: "Not yet", completed: false },
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Johnson", points: 5420, avatar: "A" },
    { rank: 2, name: "Sarah Chen", points: 4890, avatar: "S" },
    { rank: 3, name: "Mike Wilson", points: 4125, avatar: "M" },
    { rank: 4, name: "Emma Davis", points: 3850, avatar: "E" },
    { rank: 5, name: "You (Yamamah)", points: 3240, avatar: "Y", highlight: true },
    { rank: 6, name: "John Smith", points: 3100, avatar: "J" },
    { rank: 7, name: "Lisa Brown", points: 2890, avatar: "L" },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Achievements & Badges 🏆</h1>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Track your milestones and celebrate your progress</p>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Achievements List */}
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className={isDark ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)] mb-6" : "bg-white border-2 border-[#ddd6fe] shadow-sm mb-6"}>
              <TabsTrigger value="all" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
                All ({achievements.length})
              </TabsTrigger>
              <TabsTrigger value="unlocked" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
                Unlocked ({unlockedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="locked" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
                Locked ({lockedAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`${isDark ? `bg-gradient-to-br ${achievement.bgGradient}` : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${!achievement.unlocked && 'opacity-60'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]" : "bg-purple-100"} flex items-center justify-center shrink-0 ${!achievement.unlocked && 'relative'}`}>
                        {achievement.unlocked ? (
                          <Icon className={isDark ? achievement.color : "text-purple-600"} size={32} />
                        ) : (
                          <>
                            <Icon className={`${isDark ? achievement.color : "text-purple-600"} opacity-40`} size={32} />
                            <Lock className={isDark ? "absolute text-white" : "absolute text-gray-600"} size={16} />
                          </>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{achievement.title}</h3>
                            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{achievement.description}</p>
                          </div>
                          <Badge className={isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-orange-100 text-orange-700 border-orange-300 font-semibold"}>
                            {achievement.points} pts
                          </Badge>
                        </div>
                        {achievement.unlocked ? (
                          <div className="flex items-center gap-2 mt-3">
                            <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                            <span className={`${isDark ? "text-emerald-400" : "text-green-600"} text-sm font-medium`}>Unlocked on {achievement.unlockedDate}</span>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>Progress</span>
                              <span className={`${isDark ? "text-teal-300" : "text-purple-600"} text-sm font-semibold`}>{achievement.current} / {achievement.target}</span>
                            </div>
                            <div className={`h-2 ${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-purple-100"} rounded-full overflow-hidden`}>
                              <div 
                                className={`h-full ${isDark ? "bg-gradient-to-r from-teal-300 to-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} transition-all duration-500`}
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="unlocked" className="space-y-4">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`${isDark ? `bg-gradient-to-br ${achievement.bgGradient}` : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]" : "bg-purple-100"} flex items-center justify-center shrink-0`}>
                        <Icon className={isDark ? achievement.color : "text-purple-600"} size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{achievement.title}</h3>
                            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{achievement.description}</p>
                          </div>
                          <Badge className={isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-orange-100 text-orange-700 border-orange-300 font-semibold"}>
                            {achievement.points} pts
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                          <span className={`${isDark ? "text-emerald-400" : "text-green-600"} text-sm font-medium`}>Unlocked on {achievement.unlockedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="locked" className="space-y-4">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`${isDark ? `bg-gradient-to-br ${achievement.bgGradient}` : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm opacity-60`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]" : "bg-purple-100"} flex items-center justify-center shrink-0 relative`}>
                        <Icon className={`${isDark ? achievement.color : "text-purple-600"} opacity-40`} size={32} />
                        <Lock className={isDark ? "absolute text-white" : "absolute text-gray-600"} size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{achievement.title}</h3>
                            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{achievement.description}</p>
                          </div>
                          <Badge className={isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-orange-100 text-orange-700 border-orange-300 font-semibold"}>
                            {achievement.points} pts
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>Progress</span>
                            <span className={`${isDark ? "text-teal-300" : "text-purple-600"} text-sm font-semibold`}>{achievement.current} / {achievement.target}</span>
                          </div>
                          <div className={`h-2 ${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-purple-100"} rounded-full overflow-hidden`}>
                            <div 
                              className={`h-full ${isDark ? "bg-gradient-to-r from-teal-300 to-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"} transition-all duration-500`}
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Milestones */}
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Calendar className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Milestones
            </h3>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {index < milestones.length - 1 && (
                    <div className={`absolute left-[11px] top-6 w-0.5 h-full ${isDark ? "bg-[rgba(94,234,212,0.2)]" : "bg-[#ddd6fe]"}`} />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      milestone.completed 
                        ? (isDark ? 'bg-gradient-to-br from-teal-400 to-emerald-400' : 'bg-gradient-to-br from-purple-500 to-pink-500')
                        : (isDark ? 'bg-[rgba(255,255,255,0.1)] border-2 border-[rgba(94,234,212,0.3)]' : 'bg-white border-2 border-[#ddd6fe]')
                    }`}>
                      {milestone.completed && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm mb-1 font-medium ${milestone.completed ? (isDark ? 'text-white' : 'text-[#2e1065]') : (isDark ? 'text-[#99a1af]' : 'text-[#6b21a8]')}`}>
                        {milestone.title}
                      </h4>
                      <p className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>{milestone.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Crown className={isDark ? "text-amber-400" : "text-orange-500"} size={20} />
              Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.highlight 
                      ? (isDark ? 'bg-gradient-to-r from-[rgba(94,234,212,0.2)] to-[rgba(52,211,153,0.1)] border border-[rgba(94,234,212,0.3)]' : 'bg-gradient-to-r from-purple-100 to-pink-50 border border-[#a855f7]')
                      : (isDark ? 'bg-[rgba(255,255,255,0.03)]' : 'bg-gray-50')
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    user.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                    user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                    user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                    (isDark ? 'bg-gradient-to-br from-teal-400 to-emerald-400' : 'bg-gradient-to-br from-purple-400 to-pink-400')
                  }`}>
                    <span className="text-white text-sm font-semibold">{user.rank}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${user.highlight ? (isDark ? 'text-teal-300' : 'text-purple-700') : (isDark ? 'text-white' : 'text-[#2e1065]')}`}>
                      {user.name}
                    </h4>
                    <p className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>{user.points} pts</p>
                  </div>
                  {user.rank <= 3 && <Trophy className={isDark ? "text-amber-400" : "text-orange-500"} size={16} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
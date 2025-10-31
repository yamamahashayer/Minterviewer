
import { useState } from "react";
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Brain,
  MessageSquare,
  Code,
  Lightbulb,
  Clock,
  Calendar,
  Star,
  BarChart3,
  FileText,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Trophy
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface DetailedInterviewReportPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
  interviewData?: {
    type: string;
    date: string;
    duration: string;
    overallScore: number;
  };
}

export default function DetailedInterviewReportPage({
  theme = "dark",
  onBack,
  interviewData = {
    type: "Technical Interview",
    date: "Oct 18, 2025",
    duration: "45 minutes",
    overallScore: 8.5
  }
}: DetailedInterviewReportPageProps) {
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data - في التطبيق الحقيقي، هذا سيأتي من props أو API
  const skillsData = [
    { skill: "Technical Skills", score: 9.0, maxScore: 10 },
    { skill: "Communication", score: 8.5, maxScore: 10 },
    { skill: "Problem Solving", score: 8.2, maxScore: 10 },
    { skill: "Code Quality", score: 8.8, maxScore: 10 },
    { skill: "Time Management", score: 7.9, maxScore: 10 },
    { skill: "Creativity", score: 8.4, maxScore: 10 }
  ];

  const questionBreakdown = [
    {
      id: 1,
      question: "Implement a function to reverse a linked list",
      yourAnswer: "I implemented an iterative solution with three pointers...",
      status: "correct",
      score: 9.5,
      difficulty: "Medium",
      timeSpent: "8 min",
      feedback: "Excellent implementation! Your solution is both time and space efficient. You explained your approach clearly and handled edge cases well."
    },
    {
      id: 2,
      question: "Design a rate limiter for an API",
      yourAnswer: "I proposed a token bucket algorithm with Redis...",
      status: "correct",
      score: 8.8,
      difficulty: "Hard",
      timeSpent: "12 min",
      feedback: "Good system design approach. You considered scalability and discussed trade-offs. Could improve on explaining the consistency model."
    },
    {
      id: 3,
      question: "Find the kth largest element in an array",
      yourAnswer: "I used a min-heap approach with size k...",
      status: "partial",
      score: 7.5,
      difficulty: "Medium",
      timeSpent: "10 min",
      feedback: "Your approach works but could be optimized. Consider using quickselect algorithm for better average case performance."
    },
    {
      id: 4,
      question: "Explain the difference between cookies and local storage",
      yourAnswer: "Cookies are sent with every HTTP request...",
      status: "correct",
      score: 9.0,
      difficulty: "Easy",
      timeSpent: "5 min",
      feedback: "Perfect answer! You covered all key differences including size limits, expiration, and security considerations."
    },
    {
      id: 5,
      question: "Implement a debounce function in JavaScript",
      yourAnswer: "I created a higher-order function using closures...",
      status: "correct",
      score: 8.5,
      difficulty: "Medium",
      timeSpent: "7 min",
      feedback: "Great implementation! You properly used closures and setTimeout. Bonus points for mentioning real-world use cases."
    }
  ];

  const strengthsAndWeaknesses = {
    strengths: [
      {
        title: "Strong Problem-Solving Skills",
        description: "You consistently broke down complex problems into manageable parts and articulated your thought process clearly.",
        icon: Brain
      },
      {
        title: "Excellent Code Quality",
        description: "Your code is clean, well-structured, and follows best practices. Good variable naming and code organization.",
        icon: Code
      },
      {
        title: "Effective Communication",
        description: "You explained your solutions clearly and asked clarifying questions when needed.",
        icon: MessageSquare
      },
      {
        title: "Time Management",
        description: "You managed your time well across different questions, not spending too long on any single problem.",
        icon: Clock
      }
    ],
    weaknesses: [
      {
        title: "Algorithm Optimization",
        description: "In some cases, you could explore more optimal algorithms. Consider studying advanced data structures.",
        recommendation: "Review quickselect, segment trees, and advanced graph algorithms",
        icon: Target
      },
      {
        title: "Edge Case Handling",
        description: "While you handled most edge cases, some scenarios were missed initially.",
        recommendation: "Practice systematically listing edge cases before coding",
        icon: AlertCircle
      },
      {
        title: "System Design Depth",
        description: "Your system design answers could go deeper into scalability and fault tolerance.",
        recommendation: "Study distributed systems patterns and read case studies",
        icon: Lightbulb
      }
    ]
  };

  const recommendations = [
    {
      title: "Study Advanced Algorithms",
      priority: "High",
      description: "Focus on quickselect, divide and conquer, and dynamic programming patterns.",
      resources: [
        "LeetCode - Top Interview Questions (Medium/Hard)",
        "Introduction to Algorithms (CLRS)",
        "AlgoExpert - Advanced Course"
      ]
    },
    {
      title: "Practice System Design",
      priority: "High",
      description: "Deepen your understanding of distributed systems and scalability.",
      resources: [
        "Designing Data-Intensive Applications",
        "System Design Interview – An Insider's Guide",
        "Gaurav Sen YouTube Channel"
      ]
    },
    {
      title: "Improve Edge Case Coverage",
      priority: "Medium",
      description: "Develop a systematic approach to identifying and handling edge cases.",
      resources: [
        "Create a personal edge case checklist",
        "Practice with timed mock interviews",
        "Review failed test cases systematically"
      ]
    },
    {
      title: "Enhance Communication Skills",
      priority: "Low",
      description: "While good, you can further improve by practicing explaining complex concepts simply.",
      resources: [
        "Teach concepts to non-technical friends",
        "Write technical blog posts",
        "Join Toastmasters or similar groups"
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return isDark ? "text-emerald-400" : "text-green-600";
    if (score >= 7) return isDark ? "text-teal-300" : "text-purple-600";
    if (score >= 5) return isDark ? "text-amber-400" : "text-amber-600";
    return isDark ? "text-red-400" : "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 9) return isDark ? "bg-emerald-500/20" : "bg-green-100";
    if (score >= 7) return isDark ? "bg-teal-500/20" : "bg-purple-100";
    if (score >= 5) return isDark ? "bg-amber-500/20" : "bg-amber-100";
    return isDark ? "bg-red-500/20" : "bg-red-100";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle2 className="text-green-500" size={20} />;
      case "partial":
        return <AlertCircle className="text-amber-500" size={20} />;
      case "incorrect":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Minus className={isDark ? "text-gray-400" : "text-gray-500"} size={20} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-700 border-red-300",
      Medium: isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300",
      Low: isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-300"
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className={`mb-4 ${
              isDark
                ? "text-teal-300 hover:text-teal-200 hover:bg-[rgba(94,234,212,0.1)]"
                : "text-[#7c3aed] hover:text-[#5b21b6] hover:bg-purple-100"
            }`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Interview
          </Button>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                <h1 className={`text-2xl sm:text-3xl ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  Detailed Interview Report
                </h1>
                <Badge className={`${
                  isDark
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                    : "bg-purple-100 text-purple-700 border-purple-300"
                }`}>
                  {interviewData.type}
                </Badge>
              </div>
              <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{interviewData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{interviewData.duration}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 sm:flex-none ${
                  isDark
                    ? "border-[rgba(94,234,212,0.3)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                    : "border-purple-300 text-[#7c3aed] hover:bg-purple-50"
                }`}
              >
                <Share2 size={16} className="mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 sm:flex-none ${
                  isDark
                    ? "border-[rgba(94,234,212,0.3)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                    : "border-purple-300 text-[#7c3aed] hover:bg-purple-50"
                }`}
              >
                <Printer size={16} className="mr-2" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                size="sm"
                className={`flex-1 sm:flex-none ${
                  isDark
                    ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e]"
                    : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white"
                } shadow-lg`}
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className={`p-4 sm:p-6 md:p-8 mb-6 md:mb-8 ${
          isDark
            ? "bg-gradient-to-br from-[rgba(94,234,212,0.15)] to-[rgba(16,185,129,0.1)] border-[rgba(94,234,212,0.3)]"
            : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg"
        }`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${
                isDark
                  ? "bg-gradient-to-br from-teal-400 to-emerald-400"
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              } flex items-center justify-center shadow-2xl ${
                isDark ? "shadow-teal-500/50" : "shadow-purple-500/50"
              }`}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl text-white mb-1">{interviewData.overallScore}</div>
                  <div className="text-sm text-white opacity-90">/10</div>
                </div>
              </div>
              <div className="text-center sm:text-left w-full sm:flex-1">
                <h2 className={`mb-2 text-xl sm:text-2xl ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  Overall Performance
                </h2>
                <p className={`text-base sm:text-lg mb-3 ${isDark ? "text-teal-300" : "text-purple-700"}`}>
                  Excellent! You scored better than 78% of candidates
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <TrendingUp className={isDark ? "text-emerald-400" : "text-green-600"} size={20} />
                  <span className={`text-sm sm:text-base ${isDark ? "text-emerald-400" : "text-green-600"}`}>
                    +0.8 from your average
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div className={`text-center p-4 rounded-xl ${
                isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white shadow-md"
              }`}>
                <Trophy className={`mx-auto mb-2 ${isDark ? "text-amber-400" : "text-amber-600"}`} size={24} />
                <div className={`text-2xl mb-1 ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  5/5
                </div>
                <div className={`text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                  Questions Answered
                </div>
              </div>
              <div className={`text-center p-4 rounded-xl ${
                isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white shadow-md"
              }`}>
                <Zap className={`mx-auto mb-2 ${isDark ? "text-teal-400" : "text-purple-600"}`} size={24} />
                <div className={`text-2xl mb-1 ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  42min
                </div>
                <div className={`text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                  Total Time
                </div>
              </div>
              <div className={`text-center p-4 rounded-xl ${
                isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-white shadow-md"
              }`}>
                <Star className={`mx-auto mb-2 ${isDark ? "text-emerald-400" : "text-green-600"}`} size={24} />
                <div className={`text-2xl mb-1 ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  4/5
                </div>
                <div className={`text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                  Perfect Scores
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className={`${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)]"
                : "bg-white border-2 border-purple-200 shadow-md"
            } p-1 w-full sm:w-auto inline-flex`}>
              <TabsTrigger
                value="overview"
                className={`text-xs sm:text-sm ${
                  activeTab === "overview"
                    ? isDark
                      ? "bg-[rgba(94,234,212,0.2)] text-teal-300"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    : isDark
                      ? "text-[#99a1af]"
                      : "text-[#7c3aed]"
                }`}
              >
                <BarChart3 size={16} className="mr-1 sm:mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className={`text-xs sm:text-sm ${
                  activeTab === "questions"
                    ? isDark
                      ? "bg-[rgba(94,234,212,0.2)] text-teal-300"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    : isDark
                      ? "text-[#99a1af]"
                      : "text-[#7c3aed]"
                }`}
              >
                <FileText size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Questions ({questionBreakdown.length})</span>
                <span className="sm:hidden">Q ({questionBreakdown.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className={`text-xs sm:text-sm ${
                  activeTab === "recommendations"
                    ? isDark
                      ? "bg-[rgba(94,234,212,0.2)] text-teal-300"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    : isDark
                      ? "text-[#99a1af]"
                      : "text-[#7c3aed]"
                }`}
              >
                <Lightbulb size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Recommendations</span>
                <span className="sm:hidden">Rec</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Skills Breakdown */}
            <div className="grid lg:grid-cols-1 gap-6">
              {/* Skills List */}
              <Card className={`p-6 ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]"
                  : "bg-white border-purple-200 shadow-lg"
              }`}>
                <h3 className={`mb-6 ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                  Detailed Breakdown
                </h3>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                          {skill.skill}
                        </span>
                        <span className={`text-sm ${getScoreColor(skill.score)}`}>
                          {skill.score}/10
                        </span>
                      </div>
                      <Progress
                        value={(skill.score / skill.maxScore) * 100}
                        className={`h-2 ${
                          isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-purple-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className={`p-6 ${
                isDark
                  ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg"
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <ThumbsUp className={isDark ? "text-emerald-400" : "text-green-600"} size={24} />
                  <h3 className={isDark ? "text-white" : "text-[#2e1065]"}>
                    Key Strengths
                  </h3>
                </div>
                <div className="space-y-4">
                  {strengthsAndWeaknesses.strengths.map((strength, index) => {
                    const Icon = strength.icon;
                    return (
                      <div key={index} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          isDark ? "bg-emerald-500/20" : "bg-green-100"
                        } flex items-center justify-center flex-shrink-0`}>
                          <Icon className={isDark ? "text-emerald-400" : "text-green-600"} size={18} />
                        </div>
                        <div>
                          <h4 className={`mb-1 text-sm ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                            {strength.title}
                          </h4>
                          <p className={`text-xs ${isDark ? "text-emerald-200" : "text-green-700"}`}>
                            {strength.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Weaknesses */}
              <Card className={`p-6 ${
                isDark
                  ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30"
                  : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg"
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <Target className={isDark ? "text-amber-400" : "text-amber-600"} size={24} />
                  <h3 className={isDark ? "text-white" : "text-[#2e1065]"}>
                    Areas for Improvement
                  </h3>
                </div>
                <div className="space-y-4">
                  {strengthsAndWeaknesses.weaknesses.map((weakness, index) => {
                    const Icon = weakness.icon;
                    return (
                      <div key={index} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          isDark ? "bg-amber-500/20" : "bg-amber-100"
                        } flex items-center justify-center flex-shrink-0`}>
                          <Icon className={isDark ? "text-amber-400" : "text-amber-600"} size={18} />
                        </div>
                        <div>
                          <h4 className={`mb-1 text-sm ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                            {weakness.title}
                          </h4>
                          <p className={`text-xs mb-2 ${isDark ? "text-amber-200" : "text-amber-700"}`}>
                            {weakness.description}
                          </p>
                          <p className={`text-xs italic ${isDark ? "text-amber-300" : "text-amber-800"}`}>
                            💡 {weakness.recommendation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            {questionBreakdown.map((question, index) => (
              <Card key={question.id} className={`p-4 sm:p-6 ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]"
                  : "bg-white border-purple-200 shadow-lg"
              }`}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                    <div className={`w-10 h-10 rounded-lg ${
                      isDark
                        ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30"
                        : "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300"
                    } flex items-center justify-center flex-shrink-0`}>
                      <span className={isDark ? "text-teal-300" : "text-purple-700"}>
                        Q{question.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm sm:text-base`}>
                          {question.question}
                        </h4>
                        <div className="flex-shrink-0">
                          {getStatusIcon(question.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                        <Badge variant="outline" className={`text-xs ${
                          isDark ? "border-[rgba(94,234,212,0.3)] text-teal-300" : "border-purple-300 text-purple-700"
                        }`}>
                          {question.difficulty}
                        </Badge>
                        <span className={`text-xs ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                          ⏱️ {question.timeSpent}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-center px-3 sm:px-4 py-2 rounded-lg ${getScoreBgColor(question.score)} flex-shrink-0`}>
                    <div className={`text-lg sm:text-xl ${getScoreColor(question.score)}`}>
                      {question.score}
                    </div>
                    <div className={`text-xs ${getScoreColor(question.score)}`}>/10</div>
                  </div>
                </div>

                <Separator className={`my-4 ${isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-purple-200"}`} />

                <div className="space-y-3">
                  <div>
                    <h5 className={`text-sm mb-2 ${isDark ? "text-teal-300" : "text-purple-700"}`}>
                      Your Answer:
                    </h5>
                    <p className={`text-xs sm:text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"}`}>
                      {question.yourAnswer}
                    </p>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${
                    isDark
                      ? "bg-[rgba(94,234,212,0.1)] border border-[rgba(94,234,212,0.2)]"
                      : "bg-purple-50 border-2 border-purple-200"
                  }`}>
                    <div className="flex items-start gap-2">
                      <Sparkles className={isDark ? "text-teal-400" : "text-purple-600"} size={16} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className={`text-sm mb-1 ${isDark ? "text-teal-300" : "text-purple-700"}`}>
                          AI Feedback:
                        </h5>
                        <p className={`text-xs sm:text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"}`}>
                          {question.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card className={`p-6 mb-6 ${
              isDark
                ? "bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/30"
                : "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${
                  isDark
                    ? "bg-gradient-to-br from-violet-400 to-purple-400"
                    : "bg-gradient-to-br from-purple-500 to-violet-500"
                } flex items-center justify-center flex-shrink-0`}>
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className={`mb-2 ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                    Personalized Learning Path
                  </h3>
                  <p className={`${isDark ? "text-violet-200" : "text-purple-700"}`}>
                    Based on your performance, we've created a customized improvement plan. Follow these recommendations to level up your skills and ace your next interview!
                  </p>
                </div>
              </div>
            </Card>

            {recommendations.map((rec, index) => (
              <Card key={index} className={`p-6 ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]"
                  : "bg-white border-purple-200 shadow-lg"
              }`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className={isDark ? "text-white" : "text-[#2e1065]"}>
                    {rec.title}
                  </h4>
                  <Badge className={`${getPriorityBadge(rec.priority)} border`}>
                    {rec.priority} Priority
                  </Badge>
                </div>
                <p className={`text-sm mb-4 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"}`}>
                  {rec.description}
                </p>
                <div>
                  <h5 className={`text-sm mb-2 ${isDark ? "text-teal-300" : "text-purple-700"}`}>
                    Recommended Resources:
                  </h5>
                  <ul className="space-y-2">
                    {rec.resources.map((resource, rIndex) => (
                      <li key={rIndex} className="flex items-start gap-2">
                        <CheckCircle2
                          className={isDark ? "text-teal-400" : "text-purple-600"}
                          size={16}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <span className={`text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                          {resource}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <Card className={`p-4 sm:p-6 mt-6 sm:mt-8 ${
          isDark
            ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]"
            : "bg-white border-purple-200 shadow-lg"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h4 className={`mb-1 text-base sm:text-lg ${isDark ? "text-white" : "text-[#2e1065]"}`}>
                Ready for more practice?
              </h4>
              <p className={`text-xs sm:text-sm ${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"}`}>
                Continue improving with our AI-powered interview practice
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className={`${
                  isDark
                    ? "border-[rgba(94,234,212,0.3)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                    : "border-purple-300 text-[#7c3aed] hover:bg-purple-50"
                }`}
              >
                <span className="text-xs sm:text-sm">Schedule Mentor Session</span>
              </Button>
              <Button
                size="sm"
                className={`${
                  isDark
                    ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e]"
                    : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white"
                } shadow-lg`}
              >
                <span className="text-xs sm:text-sm">Start New Practice</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
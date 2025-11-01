import { useState, useEffect } from "react";
import { 
  Play,
  Pause,
  SkipForward,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Zap,
  RotateCcw,
  Send,
  Brain,
  Code,
  Users,
  Layers,
  Headphones,
  Volume2,
  VolumeX,
  Keyboard,
  Camera,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Textarea } from "../../components/ui/textarea";
import DetailedInterviewReportPage from "./DetailedInterviewReportPage";

export default function InterviewPracticePage({ theme = "dark", onNavigate }: { theme?: "dark" | "light"; onNavigate?: (page: string) => void }) {
  const isDark = theme === "dark";
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<"voice" | "text" | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [response, setResponse] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  const interviewTypes = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Coding problems, algorithms, and data structures",
      icon: Code,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      borderColor: "border-teal-500/30",
      duration: "45-60 min",
      difficulty: "Medium to Hard",
      questions: 5
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "STAR method, soft skills, and situational questions",
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30",
      duration: "30-45 min",
      difficulty: "Medium",
      questions: 8
    },
    {
      id: "system-design",
      title: "System Design Interview",
      description: "Architecture, scalability, and distributed systems",
      icon: Layers,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      duration: "60 min",
      difficulty: "Hard",
      questions: 3
    },
    {
      id: "ai-chat",
      title: "AI Chat Interview",
      description: "Conversational AI interview for general assessment",
      icon: Brain,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      duration: "20-30 min",
      difficulty: "Easy to Medium",
      questions: 10
    }
  ];

  const sampleQuestions = {
    technical: [
      "Explain how you would implement a LRU cache with O(1) operations.",
      "What's the difference between a binary tree and a binary search tree?",
      "How would you reverse a linked list? Can you write the code?",
      "Explain the concept of time complexity. What is Big O notation?",
      "Describe how you would detect a cycle in a linked list."
    ],
    behavioral: [
      "Tell me about a time when you had to deal with a difficult team member.",
      "Describe a situation where you had to meet a tight deadline.",
      "How do you handle constructive criticism?",
      "Tell me about a project you're most proud of and why.",
      "Describe a time when you failed and what you learned from it.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Tell me about a time you showed leadership.",
      "Describe a situation where you had to learn a new technology quickly."
    ],
    "system-design": [
      "Design a URL shortening service like bit.ly",
      "How would you design Instagram's backend?",
      "Design a distributed cache system with high availability."
    ],
    "ai-chat": [
      "What interests you most about this role?",
      "Describe your ideal work environment.",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
      "Tell me about yourself.",
      "What motivates you in your work?",
      "How do you handle stress and pressure?",
      "What's your approach to problem-solving?",
      "Why are you leaving your current position?"
    ]
  };

  const performanceScore = {
    overall: 8.5,
    technical: 8.8,
    communication: 8.2,
    problemSolving: 8.6,
    confidence: 8.4
  };

  const selectInterviewType = (type: string) => {
    setSelectedType(type);
  };

  const selectMode = (mode: "voice" | "text") => {
    setSelectedMode(mode);
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setInterviewComplete(false);
    
    // Auto-enable mic for voice mode
    if (mode === "voice") {
      setMicEnabled(true);
    }
  };

  const nextQuestion = () => {
    const questions = sampleQuestions[selectedType as keyof typeof sampleQuestions] || [];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setResponse("");
      // Simulate AI speaking the next question
      if (selectedMode === "voice") {
        simulateAISpeaking();
      }
    } else {
      setInterviewComplete(true);
    }
  };

  const simulateAISpeaking = () => {
    setIsAISpeaking(true);
    setTimeout(() => {
      setIsAISpeaking(false);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const restartInterview = () => {
    setSelectedType(null);
    setSelectedMode(null);
    setInterviewStarted(false);
    setCurrentQuestion(0);
    setResponse("");
    setInterviewComplete(false);
    setMicEnabled(false);
    setVideoEnabled(false);
    setShowDetailedReport(false);
  };

  const backToModeSelection = () => {
    setSelectedMode(null);
    setInterviewStarted(false);
    setCurrentQuestion(0);
    setResponse("");
  };

  // Simulate AI speaking when question changes in voice mode
  useEffect(() => {
    if (interviewStarted && selectedMode === "voice") {
      simulateAISpeaking();
    }
  }, [currentQuestion]);

  // Show detailed report if requested
  if (showDetailedReport) {
    return (
      <DetailedInterviewReportPage
        theme={theme}
        onBack={() => setShowDetailedReport(false)}
        interviewData={{
          type: interviewTypes.find(t => t.id === selectedType)?.title || "Technical Interview",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          duration: "45 minutes",
          overallScore: 8.5
        }}
      />
    );
  }

  if (interviewComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-[#0a0f1e] to-[#000000]">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-400" size={48} />
            </div>
            <h1 className="text-white mb-2">Interview Complete! 🎉</h1>
            <p className="text-[#99a1af]">Great job! Here's your performance summary</p>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] rounded-xl p-8 backdrop-blur-sm mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl text-teal-300 mb-2">{performanceScore.overall}</div>
              <p className="text-[#99a1af]">Overall Score</p>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mt-2">
                {selectedMode === "voice" ? "Voice Interview" : "Text Interview"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d1d5dc] text-sm">Technical Skills</span>
                  <span className="text-teal-300 text-sm">{performanceScore.technical}/10</span>
                </div>
                <Progress value={performanceScore.technical * 10} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d1d5dc] text-sm">Communication</span>
                  <span className="text-teal-300 text-sm">{performanceScore.communication}/10</span>
                </div>
                <Progress value={performanceScore.communication * 10} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d1d5dc] text-sm">Problem Solving</span>
                  <span className="text-teal-300 text-sm">{performanceScore.problemSolving}/10</span>
                </div>
                <Progress value={performanceScore.problemSolving * 10} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#d1d5dc] text-sm">Confidence</span>
                  <span className="text-teal-300 text-sm">{performanceScore.confidence}/10</span>
                </div>
                <Progress value={performanceScore.confidence * 10} />
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] rounded-xl p-6 backdrop-blur-sm mb-6">
            <h3 className="text-white mb-4">AI Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white text-sm mb-1">Strong Technical Knowledge</h4>
                  <p className="text-[#99a1af] text-sm">Your explanations were clear and demonstrated solid understanding of fundamental concepts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Zap className="text-blue-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white text-sm mb-1">Improvement Opportunity</h4>
                  <p className="text-[#99a1af] text-sm">Consider adding more real-world examples when explaining complex concepts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Award className="text-emerald-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white text-sm mb-1">Excellent Communication</h4>
                  <p className="text-[#99a1af] text-sm">You structured your answers well and communicated your thought process effectively.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={restartInterview}
              className={`flex-1 ${
                isDark
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20"
                  : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white shadow-lg shadow-purple-500/20"
              }`}
            >
              <RotateCcw size={16} className="mr-2" />
              Start New Interview
            </Button>
            <Button 
              onClick={() => setShowDetailedReport(true)}
              className={`flex-1 ${
                isDark
                  ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]"
                  : "bg-white border-2 border-purple-300 text-[#7c3aed] hover:bg-purple-50 shadow-lg"
              }`}
            >
              View Detailed Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mode Selection Screen
  if (selectedType && !selectedMode) {
    const currentType = interviewTypes.find(t => t.id === selectedType);
    const Icon = currentType?.icon || Brain;

    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100"}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2`}>Choose Interview Mode 🎙️</h1>
              <p className={isDark ? "text-[#99a1af]" : "text-[#5b21b6]"}>Select how you'd like to practice your {currentType?.title}</p>
            </div>
            <Button
              onClick={() => setSelectedType(null)}
              className={isDark 
                ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]"
                : "bg-white border-2 border-[#7c3aed] text-[#5b21b6] hover:bg-purple-50 hover:border-[#6d28d9] shadow-lg hover:shadow-xl hover:shadow-purple-200/50 font-semibold"
              }
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Types
            </Button>
          </div>
          <div className={`h-1 w-[200px] rounded-full ${
            isDark 
              ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]"
              : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] shadow-lg shadow-purple-400/60"
          }`} />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Selected Interview Info */}
          <div className={`rounded-xl p-6 mb-8 ${
            isDark
              ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
              : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${currentType?.bgColor} border ${currentType?.borderColor} flex items-center justify-center`}>
                <Icon className={currentType?.color} size={32} />
              </div>
              <div>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1`}>{currentType?.title}</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>{currentType?.description}</p>
              </div>
            </div>
          </div>

          {/* Mode Options */}
          <div className="grid grid-cols-2 gap-8">
            {/* Voice & Camera Mode */}
            <div className={`rounded-xl p-8 transition-all group ${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-2 border-[rgba(94,234,212,0.3)] backdrop-blur-sm hover:border-[rgba(94,234,212,0.5)] hover:shadow-xl hover:shadow-teal-500/20"
                : "bg-white border-2 border-[#c4b5fd] hover:border-[#7c3aed] shadow-2xl hover:shadow-purple-300/60 shadow-purple-200/50"
            }`}>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30"
                  : "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-[#a78bfa] shadow-md"
              }`}>
                <Video className={isDark ? "text-teal-300" : "text-[#7c3aed]"} size={40} />
              </div>
              <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-center mb-3`}>Voice & Camera Mode</h2>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-center mb-6`}>
                Interactive experience with AI avatar asking questions via voice. Use your microphone and camera for a realistic interview.
              </p>
              <div className="space-y-2 mb-6">
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>
                  <CheckCircle2 className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                  <span>AI avatar interviewer</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>
                  <CheckCircle2 className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                  <span>Voice-based questions</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>
                  <CheckCircle2 className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                  <span>Microphone & camera support</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>
                  <CheckCircle2 className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                  <span>Real-time feedback</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>
                  <CheckCircle2 className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                  <span>Most realistic experience</span>
                </div>
              </div>
              <Button
                onClick={() => selectMode("voice")}
                className={`w-full shadow-lg ${
                  isDark
                    ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-teal-500/20"
                    : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white shadow-purple-400/50 font-semibold"
                }`}
              >
                <Headphones size={16} className="mr-2" />
                Start Voice Interview
              </Button>
              <Badge className={`w-full justify-center mt-3 ${
                isDark
                  ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                  : "bg-purple-100 text-[#5b21b6] border-[#a78bfa] font-semibold"
              }`}>
                Recommended
              </Badge>
            </div>

            {/* Text Mode */}
            <div className={`rounded-xl p-8 transition-all group ${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-2 border-[rgba(94,234,212,0.3)] backdrop-blur-sm hover:border-[rgba(94,234,212,0.5)] hover:shadow-xl hover:shadow-violet-500/20"
                : "bg-white border-2 border-[#fbcfe8] hover:border-[#ec4899] shadow-2xl hover:shadow-pink-300/60 shadow-pink-200/50"
            }`}>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform ${
                isDark
                  ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                  : "bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-[#f9a8d4] shadow-md"
              }`}>
                <Keyboard className={isDark ? "text-violet-300" : "text-[#ec4899]"} size={40} />
              </div>
              <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-center mb-3`}>Text Mode</h2>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-center mb-6`}>
                Traditional text-based interview. Read questions and type your responses at your own pace.
              </p>
              <div className="space-y-2 mb-6">
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#831843]"}`}>
                  <CheckCircle2 className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                  <span>Text-based questions</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#831843]"}`}>
                  <CheckCircle2 className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                  <span>Type your responses</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#831843]"}`}>
                  <CheckCircle2 className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                  <span>No camera/mic required</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#831843]"}`}>
                  <CheckCircle2 className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                  <span>Answer at your pace</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#831843]"}`}>
                  <CheckCircle2 className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                  <span>Perfect for preparation</span>
                </div>
              </div>
              <Button
                onClick={() => selectMode("text")}
                className={`w-full shadow-lg ${
                  isDark
                    ? "bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500 text-white shadow-violet-500/20"
                    : "bg-gradient-to-r from-[#ec4899] to-[#a855f7] hover:from-[#db2777] hover:to-[#9333ea] text-white shadow-pink-400/50 font-semibold"
                }`}
              >
                <MessageSquare size={16} className="mr-2" />
                Start Text Interview
              </Button>
              <Badge className={`w-full justify-center mt-3 ${
                isDark
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                  : "bg-pink-100 text-[#831843] border-[#f9a8d4] font-semibold"
              }`}>
                Beginner Friendly
              </Badge>
            </div>
          </div>

          {/* Info Banner */}
          <div className={`mt-8 rounded-xl p-6 ${
            isDark
              ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
              : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
          }`}>
            <div className="flex items-start gap-4">
              <Sparkles className={isDark ? "text-amber-400" : "text-[#7c3aed]"} size={24} />
              <div>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2`}>Choose What Works Best for You</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>
                  Voice & Camera mode provides the most realistic interview simulation and helps improve your verbal communication skills. 
                  Text mode is great for practicing your answers and thinking through responses without time pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interviewStarted && selectedType && selectedMode) {
    const questions = sampleQuestions[selectedType as keyof typeof sampleQuestions] || [];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    // Voice & Camera Mode Interface
    if (selectedMode === "voice") {
      return (
        <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100"}`}>
          <div className="max-w-5xl mx-auto">
            {/* Header with Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1`}>
                    {interviewTypes.find(t => t.id === selectedType)?.title} - Voice Mode
                  </h2>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <Button 
                  onClick={restartInterview}
                  className={isDark 
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-2 border-red-400/50"
                    : "bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-300 hover:border-red-500 shadow-md font-semibold"
                  }
                >
                  Exit Interview
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Main Interview Area */}
              <div className="col-span-2 space-y-6">
                {/* AI Avatar Display */}
                <div className={`rounded-xl overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <div className={`relative h-96 flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10"
                      : "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100"
                  }`}>
                    {/* AI Avatar Animation */}
                    <div className="relative">
                      <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDark
                          ? `bg-gradient-to-br from-teal-400/30 to-emerald-400/30 border-4 border-teal-400/50 ${isAISpeaking ? "scale-110 shadow-[0_0_50px_rgba(94,234,212,0.5)]" : "scale-100"}`
                          : `bg-gradient-to-br from-purple-200 to-pink-200 border-4 border-[#a78bfa] ${isAISpeaking ? "scale-110 shadow-[0_0_50px_rgba(124,58,237,0.5)]" : "scale-100"}`
                      }`}>
                        <User className={isDark ? "text-teal-200" : "text-[#7c3aed]"} size={80} />
                      </div>
                      {/* Pulsing rings when AI is speaking */}
                      {isAISpeaking && (
                        <>
                          <div className={`absolute inset-0 rounded-full border-2 animate-ping ${isDark ? "border-teal-400/30" : "border-purple-500/30"}`} />
                          <div className={`absolute inset-0 rounded-full border-2 animate-pulse ${isDark ? "border-emerald-400/30" : "border-pink-500/30"}`} />
                        </>
                      )}
                    </div>
                    
                    {/* AI Status */}
                    <div className="absolute top-6 left-6">
                      <Badge className={`${
                        isDark
                          ? isAISpeaking 
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                            : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                          : isAISpeaking
                            ? "bg-emerald-100 text-emerald-700 border-emerald-400 font-semibold"
                            : "bg-purple-100 text-purple-700 border-[#a78bfa] font-semibold"
                      }`}>
                        {isAISpeaking ? (
                          <>
                            <Volume2 size={12} className="mr-1 animate-pulse" />
                            AI Speaking...
                          </>
                        ) : (
                          <>
                            <Headphones size={12} className="mr-1" />
                            Listening...
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Recording Indicator */}
                    {isRecording && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <Badge className={isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-700 border-red-400 font-semibold"}>
                          <div className="w-2 h-2 rounded-full bg-red-400 mr-2 animate-pulse" />
                          Recording your answer...
                        </Badge>
                      </div>
                    )}

                    {/* AI Name Tag */}
                    <div className="absolute bottom-6 left-6">
                      <div className={`rounded-lg px-4 py-2 ${
                        isDark
                          ? "bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-teal-500/30"
                          : "bg-white border-2 border-[#a78bfa] shadow-lg"
                      }`}>
                        <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm`}>AI Interviewer</h3>
                        <p className={`${isDark ? "text-teal-300" : "text-[#7c3aed]"} text-xs`}>Senior Technical Recruiter</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className={`p-4 flex items-center justify-center gap-4 ${isDark ? "border-t border-[rgba(94,234,212,0.1)]" : "border-t-2 border-purple-100"}`}>
                    <button
                      onClick={() => setMicEnabled(!micEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isDark
                          ? micEnabled
                            ? "bg-teal-500/20 border-2 border-teal-500/50 text-teal-300"
                            : "bg-red-500/20 border-2 border-red-500/50 text-red-300"
                          : micEnabled
                            ? "bg-purple-100 border-2 border-[#a78bfa] text-[#7c3aed]"
                            : "bg-red-100 border-2 border-red-400 text-red-600"
                      }`}
                    >
                      {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button
                      onClick={() => setVideoEnabled(!videoEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isDark
                          ? videoEnabled
                            ? "bg-teal-500/20 border-2 border-teal-500/50 text-teal-300"
                            : "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)] text-[#99a1af]"
                          : videoEnabled
                            ? "bg-purple-100 border-2 border-[#a78bfa] text-[#7c3aed]"
                            : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                      }`}
                    >
                      {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isDark
                          ? soundEnabled
                            ? "bg-teal-500/20 border-2 border-teal-500/50 text-teal-300"
                            : "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)] text-[#99a1af]"
                          : soundEnabled
                            ? "bg-purple-100 border-2 border-[#a78bfa] text-[#7c3aed]"
                            : "bg-gray-100 border-2 border-gray-300 text-gray-500"
                      }`}
                    >
                      {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                  </div>
                </div>

                {/* Question Card */}
                <div className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <MessageSquare className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={24} />
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2`}>Question {currentQuestion + 1}</h4>
                      <p className={`${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"} text-lg leading-relaxed`}>
                        {questions[currentQuestion]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Voice Response Area */}
                <div className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 flex items-center gap-2`}>
                    <Mic className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={20} />
                    Your Voice Response
                  </h4>
                  
                  <div className="text-center py-12">
                    <button
                      onClick={toggleRecording}
                      className={`w-24 h-24 rounded-full mb-4 transition-all mx-auto flex items-center justify-center ${
                        isDark
                          ? isRecording
                            ? "bg-red-500/20 border-4 border-red-500/50 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                            : "bg-teal-500/20 border-4 border-teal-500/50 hover:scale-105"
                          : isRecording
                            ? "bg-red-100 border-4 border-red-400 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                            : "bg-purple-100 border-4 border-[#a78bfa] hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      <Mic className={isDark ? (isRecording ? "text-red-300" : "text-teal-300") : (isRecording ? "text-red-600" : "text-[#7c3aed]")} size={40} />
                    </button>
                    <p className={`${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"} mb-2`}>
                      {isRecording ? "Recording... Click to stop" : "Click to start recording your answer"}
                    </p>
                    <p className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-sm`}>
                      Or type your answer below if you prefer
                    </p>
                  </div>

                  <Textarea
                    placeholder="Type your answer here as backup..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className={isDark 
                      ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white min-h-[100px] mb-4"
                      : "bg-purple-50 border-2 border-[#c4b5fd] text-[#2e1065] placeholder:text-purple-400 min-h-[100px] mb-4"
                    }
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={nextQuestion}
                      className={`flex-1 shadow-lg ${
                        isDark
                          ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-teal-500/20"
                          : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white shadow-purple-400/50 font-semibold"
                      }`}
                    >
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          <SkipForward size={16} className="mr-2" />
                          Next Question
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} className="mr-2" />
                          Complete Interview
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Timer */}
                <div className={`rounded-xl p-6 text-center ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <Clock className={`${isDark ? "text-teal-400" : "text-[#7c3aed]"} mx-auto mb-3`} size={32} />
                  <div className={`text-3xl ${isDark ? "text-white" : "text-[#2e1065]"} mb-1`}>23:45</div>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>Time Elapsed</p>
                </div>

                {/* Tips for Voice Interview */}
                <div className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 flex items-center gap-2`}>
                    <Zap className={isDark ? "text-amber-400" : "text-amber-500"} size={20} />
                    Voice Interview Tips
                  </h4>
                  <ul className={`space-y-2 text-sm ${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"}`}>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                      <span>Speak clearly and at a steady pace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                      <span>Make eye contact with camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                      <span>Take a breath before answering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                      <span>Use natural gestures</span>
                    </li>
                  </ul>
                </div>

                {/* Progress */}
                <div className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                    : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
                }`}>
                  <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4`}>Questions Progress</h4>
                  <div className="space-y-2">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded ${
                          isDark
                            ? idx < currentQuestion
                              ? "bg-emerald-500/10"
                              : idx === currentQuestion
                              ? "bg-teal-500/20 border border-teal-500/30"
                              : "bg-[rgba(255,255,255,0.03)]"
                            : idx < currentQuestion
                              ? "bg-emerald-100"
                              : idx === currentQuestion
                              ? "bg-purple-100 border-2 border-[#a78bfa]"
                              : "bg-purple-50"
                        }`}
                      >
                        {idx < currentQuestion ? (
                          <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={16} />
                        ) : idx === currentQuestion ? (
                          <Target className={isDark ? "text-teal-400" : "text-[#7c3aed]"} size={16} />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border ${isDark ? "border-[rgba(94,234,212,0.3)]" : "border-purple-300"}`} />
                        )}
                        <span className={`text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>Question {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Text Mode Interface
    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100"}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header with Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1`}>
                  {interviewTypes.find(t => t.id === selectedType)?.title} - Text Mode
                </h2>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <Button 
                onClick={restartInterview}
                className={isDark 
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-2 border-red-400/50"
                  : "bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-300 hover:border-red-500 shadow-md font-semibold"
                }
              >
                Exit Interview
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Interview Area */}
            <div className="col-span-2 space-y-6">
              {/* Question Card */}
              <div className={`rounded-xl p-8 ${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                  : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
              }`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark
                      ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                      : "bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-[#f9a8d4]"
                  }`}>
                    <MessageSquare className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={isDark ? "text-white" : "text-[#2e1065]"}>Question {currentQuestion + 1}</h3>
                      <Badge className={isDark 
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                        : "bg-pink-100 text-[#831843] border-[#f9a8d4] font-semibold"
                      }>
                        Text Mode
                      </Badge>
                    </div>
                    <p className={`${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"} text-xl leading-relaxed`}>
                      {questions[currentQuestion]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Area */}
              <div className={`rounded-xl p-6 ${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                  : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
              }`}>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4`}>Your Response</h4>
                <Textarea
                  placeholder="Type your detailed answer here... Take your time to think through your response."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className={isDark 
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white min-h-[200px] mb-4"
                    : "bg-purple-50 border-2 border-[#c4b5fd] text-[#2e1065] placeholder:text-purple-400 min-h-[200px] mb-4"
                  }
                />
                <div className="flex items-center justify-between mb-4">
                  <p className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-sm`}>
                    💡 Tip: Structure your answer clearly with examples and specific details
                  </p>
                  <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-sm`}>
                    {response.length} characters
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={nextQuestion}
                    className={`flex-1 shadow-lg ${
                      isDark
                        ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-teal-500/20"
                        : "bg-gradient-to-r from-[#ec4899] to-[#a855f7] hover:from-[#db2777] hover:to-[#9333ea] text-white shadow-pink-400/50 font-semibold"
                    }`}
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        <ArrowRight size={16} className="mr-2" />
                        Next Question
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} className="mr-2" />
                        Complete Interview
                      </>
                    )}
                  </Button>
                  <Button className={isDark 
                    ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]"
                    : "bg-white border-2 border-[#7c3aed] text-[#5b21b6] hover:bg-purple-50 hover:border-[#6d28d9] shadow-md font-semibold"
                  }>
                    <Send size={16} className="mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timer */}
              <div className={`rounded-xl p-6 text-center ${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                  : "bg-white border-2 border-[#fbcfe8] shadow-2xl shadow-pink-200/50"
              }`}>
                <Clock className={`${isDark ? "text-violet-400" : "text-[#ec4899]"} mx-auto mb-3`} size={32} />
                <div className={`text-3xl ${isDark ? "text-white" : "text-[#2e1065]"} mb-1`}>18:32</div>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-sm`}>Time Elapsed</p>
              </div>

              {/* Tips */}
              <div className={`rounded-xl p-6 ${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                  : "bg-white border-2 border-[#c4b5fd] shadow-2xl shadow-purple-200/50"
              }`}>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 flex items-center gap-2`}>
                  <Zap className={isDark ? "text-amber-400" : "text-amber-500"} size={20} />
                  Writing Tips
                </h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"}`}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                    <span>Use the STAR method for behavioral questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                    <span>Include specific examples and metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={14} />
                    <span>Proofread before submitting</span>
                  </li>
                </ul>
              </div>

              {/* Progress */}
              <div className={`rounded-xl p-6 ${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] backdrop-blur-sm"
                  : "bg-white border-2 border-[#fbcfe8] shadow-2xl shadow-pink-200/50"
              }`}>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4`}>Questions Progress</h4>
                <div className="space-y-2">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded ${
                        isDark
                          ? idx < currentQuestion
                            ? "bg-emerald-500/10"
                            : idx === currentQuestion
                            ? "bg-violet-500/20 border border-violet-500/30"
                            : "bg-[rgba(255,255,255,0.03)]"
                          : idx < currentQuestion
                            ? "bg-emerald-100"
                            : idx === currentQuestion
                            ? "bg-pink-100 border-2 border-[#f9a8d4]"
                            : "bg-purple-50"
                      }`}
                    >
                      {idx < currentQuestion ? (
                        <CheckCircle2 className={isDark ? "text-emerald-400" : "text-emerald-600"} size={16} />
                      ) : idx === currentQuestion ? (
                        <Target className={isDark ? "text-violet-400" : "text-[#ec4899]"} size={16} />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border ${isDark ? "border-[rgba(94,234,212,0.3)]" : "border-pink-300"}`} />
                      )}
                      <span className={`text-sm ${isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"}`}>Question {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial Type Selection Screen
  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>AI Interview Practice 🎯</h1>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Practice with realistic AI-powered mock interviews</p>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}>
          <Target className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl mt-3`}>45</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Interviews Completed</p>
        </div>
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}>
          <TrendingUp className={isDark ? "text-emerald-400" : "text-green-600"} size={24} />
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl mt-3`}>8.5/10</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Avg Performance</p>
        </div>
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}>
          <Clock className={isDark ? "text-violet-400" : "text-pink-600"} size={24} />
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl mt-3`}>32h</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Practice Time</p>
        </div>
        <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}>
          <Award className={isDark ? "text-amber-400" : "text-orange-600"} size={24} />
          <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl mt-3`}>12</div>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>Achievements</p>
        </div>
      </div>

      {/* Interview Type Selection */}
      <div>
        <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 font-semibold`}>Choose Interview Type</h2>
        <div className="grid grid-cols-2 gap-6">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)] hover:shadow-teal-500/10" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl ${type.bgColor} border ${isDark ? type.borderColor : "border-[#ddd6fe]"} flex items-center justify-center shrink-0`}>
                    <Icon className={isDark ? type.color : "text-purple-600"} size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>{type.title}</h3>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-3`}>{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={isDark ? "bg-[rgba(255,255,255,0.05)] text-[#d1d5dc] border-[rgba(94,234,212,0.2)]" : "bg-purple-50 text-[#2e1065] border-[#ddd6fe] font-medium"}>
                        <Clock size={12} className="mr-1" />
                        {type.duration}
                      </Badge>
                      <Badge className={isDark ? "bg-[rgba(255,255,255,0.05)] text-[#d1d5dc] border-[rgba(94,234,212,0.2)]" : "bg-purple-50 text-[#2e1065] border-[#ddd6fe] font-medium"}>
                        {type.questions} questions
                      </Badge>
                      <Badge className={
                        type.difficulty.includes("Hard") ? (isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-700 border-red-300 font-semibold") :
                        type.difficulty.includes("Medium") ? (isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-orange-100 text-orange-700 border-orange-300 font-semibold") :
                        (isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-green-100 text-green-700 border-green-300 font-semibold")
                      }>
                        {type.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => selectInterviewType(type.id)}
                  className={`w-full ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}
                >
                  <ArrowRight size={16} className="mr-2" />
                  Select & Continue
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

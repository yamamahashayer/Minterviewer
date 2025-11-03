
import { useState } from "react";
import { 
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Star,
  Eye,
  Trash2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Target,
  Award,
  Clock,
  Plus,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  ArrowRight,
  ArrowLeft,
  Save,
  FileCheck,
  PenTool,
  Lightbulb
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

export default function CVReviewPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [mode, setMode] = useState<"choice" | "upload" | "create">("choice");
  const [uploadedCV, setUploadedCV] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [cvPreview, setCvPreview] = useState(false);

  // CV Builder Form State
  const [cvData, setCvData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: ""
    },
    experience: [
      { id: 1, title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }
    ],
    education: [
      { id: 1, degree: "", institution: "", location: "", graduationDate: "", gpa: "" }
    ],
    skills: {
      technical: "",
      soft: "",
      languages: ""
    }
  });

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploadedCV(true);
    }, 2000);
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, { 
        id: cvData.experience.length + 1, 
        title: "", 
        company: "", 
        location: "", 
        startDate: "", 
        endDate: "", 
        current: false, 
        description: "" 
      }]
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, { 
        id: cvData.education.length + 1, 
        degree: "", 
        institution: "", 
        location: "", 
        graduationDate: "", 
        gpa: "" 
      }]
    });
  };

  const updatePersonal = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personal: { ...cvData.personal, [field]: value }
    });
  };

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updated = [...cvData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setCvData({ ...cvData, experience: updated });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...cvData.education];
    updated[index] = { ...updated[index], [field]: value };
    setCvData({ ...cvData, education: updated });
  };

  const updateSkills = (field: string, value: string) => {
    setCvData({
      ...cvData,
      skills: { ...cvData.skills, [field]: value }
    });
  };

  const stats = [
    { label: "Overall Score", value: "8.5/10", icon: Star, color: "text-amber-400", trend: "+1.2" },
    { label: "ATS Compatibility", value: "92%", icon: CheckCircle2, color: "text-emerald-400", trend: "+8%" },
    { label: "Keyword Match", value: "85%", icon: Target, color: "text-violet-400", trend: "+5%" },
    { label: "Impact Score", value: "7.8/10", icon: TrendingUp, color: "text-teal-400", trend: "+0.5" },
  ];

  const feedbackSections = [
    {
      id: 1,
      category: "Formatting & Structure",
      score: 9.2,
      status: "excellent",
      icon: FileText,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      feedback: [
        { type: "positive", text: "Clean, professional layout with clear sections" },
        { type: "positive", text: "Consistent formatting throughout the document" },
        { type: "suggestion", text: "Consider using bullet points for achievements" }
      ]
    },
    {
      id: 2,
      category: "Content Quality",
      score: 8.5,
      status: "good",
      icon: Sparkles,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      borderColor: "border-teal-500/30",
      feedback: [
        { type: "positive", text: "Strong action verbs used in descriptions" },
        { type: "suggestion", text: "Add more quantifiable achievements" },
        { type: "suggestion", text: "Include specific metrics and results" }
      ]
    },
    {
      id: 3,
      category: "Keywords & ATS",
      score: 8.8,
      status: "excellent",
      icon: Zap,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30",
      feedback: [
        { type: "positive", text: "Good use of industry-specific keywords" },
        { type: "positive", text: "ATS-friendly format detected" },
        { type: "warning", text: "Missing some key technical terms for your role" }
      ]
    },
    {
      id: 4,
      category: "Experience & Impact",
      score: 7.5,
      status: "needs-improvement",
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      feedback: [
        { type: "positive", text: "Relevant experience clearly highlighted" },
        { type: "warning", text: "Some achievements lack specific numbers" },
        { type: "suggestion", text: "Emphasize leadership and team collaboration" }
      ]
    }
  ];

  const suggestions = [
    {
      id: 1,
      priority: "high",
      title: "Add Quantifiable Achievements",
      description: "Replace generic descriptions with specific metrics. For example, instead of 'Led team projects,' use 'Led team of 5 developers, delivering 3 projects 20% under budget.'",
      impact: "High Impact"
    },
    {
      id: 2,
      priority: "high",
      title: "Optimize for ATS Systems",
      description: "Include more role-specific keywords like 'React', 'Node.js', 'Agile', 'CI/CD' to improve ATS compatibility.",
      impact: "High Impact"
    },
    {
      id: 3,
      priority: "medium",
      title: "Strengthen Skills Section",
      description: "Organize technical skills by proficiency level (Expert, Advanced, Intermediate) to better showcase your capabilities.",
      impact: "Medium Impact"
    },
    {
      id: 4,
      priority: "low",
      title: "Update Contact Information",
      description: "Consider adding your LinkedIn profile and GitHub portfolio to increase professional visibility.",
      impact: "Low Impact"
    }
  ];

  const cvHistory = [
    {
      id: 1,
      name: "Software_Engineer_Resume_v3.pdf",
      date: "Oct 10, 2025",
      score: 8.5,
      status: "current"
    },
    {
      id: 2,
      name: "Software_Engineer_Resume_v2.pdf",
      date: "Oct 5, 2025",
      score: 7.8,
      status: "previous"
    },
    {
      id: 3,
      name: "Software_Engineer_Resume_v1.pdf",
      date: "Sep 28, 2025",
      score: 7.2,
      status: "previous"
    }
  ];

  const missingKeywords = [
    "Machine Learning", "Docker", "Kubernetes", "AWS", "TypeScript",
    "GraphQL", "Microservices", "Test-Driven Development", "Scrum", "CI/CD"
  ];

  const builderSteps = [
    { id: 1, title: "Personal Info", icon: User, description: "Basic contact details" },
    { id: 2, title: "Experience", icon: Briefcase, description: "Work history" },
    { id: 3, title: "Education", icon: GraduationCap, description: "Academic background" },
    { id: 4, title: "Skills", icon: Code, description: "Technical & soft skills" },
    { id: 5, title: "Preview", icon: Eye, description: "Review & download" }
  ];

  // Choice Screen
  if (mode === "choice") {
    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>CV Review & Creation 📄</h1>
          <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Upload your existing CV or create a new one with AI assistance</p>
          <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
        </div>

        {/* Choice Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 mt-16">
          {/* Upload Existing CV */}
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-xl"} border-2 ${isDark ? "border-[rgba(94,234,212,0.3)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.5)] hover:shadow-teal-500/20" : "hover:border-[#a855f7] hover:shadow-2xl hover:shadow-purple-200"} transition-all group`}>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${isDark ? "from-teal-500/20 to-emerald-500/20 border-teal-500/30" : "from-purple-100 to-pink-100 border-purple-300"} border flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
              <Upload className={isDark ? "text-teal-300" : "text-purple-600"} size={40} />
            </div>
            <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-center mb-3 font-bold`}>Upload Existing CV</h2>
            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-center mb-6`}>
              Already have a CV? Upload it to get AI-powered feedback and optimization suggestions
            </p>
            <div className="space-y-2 mb-6">
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                <span>Instant AI analysis</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                <span>ATS compatibility check</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                <span>Improvement recommendations</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={16} />
                <span>Download optimized version</span>
              </div>
            </div>
            <Button
              onClick={() => setMode("upload")}
              className={`w-full ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}
            >
              <Upload size={16} className="mr-2" />
              Upload My CV
            </Button>
          </div>

          {/* Create New CV */}
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-xl"} border-2 ${isDark ? "border-[rgba(94,234,212,0.3)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.5)] hover:shadow-teal-500/20" : "hover:border-[#a855f7] hover:shadow-2xl hover:shadow-purple-200"} transition-all group`}>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${isDark ? "from-violet-500/20 to-purple-500/20 border-violet-500/30" : "from-pink-100 to-rose-100 border-pink-300"} border flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
              <PenTool className={isDark ? "text-violet-300" : "text-pink-600"} size={40} />
            </div>
            <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-center mb-3 font-bold`}>Create New CV</h2>
            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-center mb-6`}>
              Don't have a CV yet? Our guided builder will help you create a professional resume step-by-step
            </p>
            <div className="space-y-2 mb-6">
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-violet-400" : "text-pink-600"} size={16} />
                <span>Step-by-step guidance</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-violet-400" : "text-pink-600"} size={16} />
                <span>AI-powered suggestions</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-violet-400" : "text-pink-600"} size={16} />
                <span>Professional templates</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm font-medium`}>
                <CheckCircle2 className={isDark ? "text-violet-400" : "text-pink-600"} size={16} />
                <span>Export as PDF</span>
              </div>
            </div>
            <Button
              onClick={() => setMode("create")}
              className={`w-full ${isDark ? "bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20" : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold shadow-md"}`}
            >
              <PenTool size={16} className="mr-2" />
              Create My CV
            </Button>
          </div>
        </div>

        {/* Why Create a Great CV */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-amber-200"} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-start gap-4">
              <Lightbulb className={isDark ? "text-amber-400" : "text-orange-600"} size={24} />
              <div>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>Why a Great CV Matters</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>
                  Your CV is often the first impression you make on potential employers. A well-crafted resume can increase your interview chances by up to 40%. 
                  Our AI-powered system helps you create or optimize your CV using industry best practices and ATS-friendly formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CV Builder Mode
  if (mode === "create") {
    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>CV Builder 📝</h1>
              <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Create your professional resume step-by-step</p>
            </div>
            <Button
              onClick={() => { setMode("choice"); setCreateStep(1); }}
              className={isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Options
            </Button>
          </div>
          <div className={`h-1 w-[200px] rounded-full ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {builderSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = createStep === step.id;
              const isCompleted = createStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive ? (isDark ? "bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border-2 border-teal-400" : "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-500") :
                      isCompleted ? (isDark ? "bg-emerald-500/20 border-2 border-emerald-400" : "bg-green-100 border-2 border-green-500") :
                      (isDark ? "bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(94,234,212,0.2)]" : "bg-purple-50 border-2 border-purple-200")
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={24} />
                      ) : (
                        <Icon className={isActive ? (isDark ? "text-teal-300" : "text-purple-600") : (isDark ? "text-[#6a7282]" : "text-purple-300")} size={24} />
                      )}
                    </div>
                    <p className={`text-xs text-center font-medium ${isActive ? (isDark ? "text-teal-300" : "text-purple-700") : isCompleted ? (isDark ? "text-emerald-400" : "text-green-600") : (isDark ? "text-[#6a7282]" : "text-purple-400")}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < builderSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${isCompleted ? (isDark ? "bg-emerald-400" : "bg-green-500") : (isDark ? "bg-[rgba(94,234,212,0.2)]" : "bg-purple-200")}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Personal Info */}
          {createStep === 1 && (
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"} border flex items-center justify-center`}>
                  <User className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
                </div>
                <div>
                  <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Personal Information</h2>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Tell us about yourself</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={cvData.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="john.doe@email.com"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Phone Number *</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={cvData.personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Location *</Label>
                  <Input
                    placeholder="New York, NY"
                    value={cvData.personal.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>LinkedIn Profile</Label>
                  <Input
                    placeholder="linkedin.com/in/johndoe"
                    value={cvData.personal.linkedin}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Portfolio/Website</Label>
                  <Input
                    placeholder="johndoe.com"
                    value={cvData.personal.portfolio}
                    onChange={(e) => updatePersonal("portfolio", e.target.value)}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Professional Summary *</Label>
                <Textarea
                  placeholder="Write a brief summary highlighting your experience, skills, and career goals..."
                  value={cvData.personal.summary}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                  className={`min-h-[120px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                />
                <p className={`${isDark ? "text-[#6a7282]" : "text-purple-500"} text-xs mt-2`}>
                  💡 Tip: Keep it concise (2-3 sentences) and focus on your key strengths
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {createStep === 2 && (
            <div className="space-y-6">
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"} border flex items-center justify-center`}>
                      <Briefcase className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
                    </div>
                    <div>
                      <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Work Experience</h2>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Add your professional experience</p>
                    </div>
                  </div>
                  <Button
                    onClick={addExperience}
                    className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 font-semibold"}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Position
                  </Button>
                </div>

                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className={`mb-6 p-6 ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)]" : "bg-purple-50 border-purple-200"} border rounded-lg`}>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 font-semibold`}>Position {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Job Title *</Label>
                        <Input
                          placeholder="Software Engineer"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, "title", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Company *</Label>
                        <Input
                          placeholder="Tech Corp"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Location</Label>
                        <Input
                          placeholder="San Francisco, CA"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, "location", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Start Date *</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          disabled={exp.current}
                          className={`disabled:opacity-50 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                        />
                      </div>
                      <div className="flex items-center pt-8">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, "current", e.target.checked)}
                          className="mr-2"
                        />
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm`}>Currently working here</Label>
                      </div>
                    </div>
                    <div>
                      <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Description & Achievements *</Label>
                      <Textarea
                        placeholder="• Led development of key features&#10;• Improved system performance by 40%&#10;• Mentored 5 junior developers"
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        className={`min-h-[100px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                      />
                      <p className={`${isDark ? "text-[#6a7282]" : "text-purple-500"} text-xs mt-2`}>
                        💡 Tip: Use bullet points and start with action verbs. Include numbers and metrics!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {createStep === 3 && (
            <div className="space-y-6">
              <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"} border flex items-center justify-center`}>
                      <GraduationCap className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
                    </div>
                    <div>
                      <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Education</h2>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Add your educational background</p>
                    </div>
                  </div>
                  <Button
                    onClick={addEducation}
                    className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 font-semibold"}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Education
                  </Button>
                </div>

                {cvData.education.map((edu, index) => (
                  <div key={edu.id} className={`mb-6 p-6 ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)]" : "bg-purple-50 border-purple-200"} border rounded-lg`}>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 font-semibold`}>Education {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Degree *</Label>
                        <Input
                          placeholder="Bachelor of Science in Computer Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Institution *</Label>
                        <Input
                          placeholder="University of Technology"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Location</Label>
                        <Input
                          placeholder="Boston, MA"
                          value={edu.location}
                          onChange={(e) => updateEducation(index, "location", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Graduation Date *</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                      <div>
                        <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>GPA (Optional)</Label>
                        <Input
                          placeholder="3.8/4.0"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                          className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {createStep === 4 && (
            <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-8 backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-lg ${isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"} border flex items-center justify-center`}>
                  <Code className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
                </div>
                <div>
                  <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Skills & Competencies</h2>
                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Highlight your technical and soft skills</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Technical Skills *</Label>
                  <Textarea
                    placeholder="React, Node.js, Python, AWS, Docker, Kubernetes, SQL, MongoDB..."
                    value={cvData.skills.technical}
                    onChange={(e) => updateSkills("technical", e.target.value)}
                    className={`min-h-[100px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                  <p className={`${isDark ? "text-[#6a7282]" : "text-purple-500"} text-xs mt-2`}>
                    💡 Tip: Separate skills with commas. Include technologies, frameworks, and tools
                  </p>
                </div>

                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Soft Skills</Label>
                  <Textarea
                    placeholder="Leadership, Communication, Problem Solving, Team Collaboration, Project Management..."
                    value={cvData.skills.soft}
                    onChange={(e) => updateSkills("soft", e.target.value)}
                    className={`min-h-[80px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>

                <div>
                  <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-2 block font-medium`}>Languages</Label>
                  <Textarea
                    placeholder="English (Native), Spanish (Fluent), French (Intermediate)..."
                    value={cvData.skills.languages}
                    onChange={(e) => updateSkills("languages", e.target.value)}
                    className={`min-h-[80px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>
              </div>

              {/* AI Suggestions */}
              <div className={`mt-6 p-4 ${isDark ? "bg-violet-500/10 border-violet-500/30" : "bg-purple-50 border-purple-200"} border rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Sparkles className={isDark ? "text-violet-400" : "text-purple-600"} size={20} />
                  <div>
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-2 font-semibold`}>AI Suggestions for Your Role</h4>
                    <div className="flex flex-wrap gap-2">
                      {["TypeScript", "GraphQL", "CI/CD", "Agile/Scrum", "Git", "REST APIs"].map((skill, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const current = cvData.skills.technical;
                            if (!current.includes(skill)) {
                              updateSkills("technical", current ? `${current}, ${skill}` : skill);
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${isDark ? "bg-[rgba(255,255,255,0.05)] border-violet-500/30 text-violet-300 hover:bg-violet-500/20" : "bg-white border-purple-300 text-purple-700 hover:bg-purple-100"} border`}
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {createStep === 5 && (
            <div className="space-y-6">
              {/* CV Preview */}
              <div className="bg-white text-black p-12 rounded-xl shadow-2xl">
                {/* Header */}
                <div className="border-b-2 border-teal-600 pb-6 mb-6">
                  <h1 className="text-4xl mb-2">{cvData.personal.fullName || "Your Name"}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {cvData.personal.email && <span>📧 {cvData.personal.email}</span>}
                    {cvData.personal.phone && <span>📱 {cvData.personal.phone}</span>}
                    {cvData.personal.location && <span>📍 {cvData.personal.location}</span>}
                    {cvData.personal.linkedin && <span>🔗 {cvData.personal.linkedin}</span>}
                  </div>
                </div>

                {/* Summary */}
                {cvData.personal.summary && (
                  <div className="mb-6">
                    <h2 className="text-xl mb-3 text-teal-600 uppercase tracking-wide">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{cvData.personal.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {cvData.experience.some(exp => exp.title || exp.company) && (
                  <div className="mb-6">
                    <h2 className="text-xl mb-3 text-teal-600 uppercase tracking-wide">Work Experience</h2>
                    {cvData.experience.map((exp, idx) => (
                      (exp.title || exp.company) && (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg">{exp.title || "Position Title"}</h3>
                            <span className="text-sm text-gray-600">
                              {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {exp.startDate && (exp.current || exp.endDate) && ' - '}
                              {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</p>
                          {exp.description && (
                            <div className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Education */}
                {cvData.education.some(edu => edu.degree || edu.institution) && (
                  <div className="mb-6">
                    <h2 className="text-xl mb-3 text-teal-600 uppercase tracking-wide">Education</h2>
                    {cvData.education.map((edu, idx) => (
                      (edu.degree || edu.institution) && (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg">{edu.degree || "Degree"}</h3>
                              <p className="text-gray-600">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                            {edu.graduationDate && (
                              <span className="text-sm text-gray-600">
                                {new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Skills */}
                {(cvData.skills.technical || cvData.skills.soft || cvData.skills.languages) && (
                  <div>
                    <h2 className="text-xl mb-3 text-teal-600 uppercase tracking-wide">Skills</h2>
                    {cvData.skills.technical && (
                      <div className="mb-2">
                        <span className="text-sm uppercase tracking-wide text-gray-600 mr-2">Technical:</span>
                        <span className="text-gray-700">{cvData.skills.technical}</span>
                      </div>
                    )}
                    {cvData.skills.soft && (
                      <div className="mb-2">
                        <span className="text-sm uppercase tracking-wide text-gray-600 mr-2">Soft Skills:</span>
                        <span className="text-gray-700">{cvData.skills.soft}</span>
                      </div>
                    )}
                    {cvData.skills.languages && (
                      <div>
                        <span className="text-sm uppercase tracking-wide text-gray-600 mr-2">Languages:</span>
                        <span className="text-gray-700">{cvData.skills.languages}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-white mb-4">Your CV is Ready! 🎉</h3>
                <p className="text-[#99a1af] mb-6">
                  Review your CV above. When you're satisfied, you can download it as a PDF or get AI feedback to make it even better.
                </p>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20">
                    <Download size={16} className="mr-2" />
                    Download as PDF
                  </Button>
                  <Button 
                    onClick={() => {
                      setMode("upload");
                      setUploadedCV(true);
                    }}
                    className="flex-1 bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border-2 border-violet-400/50"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Get AI Feedback
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCreateStep(Math.max(1, createStep - 1))}
              disabled={createStep === 1}
              className={`disabled:opacity-50 ${isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}`}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => setCreateStep(Math.min(5, createStep + 1))}
              disabled={createStep === 5}
              className={`disabled:opacity-50 ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}
            >
              {createStep === 4 ? "Preview CV" : "Next"}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Upload Mode (Existing functionality)
  if (!uploadedCV) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={isDark ? "text-white" : "text-[#1e0a3c]"} style={{marginBottom: "0.5rem", fontWeight: 800, fontSize: "2rem"}}>CV Review & Optimization 📄</h1>
              <p className={isDark ? "text-[#99a1af]" : "text-[#581c87]"} style={{fontWeight: 500}}>Get AI-powered feedback to perfect your resume</p>
            </div>
            <Button
              onClick={() => setMode("choice")}
              className={isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-3 border-[#c084fc] text-[#581c87] hover:bg-[#faf5ff] hover:border-[#9333ea] font-bold shadow-md hover:shadow-lg"}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Options
            </Button>
          </div>
          <div className={`h-1.5 w-[200px] rounded-full ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] shadow-[0px_0px_20px_2px_rgba(168,85,247,0.5)]"}`} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`border-3 border-dashed rounded-2xl p-12 backdrop-blur-sm text-center transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.3)] hover:border-[rgba(94,234,212,0.5)]" : "bg-white shadow-2xl border-[#c084fc] hover:border-[#9333ea] hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)]"}`}>
            <div className={`w-24 h-24 rounded-2xl border-3 flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/30" : "bg-gradient-to-br from-[#f3e8ff] to-[#fce7f3] border-[#c084fc] shadow-lg"}`}>
              {analyzing ? (
                <RefreshCw className={isDark ? "text-teal-300 animate-spin" : "text-[#7c3aed] animate-spin"} size={48} strokeWidth={2.5} />
              ) : (
                <Upload className={isDark ? "text-teal-300" : "text-[#7c3aed]"} size={48} strokeWidth={2.5} />
              )}
            </div>
            
            {analyzing ? (
              <div>
                <h3 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-2 font-bold text-xl`}>Analyzing your CV...</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} mb-6 font-medium text-base`}>Our AI is reviewing your resume</p>
                <Progress value={65} className="max-w-md mx-auto h-3" />
              </div>
            ) : (
              <div>
                <h3 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-3 font-bold text-2xl`}>Upload Your CV or Resume</h3>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} mb-8 font-medium text-base`}>Drag and drop your file or click to browse</p>
                
                <Button 
                  onClick={handleUpload}
                  className={`mb-6 px-8 py-6 text-base ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-transform"}`}
                >
                  <Upload size={20} className="mr-2" strokeWidth={2.5} />
                  Select File to Upload
                </Button>
                
                <p className={`text-sm font-semibold ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className={`rounded-xl p-6 backdrop-blur-sm text-center transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-xl border-2 border-[#c084fc] hover:shadow-2xl hover:border-[#9333ea] hover:scale-105"} border`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? "" : "bg-gradient-to-br from-[#f3e8ff] to-[#fae8ff] border-2 border-[#d8b4fe]"}`}>
                <Sparkles className={`${isDark ? "text-teal-400" : "text-[#7c3aed]"}`} size={36} strokeWidth={2.5} />
              </div>
              <h4 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-2 font-bold text-lg`}>AI Analysis</h4>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} text-sm font-medium`}>Advanced AI reviews your CV in seconds</p>
            </div>
            <div className={`rounded-xl p-6 backdrop-blur-sm text-center transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-xl border-2 border-[#86efac] hover:shadow-2xl hover:border-[#22c55e] hover:scale-105"} border`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? "" : "bg-gradient-to-br from-[#dcfce7] to-[#d1fae5] border-2 border-[#86efac]"}`}>
                <Target className={`${isDark ? "text-emerald-400" : "text-[#16a34a]"}`} size={36} strokeWidth={2.5} />
              </div>
              <h4 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-2 font-bold text-lg`}>ATS Optimization</h4>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} text-sm font-medium`}>Ensure your CV passes ATS systems</p>
            </div>
            <div className={`rounded-xl p-6 backdrop-blur-sm text-center transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-xl border-2 border-[#f9a8d4] hover:shadow-2xl hover:border-[#ec4899] hover:scale-105"} border`}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? "" : "bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8] border-2 border-[#f9a8d4]"}`}>
                <TrendingUp className={`${isDark ? "text-violet-400" : "text-[#db2777]"}`} size={36} strokeWidth={2.5} />
              </div>
              <h4 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-2 font-bold text-lg`}>Improvement Tips</h4>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} text-sm font-medium`}>Get actionable feedback to improve</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis Results (Existing functionality)
  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>CV Review & Optimization 📄</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Get AI-powered feedback to perfect your resume</p>
          </div>
          <div className="flex gap-3">
            <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold shadow-sm"}>
              <Download size={16} className="mr-2" />
              Download Optimized
            </Button>
            <Button 
              onClick={() => { setUploadedCV(false); setMode("choice"); }}
              className={isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}
            >
              <Upload size={16} className="mr-2" />
              Upload New CV
            </Button>
          </div>
        </div>
        <div className={`h-1 w-[200px] rounded-full ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-6 backdrop-blur-sm transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]" : "bg-white shadow-lg border-[#ddd6fe] hover:shadow-xl hover:border-[#a855f7]"} border`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={stat.color} size={24} />
                <Badge className={isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-green-100 text-green-700 border-green-300"}>
                  {stat.trend}
                </Badge>
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className={`mb-6 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]" : "bg-white border-[#ddd6fe] shadow-sm"} border`}>
          <TabsTrigger value="feedback" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <Sparkles size={16} className="mr-2" />
            Detailed Feedback
          </TabsTrigger>
          <TabsTrigger value="suggestions" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <TrendingUp size={16} className="mr-2" />
            Improvement Suggestions
          </TabsTrigger>
          <TabsTrigger value="keywords" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <Zap size={16} className="mr-2" />
            Keywords Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold"}>
            <Clock size={16} className="mr-2" />
            Version History
          </TabsTrigger>
        </TabsList>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <div className="grid grid-cols-2 gap-6">
            {feedbackSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className={`rounded-xl p-6 backdrop-blur-sm transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-2xl border-2 border-[#c084fc] hover:shadow-[0_15px_40px_rgba(168,85,247,0.25)] hover:border-[#9333ea]"} border`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center ${isDark ? `${section.bgColor} ${section.borderColor}` : "bg-gradient-to-br from-[#f3e8ff] to-[#fae8ff] border-[#c084fc] shadow-md"}`}>
                        <Icon className={isDark ? section.color : "#7c3aed"} size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-2 font-bold text-lg`}>{section.category}</h3>
                        <div className="flex items-center gap-3">
                          <Progress value={section.score * 10} className="w-28 h-2.5" />
                          <span className={`${isDark ? "text-teal-300" : "text-[#7c3aed]"} text-sm font-bold`}>{section.score}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.feedback.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                          isDark
                            ? (item.type === "positive" ? "bg-emerald-500/10 border-emerald-500/20" :
                               item.type === "warning" ? "bg-amber-500/10 border-amber-500/20" :
                               "bg-blue-500/10 border-blue-500/20")
                            : (item.type === "positive" ? "bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-500" :
                               item.type === "warning" ? "bg-amber-50 border-amber-300 hover:bg-amber-100 hover:border-amber-500" :
                               "bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-500")
                        }`}
                      >
                        {item.type === "positive" ? (
                          <ThumbsUp className={`shrink-0 mt-0.5 ${isDark ? "text-emerald-400" : "text-green-600"}`} size={18} strokeWidth={2.5} />
                        ) : item.type === "warning" ? (
                          <AlertCircle className={`shrink-0 mt-0.5 ${isDark ? "text-amber-400" : "text-amber-600"}`} size={18} strokeWidth={2.5} />
                        ) : (
                          <Sparkles className={`shrink-0 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} size={18} strokeWidth={2.5} />
                        )}
                        <p className={`${isDark ? "text-[#d1d5dc]" : "text-[#1e0a3c]"} text-sm font-medium leading-relaxed`}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions">
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`rounded-xl p-6 backdrop-blur-sm transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-2xl border-2 border-[#c084fc] hover:shadow-[0_15px_40px_rgba(168,85,247,0.25)] hover:border-[#9333ea]"} border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} font-bold text-lg`}>{suggestion.title}</h4>
                      <Badge className={
                        isDark
                          ? (suggestion.priority === "high" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                             suggestion.priority === "medium" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                             "bg-blue-500/20 text-blue-300 border-blue-500/30")
                          : (suggestion.priority === "high" ? "bg-red-100 text-red-700 border-2 border-red-400 font-bold" :
                             suggestion.priority === "medium" ? "bg-amber-100 text-amber-700 border-2 border-amber-400 font-bold" :
                             "bg-blue-100 text-blue-700 border-2 border-blue-400 font-bold")
                      }>
                        {suggestion.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} text-sm leading-relaxed font-medium`}>{suggestion.description}</p>
                  </div>
                </div>
                <div className={`flex items-center justify-between pt-4 border-t-2 ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-purple-200"}`}>
                  <Badge className={`${isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-purple-100 text-purple-700 border-2 border-purple-400 font-bold px-3 py-1"}`}>
                    {suggestion.impact}
                  </Badge>
                  <Button className={`h-9 text-sm font-bold px-4 ${isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6d28d9] hover:to-[#db2777] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-transform"}`}>
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <div className={`rounded-xl p-8 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-2xl border-2 border-[#c084fc]"} border`}>
            <h3 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-4 font-bold text-xl`}>Missing Industry Keywords 🔑</h3>
            <p className={`${isDark ? "text-[#99a1af]" : "text-[#581c87]"} mb-6 font-medium leading-relaxed`}>
              Adding these keywords can improve your ATS compatibility and help recruiters find your CV more easily.
            </p>
            <div className="flex flex-wrap gap-3">
              {missingKeywords.map((keyword, index) => (
                <button
                  key={index}
                  className={`px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                    isDark 
                      ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.4)]"
                      : "bg-purple-50 border-purple-300 text-[#7c3aed] hover:bg-purple-100 hover:border-[#9333ea] hover:shadow-md hover:scale-105"
                  }`}
                >
                  + {keyword}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className={`rounded-xl p-8 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-2xl border-2 border-[#c084fc]"} border`}>
            <h3 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} mb-6 font-bold text-xl`}>CV Version History 📋</h3>
            <div className="space-y-4">
              {cvHistory.map((cv) => (
                <div
                  key={cv.id}
                  className={`flex items-center justify-between p-5 rounded-xl transition-all ${
                    cv.status === "current"
                      ? isDark 
                        ? "bg-teal-500/10 border-2 border-teal-500/30"
                        : "bg-gradient-to-br from-purple-50 to-pink-50 border-3 border-[#9333ea] shadow-lg"
                      : isDark
                        ? "bg-[rgba(255,255,255,0.03)] border border-[rgba(94,234,212,0.1)]"
                        : "bg-purple-50/50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      isDark
                        ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30"
                        : cv.status === "current"
                          ? "bg-gradient-to-br from-[#9333ea] to-[#ec4899] border-2 border-purple-300"
                          : "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300"
                    }`}>
                      <FileText className={isDark ? "text-teal-300" : "text-white"} size={22} />
                    </div>
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#1e0a3c]"} font-bold mb-1.5`}>{cv.name}</h4>
                      <div className={`flex items-center gap-3 text-xs ${isDark ? "text-[#99a1af]" : "text-[#581c87]"} font-medium`}>
                        <span>{cv.date}</span>
                        <span>•</span>
                        <span className={`${isDark ? "text-teal-300" : "text-[#7c3aed]"} font-bold`}>Score: {cv.score}/10</span>
                        {cv.status === "current" && (
                          <>
                            <span>•</span>
                            <Badge className={`text-xs px-2.5 py-0.5 font-bold ${isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white border-0 shadow-md"}`}>
                              CURRENT
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                        : "bg-purple-50 border-purple-300 text-[#7c3aed] hover:bg-purple-100 hover:border-[#9333ea]"
                    }`}>
                      <Eye size={18} />
                    </button>
                    <button className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                        : "bg-purple-50 border-purple-300 text-[#7c3aed] hover:bg-purple-100 hover:border-[#9333ea]"
                    }`}>
                      <Download size={18} />
                    </button>
                    {cv.status !== "current" && (
                      <button className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 ${
                        isDark
                          ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-red-400 hover:bg-red-500/10"
                          : "bg-red-50 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400"
                      }`}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

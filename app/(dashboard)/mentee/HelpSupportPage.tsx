import { useState } from "react";
import { 
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Mail,
  Phone,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Zap,
  Users,
  AlertCircle,
  CheckCircle2,
  Play,
  Download,
  Star,
  ThumbsUp,
  Clock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function HelpSupportPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState("");

  const quickLinks = [
    {
      id: 1,
      title: "Getting Started",
      description: "Learn the basics of Minterviewer",
      icon: Lightbulb,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30"
    },
    {
      id: 2,
      title: "Interview Tips",
      description: "Best practices for success",
      icon: Zap,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      borderColor: "border-teal-500/30"
    },
    {
      id: 3,
      title: "Community Forum",
      description: "Connect with other users",
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/20",
      borderColor: "border-violet-500/30"
    },
    {
      id: 4,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30"
    }
  ];

  const faqs = [
    {
      id: "faq-1",
      category: "General",
      question: "What is Minterviewer and how does it work?",
      answer: "Minterviewer is an AI-powered interview preparation platform that helps you practice and improve your interview skills. It provides realistic mock interviews, personalized feedback, performance tracking, and goal-setting features to help you succeed in your job search."
    },
    {
      id: "faq-2",
      category: "General",
      question: "How do I schedule my first interview?",
      answer: "Navigate to the Schedule page from the sidebar, click 'Create New Interview', select your interview type (Technical, Behavioral, or System Design), choose a date and time, and click 'Schedule'. You'll receive a reminder before your interview starts."
    },
    {
      id: "faq-3",
      category: "Performance",
      question: "How is my interview score calculated?",
      answer: "Your interview score is based on multiple factors including technical accuracy, communication clarity, problem-solving approach, and overall performance. Our AI analyzes your responses and provides detailed feedback on areas of improvement."
    },
    {
      id: "faq-4",
      category: "Performance",
      question: "Can I download my performance reports?",
      answer: "Yes! Go to the Reports page, select the report you want to download, choose your preferred format (PDF, CSV, or JSON), and click 'Generate Report'. You can access all your historical reports from the Report History tab."
    },
    {
      id: "faq-5",
      category: "Goals",
      question: "How do I set and track goals?",
      answer: "Visit the Goals page, click 'Create New Goal', define your objective, set milestones, choose a deadline, and assign a priority level. You can track your progress through the visual progress bars and milestone checkers."
    },
    {
      id: "faq-6",
      category: "Account",
      question: "How do I change my notification preferences?",
      answer: "Go to Settings > Notifications tab. You can customize email notifications, practice reminders, achievement alerts, weekly reports, and message notifications according to your preferences."
    },
    {
      id: "faq-7",
      category: "Account",
      question: "Is my data secure and private?",
      answer: "Yes, we take data security seriously. All your information is encrypted, and we follow industry best practices for data protection. You can export or delete your data at any time from the Settings > Data & Privacy section."
    },
    {
      id: "faq-8",
      category: "Features",
      question: "What types of interviews are available?",
      answer: "We offer Technical Interviews (coding, algorithms), Behavioral Interviews (STAR method, soft skills), System Design Interviews (architecture, scalability), and Coding Challenges (data structures, problem-solving)."
    },
    {
      id: "faq-9",
      category: "Features",
      question: "How does the AI Coach work?",
      answer: "Our AI Coach analyzes your interview performance in real-time, provides instant feedback, identifies strengths and weaknesses, suggests improvement areas, and sends personalized tips through the Messages section."
    },
    {
      id: "faq-10",
      category: "Troubleshooting",
      question: "What should I do if I encounter technical issues?",
      answer: "First, try refreshing the page and clearing your browser cache. If the issue persists, contact our support team through the Contact Support tab with details about the problem, and we'll assist you within 24 hours."
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Getting Started with Minterviewer",
      duration: "5:32",
      views: "2.3K",
      thumbnail: "🎯",
      category: "Beginner"
    },
    {
      id: 2,
      title: "Mastering Technical Interviews",
      duration: "12:45",
      views: "5.8K",
      thumbnail: "💻",
      category: "Advanced"
    },
    {
      id: 3,
      title: "Setting Up Your Goals",
      duration: "7:18",
      views: "1.9K",
      thumbnail: "🎯",
      category: "Intermediate"
    },
    {
      id: 4,
      title: "Understanding Performance Metrics",
      duration: "9:24",
      views: "3.2K",
      thumbnail: "📊",
      category: "Intermediate"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete User Guide",
      description: "Comprehensive documentation covering all features",
      icon: BookOpen,
      size: "2.4 MB",
      type: "PDF"
    },
    {
      id: 2,
      title: "Interview Best Practices",
      description: "Tips and strategies from industry experts",
      icon: Lightbulb,
      size: "1.8 MB",
      type: "PDF"
    },
    {
      id: 3,
      title: "Keyboard Shortcuts",
      description: "Speed up your workflow with shortcuts",
      icon: Zap,
      size: "512 KB",
      type: "PDF"
    },
    {
      id: 4,
      title: "API Documentation",
      description: "For developers integrating with Minterviewer",
      icon: FileText,
      size: "3.1 MB",
      type: "PDF"
    }
  ];

  const supportStats = [
    { label: "Avg Response Time", value: "< 2 hours", icon: Clock, color: "text-teal-300" },
    { label: "Satisfaction Rate", value: "98%", icon: Star, color: "text-amber-400" },
    { label: "Articles", value: "150+", icon: BookOpen, color: "text-violet-400" },
    { label: "Active Users", value: "10K+", icon: Users, color: "text-emerald-400" }
  ];

  const filteredFaqs = faqs.filter(faq => 
    searchQuery === "" || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${isDark ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}`}>
            <HelpCircle className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
          </div>
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{fontWeight: 700}}>Help & Support ❓</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>We're here to help you succeed</p>
          </div>
        </div>
        <div className={`h-1 w-[200px] rounded-full ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {supportStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-6 backdrop-blur-sm transition-all ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]" : "bg-white shadow-lg border-[#ddd6fe] hover:shadow-xl hover:border-[#a855f7]"} border`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={stat.color} size={24} />
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className={`rounded-xl p-8 backdrop-blur-sm text-center ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
          <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>How can we help you today?</h2>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} mb-6`}>Search our knowledge base or browse categories below</p>
          <div className="relative max-w-2xl mx-auto">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-[#6a7282]" : "text-purple-400"}`} size={20} />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-6 text-base ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              className={`border ${link.borderColor} rounded-xl p-6 backdrop-blur-sm transition-all text-left group ${isDark ? `bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] hover:border-[rgba(94,234,212,0.4)] hover:shadow-lg hover:shadow-teal-500/10` : `bg-white shadow-md hover:shadow-xl hover:border-purple-400`}`}
            >
              <div className={`w-12 h-12 rounded-lg ${link.bgColor} border ${link.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={link.color} size={24} />
              </div>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>{link.title}</h3>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{link.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className={`mb-6 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)]" : "bg-white border-[#ddd6fe] shadow-sm"} border`}>
          <TabsTrigger value="faq" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold text-[#6b21a8]"}>
            <HelpCircle size={16} className="mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutorials" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold text-[#6b21a8]"}>
            <Video size={16} className="mr-2" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="resources" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold text-[#6b21a8]"}>
            <BookOpen size={16} className="mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="contact" className={isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300" : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold text-[#6b21a8]"}>
            <MessageCircle size={16} className="mr-2" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Frequently Asked Questions</h3>
            
            {Object.keys(faqsByCategory).length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className={isDark ? "text-[#99a1af]" : "text-purple-300"} size={48} />
                <p className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold mt-4`}>No results found</p>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>Try adjusting your search query</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"}>
                        {category}
                      </Badge>
                      <span className={`text-sm ${isDark ? "text-[#6a7282]" : "text-purple-500"}`}>
                        {categoryFaqs.length} {categoryFaqs.length === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                    <Accordion type="single" collapsible className="space-y-2">
                      {categoryFaqs.map((faq) => (
                        <AccordionItem 
                          key={faq.id} 
                          value={faq.id}
                          className={`border rounded-lg px-5 ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] data-[state=open]:border-[rgba(94,234,212,0.3)]" : "bg-purple-50 border-purple-200 data-[state=open]:border-purple-400"}`}
                        >
                          <AccordionTrigger className={`py-4 hover:no-underline ${isDark ? "text-white hover:text-teal-300" : "text-[#2e1065] hover:text-purple-700"}`}>
                            <div className="flex items-start gap-3 text-left">
                              <HelpCircle className={`shrink-0 mt-1 ${isDark ? "text-teal-400" : "text-purple-600"}`} size={18} />
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className={`pb-4 pl-9 leading-relaxed ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}`}>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Video Tutorials Tab */}
        <TabsContent value="tutorials">
          <div className="grid grid-cols-2 gap-6">
            {videoTutorials.map((video) => (
              <div
                key={video.id}
                className={`border rounded-xl overflow-hidden backdrop-blur-sm transition-all group ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)] hover:shadow-lg hover:shadow-teal-500/10" : "bg-white shadow-md border-purple-200 hover:shadow-xl hover:border-purple-400"}`}
              >
                {/* Thumbnail */}
                <div className={`relative h-48 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20" : "bg-gradient-to-br from-purple-100 to-pink-100"}`}>
                  <div className="text-6xl mb-4">{video.thumbnail}</div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isDark ? "bg-teal-400 shadow-teal-500/50" : "bg-purple-600 shadow-purple-500/50"}`}>
                      <Play className={isDark ? "text-[#0a0f1e]" : "text-white"} size={28} fill="currentColor" />
                    </div>
                  </button>
                  <Badge className="absolute top-3 right-3 bg-black/60 text-white border-none">
                    {video.duration}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex-1 font-semibold`}>{video.title}</h4>
                    <Badge className={`ml-3 ${isDark ? "bg-violet-500/20 text-violet-300 border-violet-500/30" : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"}`}>
                      {video.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-4 text-xs ${isDark ? "text-[#99a1af]" : "text-purple-500"}`}>
                      <div className="flex items-center gap-1">
                        <Play size={12} />
                        <span>{video.views} views</span>
                      </div>
                    </div>
                    <Button className={`h-8 text-xs ${isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold"}`}>
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Downloadable Resources</h3>
            <div className="space-y-3">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.id}
                    className={`flex items-center justify-between p-5 rounded-lg border transition-all group ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${isDark ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border-teal-500/30" : "bg-purple-100 border-purple-300"}`}>
                        <Icon className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
                      </div>
                      <div>
                        <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{resource.title}</h4>
                        <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{resource.description}</p>
                        <div className={`flex items-center gap-3 mt-2 text-xs ${isDark ? "text-[#6a7282]" : "text-purple-500"}`}>
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button className={isDark ? "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-2 border-teal-400/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10" : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold"}>
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-3 gap-6">
            {/* Contact Form */}
            <div className={`col-span-2 rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
              <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Send us a message</h3>
              <div className="space-y-4">
                <div>
                  <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Subject</label>
                  <Input
                    placeholder="What do you need help with?"
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                </div>
                <div>
                  <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Message</label>
                  <Textarea
                    placeholder="Describe your issue or question in detail..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className={`min-h-[200px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                  />
                </div>
                <Button className={`w-full ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}>
                  <Send size={16} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]" : "bg-white shadow-lg border-[#ddd6fe]"} border`}>
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-4 font-semibold`}>Other Ways to Reach Us</h3>
                <div className="space-y-4">
                  <button className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100"}`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Mail className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <p className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-medium`}>Email Support</p>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-purple-600"} text-xs`}>support@minterviewer.com</p>
                    </div>
                  </button>

                  <button className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100"}`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <MessageCircle className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <p className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-medium`}>Live Chat</p>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-purple-600"} text-xs`}>Available 24/7</p>
                    </div>
                  </button>

                  <button className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100"}`}>
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <Users className="text-violet-400" size={20} />
                    </div>
                    <div>
                      <p className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-medium`}>Community Forum</p>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-purple-600"} text-xs`}>Get help from peers</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className={`rounded-xl p-6 backdrop-blur-sm ${isDark ? "bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/30" : "bg-green-50 border-green-300"} border`}>
                <CheckCircle2 className={isDark ? "text-teal-400" : "text-green-600"} size={32} />
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 mt-3 font-semibold`}>Quick Response Guaranteed</h4>
                <p className={`${isDark ? "text-[#99a1af]" : "text-green-700"} text-sm`}>
                  Our support team typically responds within 2 hours during business hours.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

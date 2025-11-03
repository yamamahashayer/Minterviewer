import { useState } from "react";
import { 
  MessageSquare,
  Search,
  Send,
  Star,
  Archive,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  ThumbsUp,
  Clock,
  Filter,
  MoreVertical,
  Bot,
  User as UserIcon
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Message {
  id: number;
  from: string;
  fromType: "ai" | "system";
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  category: "feedback" | "achievement" | "reminder" | "tip";
  priority: "high" | "normal" | "low";
}

export default function MessagesPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  const messages: Message[] = [
    {
      id: 1,
      from: "AI Coach Sarah",
      fromType: "ai",
      subject: "Great Progress on Technical Interview!",
      preview: "You've shown excellent improvement in your technical interview skills...",
      content: "Hi Yamamah,\n\nCongratulations on your recent technical interview performance! You scored 9.2/10, which is a significant improvement from your previous sessions.\n\nKey Strengths:\n• Excellent problem-solving approach\n• Clear communication of your thought process\n• Strong understanding of data structures\n\nAreas for Growth:\n• Consider optimizing time complexity further\n• Practice edge case identification\n\nKeep up the great work!\n\nBest regards,\nAI Coach Sarah",
      timestamp: "2 hours ago",
      read: false,
      starred: true,
      category: "feedback",
      priority: "high"
    },
    {
      id: 2,
      from: "Minterviewer System",
      fromType: "system",
      subject: "New Achievement Unlocked: Top Performer",
      preview: "Congratulations! You've unlocked a new achievement...",
      content: "Congratulations Yamamah!\n\nYou've unlocked the 'Top Performer' achievement for ranking in the top 10% of all users this month.\n\nReward: 300 points added to your profile\n\nKeep practicing to maintain your ranking and unlock more achievements!",
      timestamp: "5 hours ago",
      read: false,
      starred: false,
      category: "achievement",
      priority: "normal"
    },
    {
      id: 3,
      from: "AI Coach Mike",
      fromType: "ai",
      subject: "System Design Session Feedback",
      preview: "Your system design session showed strong architectural thinking...",
      content: "Hello Yamamah,\n\nThank you for completing the e-commerce platform system design session.\n\nScore: 8.8/10\n\nHighlights:\n• Excellent scalability considerations\n• Good database choice justification\n• Clear component architecture\n\nSuggestions:\n• Dive deeper into caching strategies\n• Consider load balancing implementation\n• Discuss monitoring and alerting systems\n\nI recommend practicing more distributed system scenarios.\n\nRegards,\nAI Coach Mike",
      timestamp: "1 day ago",
      read: true,
      starred: false,
      category: "feedback",
      priority: "normal"
    },
    {
      id: 4,
      from: "Minterviewer System",
      fromType: "system",
      subject: "Reminder: Scheduled Interview Today",
      preview: "You have a technical interview scheduled for today at 10:00 AM...",
      content: "Hi Yamamah,\n\nThis is a reminder about your upcoming interview:\n\nTechnical Interview Practice\nTime: Today, 10:00 AM\nDuration: 60 minutes\nFocus: Data Structures and Algorithms\n\nMake sure to:\n• Join 5 minutes early\n• Have your workspace ready\n• Review common algorithm patterns\n\nGood luck!",
      timestamp: "1 day ago",
      read: true,
      starred: false,
      category: "reminder",
      priority: "high"
    },
    {
      id: 5,
      from: "AI Coach Emma",
      fromType: "ai",
      subject: "Behavioral Interview Tips",
      preview: "Here are some tips to improve your STAR method responses...",
      content: "Hi Yamamah,\n\nBased on your recent behavioral interview practice, here are some personalized tips:\n\n1. STAR Method Enhancement:\n   - Spend more time on the 'Result' section\n   - Quantify your achievements when possible\n   - Keep examples concise (2-3 minutes)\n\n2. Common Improvements:\n   - Prepare 5-7 versatile stories\n   - Practice transitioning between topics\n   - Show growth mindset in challenges\n\n3. Recommended Practice:\n   - Leadership scenarios\n   - Conflict resolution examples\n   - Innovation and initiative stories\n\nSchedule a follow-up session to practice these!\n\nBest,\nAI Coach Emma",
      timestamp: "2 days ago",
      read: true,
      starred: true,
      category: "tip",
      priority: "normal"
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feedback": return ThumbsUp;
      case "achievement": return Star;
      case "reminder": return Clock;
      case "tip": return Info;
      default: return MessageSquare;
    }
  };

  const getCategoryColor = (category: string) => {
    if (isDark) {
      switch (category) {
        case "feedback": return "text-teal-400";
        case "achievement": return "text-amber-400";
        case "reminder": return "text-violet-400";
        case "tip": return "text-emerald-400";
        default: return "text-gray-400";
      }
    } else {
      switch (category) {
        case "feedback": return "text-purple-600";
        case "achievement": return "text-orange-600";
        case "reminder": return "text-pink-600";
        case "tip": return "text-green-600";
        default: return "text-gray-600";
      }
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (isDark) {
      switch (priority) {
        case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
        case "low": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      }
    } else {
      switch (priority) {
        case "high": return "bg-red-100 text-red-700 border-red-300 font-semibold";
        case "low": return "bg-blue-100 text-blue-700 border-blue-300 font-semibold";
        default: return "bg-gray-100 text-gray-700 border-gray-300 font-semibold";
      }
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read).length;
  const starredMessages = messages.filter(m => m.starred);

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Messages & Feedback 💬</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Communication from AI coaches and system updates</p>
          </div>
          <Badge className={isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"}>
            {unreadCount} Unread
          </Badge>
        </div>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Messages List */}
        <div className={`col-span-1 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl overflow-hidden backdrop-blur-sm`}>
          {/* Search */}
          <div className={`p-4 border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#6a7282]" : "text-purple-400"}`} size={16} />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className={`w-full bg-transparent border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} rounded-none p-0`}>
              <TabsTrigger 
                value="all" 
                className={`flex-1 rounded-none border-b-2 border-transparent ${isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300" : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"}`}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className={`flex-1 rounded-none border-b-2 border-transparent ${isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300" : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"}`}
              >
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger 
                value="starred" 
                className={`flex-1 rounded-none border-b-2 border-transparent ${isDark ? "data-[state=active]:bg-[rgba(94,234,212,0.1)] data-[state=active]:text-teal-300 data-[state=active]:border-teal-300" : "data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"}`}
              >
                Starred
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => {
                  const CategoryIcon = getCategoryIcon(message.category);
                  return (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full text-left p-4 border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} ${isDark ? "hover:bg-[rgba(94,234,212,0.05)]" : "hover:bg-purple-50"} transition-all ${
                        selectedMessage?.id === message.id ? (isDark ? 'bg-[rgba(94,234,212,0.1)]' : 'bg-purple-100') : ''
                      } ${!message.read ? (isDark ? 'bg-[rgba(94,234,212,0.03)]' : 'bg-purple-50/50') : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className={isDark ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"}>
                            {message.fromType === "ai" ? <Bot size={18} /> : "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm truncate font-medium ${!message.read ? (isDark ? 'text-white' : 'text-[#2e1065]') : (isDark ? 'text-[#d1d5dc]' : 'text-[#6b21a8]')}`}>
                              {message.from}
                            </h4>
                            {message.starred && <Star className={isDark ? "text-amber-400 fill-amber-400" : "text-orange-500 fill-orange-500"} size={14} />}
                          </div>
                          <p className={`text-sm mb-1 truncate ${!message.read ? (isDark ? 'text-white' : 'text-[#2e1065]') : (isDark ? 'text-[#99a1af]' : 'text-[#6b21a8]')}`}>
                            {message.subject}
                          </p>
                          <p className={`text-xs truncate mb-2 ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>{message.preview}</p>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className={`${getCategoryColor(message.category)}`} size={12} />
                            <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>{message.timestamp}</span>
                            {!message.read && (
                              <div className={`w-2 h-2 rounded-full ${isDark ? "bg-teal-400" : "bg-purple-600"} ml-auto`} />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredMessages.filter(m => !m.read).map((message) => {
                  const CategoryIcon = getCategoryIcon(message.category);
                  return (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full text-left p-4 border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} ${isDark ? "hover:bg-[rgba(94,234,212,0.05)]" : "hover:bg-purple-50"} transition-all ${
                        selectedMessage?.id === message.id ? (isDark ? 'bg-[rgba(94,234,212,0.1)]' : 'bg-purple-100') : (isDark ? 'bg-[rgba(94,234,212,0.03)]' : 'bg-purple-50/50')
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className={isDark ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"}>
                            {message.fromType === "ai" ? <Bot size={18} /> : "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm truncate font-medium ${isDark ? "text-white" : "text-[#2e1065]"}`}>{message.from}</h4>
                            {message.starred && <Star className={isDark ? "text-amber-400 fill-amber-400" : "text-orange-500 fill-orange-500"} size={14} />}
                          </div>
                          <p className={`text-sm mb-1 truncate ${isDark ? "text-white" : "text-[#2e1065]"}`}>{message.subject}</p>
                          <p className={`text-xs truncate mb-2 ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>{message.preview}</p>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className={getCategoryColor(message.category)} size={12} />
                            <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>{message.timestamp}</span>
                            <div className={`w-2 h-2 rounded-full ${isDark ? "bg-teal-400" : "bg-purple-600"} ml-auto`} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="starred" className="mt-0">
              <div className="max-h-[600px] overflow-y-auto">
                {starredMessages.map((message) => {
                  const CategoryIcon = getCategoryIcon(message.category);
                  return (
                    <button
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full text-left p-4 border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} ${isDark ? "hover:bg-[rgba(94,234,212,0.05)]" : "hover:bg-purple-50"} transition-all ${
                        selectedMessage?.id === message.id ? (isDark ? 'bg-[rgba(94,234,212,0.1)]' : 'bg-purple-100') : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className={isDark ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"}>
                            {message.fromType === "ai" ? <Bot size={18} /> : "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm truncate font-medium ${isDark ? "text-white" : "text-[#2e1065]"}`}>{message.from}</h4>
                            <Star className={isDark ? "text-amber-400 fill-amber-400" : "text-orange-500 fill-orange-500"} size={14} />
                          </div>
                          <p className={`text-sm mb-1 truncate ${isDark ? "text-white" : "text-[#2e1065]"}`}>{message.subject}</p>
                          <p className={`text-xs truncate mb-2 ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>{message.preview}</p>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className={getCategoryColor(message.category)} size={12} />
                            <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Detail */}
        <div className={`col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl overflow-hidden backdrop-blur-sm`}>
          {selectedMessage ? (
            <div className="flex flex-col h-[700px]">
              {/* Message Header */}
              <div className={`p-6 border-b ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={isDark ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"}>
                        {selectedMessage.fromType === "ai" ? <Bot size={20} /> : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{selectedMessage.from}</h3>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{selectedMessage.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className={isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]" : "text-purple-600 hover:bg-purple-100"}>
                      <Star className={selectedMessage.starred ? (isDark ? "fill-amber-400 text-amber-400" : "fill-orange-500 text-orange-500") : ""} size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className={isDark ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]" : "text-purple-600 hover:bg-purple-100"}>
                      <Archive size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className={isDark ? "text-red-400 hover:bg-[rgba(220,38,38,0.1)]" : "text-red-600 hover:bg-red-100"}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>{selectedMessage.subject}</h2>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityBadge(selectedMessage.priority)}>
                    {selectedMessage.priority}
                  </Badge>
                  <Badge className={`${getCategoryColor(selectedMessage.category)} ${isDark ? "bg-[rgba(94,234,212,0.1)] border-[rgba(94,234,212,0.2)]" : "bg-purple-50 border-purple-300"}`}>
                    {selectedMessage.category}
                  </Badge>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} whitespace-pre-line leading-relaxed`}>
                  {selectedMessage.content}
                </div>
              </div>

              {/* Reply Section */}
              <div className={`p-6 border-t ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className={`mb-3 min-h-[100px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}>
                    Cancel
                  </Button>
                  <Button className={`${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white`}>
                    <Send size={16} className="mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[700px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className={isDark ? "text-[#6a7282]" : "text-purple-300"} size={64} />
                <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-2 font-semibold`}>No message selected</h3>
                <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Select a message from the list to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

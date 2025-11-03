import { useState } from "react";
import { 
  Users,
  Star,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  Video,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp,
  Target,
  Code,
  Briefcase,
  BookOpen,
  ThumbsUp
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function MentorsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("all");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      avatar: "SC",
      expertise: ["Technical", "System Design", "Algorithms"],
      rating: 4.9,
      reviews: 156,
      sessions: 320,
      responseTime: "< 2 hours",
      rate: "$80/hour",
      availability: "Available",
      bio: "10+ years of experience in software engineering. Specialized in helping candidates prepare for FAANG interviews.",
      achievements: ["FAANG Interviewer", "500+ Success Stories", "Top Rated"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Engineering Manager",
      company: "Meta",
      avatar: "MR",
      expertise: ["Behavioral", "Leadership", "Career Growth"],
      rating: 4.8,
      reviews: 203,
      sessions: 450,
      responseTime: "< 1 hour",
      rate: "$100/hour",
      availability: "Available",
      bio: "Former Tech Lead at multiple startups, now leading engineering teams at Meta. Expert in behavioral interviews and career development.",
      achievements: ["Leadership Expert", "Career Coach", "Verified"]
    },
    {
      id: 3,
      name: "Emily Thompson",
      title: "Principal Engineer",
      company: "Amazon",
      avatar: "ET",
      expertise: ["System Design", "Architecture", "Scalability"],
      rating: 4.9,
      reviews: 187,
      sessions: 380,
      responseTime: "< 3 hours",
      rate: "$120/hour",
      availability: "Busy",
      bio: "15 years designing large-scale distributed systems. Passionate about mentoring engineers on system design fundamentals.",
      achievements: ["System Design Pro", "AWS Certified", "Top Rated"]
    },
    {
      id: 4,
      name: "David Kim",
      title: "Staff Software Engineer",
      company: "Apple",
      avatar: "DK",
      expertise: ["Technical", "iOS", "Mobile Development"],
      rating: 4.7,
      reviews: 142,
      sessions: 290,
      responseTime: "< 4 hours",
      rate: "$90/hour",
      availability: "Available",
      bio: "iOS development expert with deep knowledge of Swift, SwiftUI, and mobile architecture patterns.",
      achievements: ["Mobile Expert", "Apple Insider", "Top Contributor"]
    },
    {
      id: 5,
      name: "Jessica Park",
      title: "Tech Lead",
      company: "Netflix",
      avatar: "JP",
      expertise: ["Frontend", "React", "Performance"],
      rating: 4.8,
      reviews: 198,
      sessions: 410,
      responseTime: "< 2 hours",
      rate: "$85/hour",
      availability: "Available",
      bio: "Frontend architect specializing in React, performance optimization, and scalable UI systems.",
      achievements: ["Frontend Master", "React Expert", "Verified"]
    },
    {
      id: 6,
      name: "Alex Johnson",
      title: "VP of Engineering",
      company: "Stripe",
      avatar: "AJ",
      expertise: ["Leadership", "Strategy", "Executive"],
      rating: 4.9,
      reviews: 95,
      sessions: 180,
      responseTime: "< 24 hours",
      rate: "$150/hour",
      availability: "Limited",
      bio: "Executive leader with experience scaling engineering teams from 10 to 200+. Focus on leadership and strategic growth.",
      achievements: ["Executive Coach", "Scaling Expert", "Top Rated"]
    }
  ];

  const stats = [
    { label: "Available Mentors", value: "150+", icon: Users, color: "text-teal-400" },
    { label: "Avg Rating", value: "4.8/5", icon: Star, color: "text-amber-400" },
    { label: "Total Sessions", value: "5,000+", icon: Video, color: "text-violet-400" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-emerald-400" }
  ];

  const expertiseFilters = [
    { id: "all", label: "All" },
    { id: "technical", label: "Technical" },
    { id: "behavioral", label: "Behavioral" },
    { id: "system-design", label: "System Design" },
    { id: "leadership", label: "Leadership" },
    { id: "career", label: "Career Growth" }
  ];

  const handleBookSession = (mentor: any) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleWriteReview = (mentor: any) => {
    setSelectedMentor(mentor);
    setShowReviewDialog(true);
  };

  const submitReview = () => {
    // Submit review logic
    setShowReviewDialog(false);
    setRating(0);
    setReviewText("");
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise === "all" || 
                            mentor.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase()));
    
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{marginBottom: "0.5rem", fontWeight: 700}}>Mentors & Experts 👥</h1>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Connect with industry experts for personalized guidance</p>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
            >
              <Icon className={isDark ? stat.color : "text-purple-600"} size={24} />
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mt-3 mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm mb-8`}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#6a7282]" : "text-[#a78bfa]"}`} size={18} />
            <Input
              placeholder="Search mentors by name, company, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
            />
          </div>
          <div className="flex gap-2">
            {expertiseFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedExpertise(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedExpertise === filter.id
                    ? (isDark ? "bg-teal-500/20 text-teal-300 border-2 border-teal-500/50" : "bg-purple-100 text-purple-700 border-2 border-purple-500")
                    : (isDark ? "bg-[rgba(255,255,255,0.05)] text-[#99a1af] border border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]" : "bg-white text-[#6b21a8] border border-[#ddd6fe] hover:border-[#a855f7]")
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className={`${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${isDark ? "hover:border-[rgba(94,234,212,0.4)] hover:shadow-teal-500/10" : "hover:border-[#a855f7] hover:shadow-xl"} transition-all`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className={`w-16 h-16 border-2 ${isDark ? "border-teal-500/30" : "border-purple-300"}`}>
                <AvatarFallback className={`bg-gradient-to-br ${isDark ? "from-teal-500/20 to-emerald-500/20 text-teal-300" : "from-purple-100 to-pink-100 text-purple-600"} text-lg font-semibold`}>
                  {mentor.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{mentor.name}</h3>
                    <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{mentor.title}</p>
                  </div>
                  <Badge className={
                    mentor.availability === "Available" ? (isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-green-100 text-green-700 border-green-300 font-semibold") :
                    mentor.availability === "Busy" ? (isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-orange-100 text-orange-700 border-orange-300 font-semibold") :
                    (isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-700 border-red-300 font-semibold")
                  }>
                    {mentor.availability}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={14} className={isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} />
                  <span className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{mentor.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className={isDark ? "text-amber-400 fill-amber-400" : "text-orange-500 fill-orange-500"} size={14} />
                    <span className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-semibold`}>{mentor.rating}</span>
                    <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>({mentor.reviews})</span>
                  </div>
                  <span className={`${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"} text-xs`}>•</span>
                  <span className={`${isDark ? "text-teal-300" : "text-purple-600"} text-sm font-medium`}>{mentor.sessions} sessions</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-4 line-clamp-2`}>{mentor.bio}</p>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.expertise.map((skill, idx) => (
                <Badge
                  key={idx}
                  className={isDark ? "bg-teal-500/10 text-teal-300 border-teal-500/30 text-xs" : "bg-purple-100 text-purple-700 border-purple-300 text-xs font-medium"}
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Achievements */}
            <div className="flex items-center gap-2 mb-4">
              {mentor.achievements.map((achievement, idx) => (
                <Badge
                  key={idx}
                  className={isDark ? "bg-violet-500/10 text-violet-300 border-violet-500/30 text-xs" : "bg-pink-100 text-pink-700 border-pink-300 text-xs font-medium"}
                >
                  <Award size={10} className="mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 gap-3 mb-4 py-3 border-y ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
              <div>
                <div className={`flex items-center gap-2 ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs mb-1`}>
                  <Clock size={12} />
                  <span>Response Time</span>
                </div>
                <p className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-semibold`}>{mentor.responseTime}</p>
              </div>
              <div>
                <div className={`flex items-center gap-2 ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs mb-1`}>
                  <Target size={12} />
                  <span>Rate</span>
                </div>
                <p className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm font-semibold`}>{mentor.rate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => handleBookSession(mentor)}
                className={`flex-1 ${isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}`}
                disabled={mentor.availability === "Limited"}
              >
                <Calendar size={16} className="mr-2" />
                Book Session
              </Button>
              <Button
                onClick={() => handleWriteReview(mentor)}
                className={`flex-1 ${isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}`}
              >
                <Star size={16} className="mr-2" />
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className={`${isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-[#2e1065]"}>Book Session with {selectedMentor?.name}</DialogTitle>
            <DialogDescription className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
              Choose a time slot for your mentoring session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Select Date</label>
              <Input
                type="date"
                className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
              />
            </div>
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Select Time</label>
              <select className={`w-full ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"} border rounded-md p-2`}>
                <option>9:00 AM - 10:00 AM</option>
                <option>10:00 AM - 11:00 AM</option>
                <option>2:00 PM - 3:00 PM</option>
                <option>3:00 PM - 4:00 PM</option>
                <option>4:00 PM - 5:00 PM</option>
              </select>
            </div>
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Session Type</label>
              <select className={`w-full ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"} border rounded-md p-2`}>
                <option>Mock Interview</option>
                <option>Resume Review</option>
                <option>Career Advice</option>
                <option>Technical Guidance</option>
              </select>
            </div>
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Additional Notes (Optional)</label>
              <Textarea
                placeholder="What would you like to focus on?"
                className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowBookingDialog(false)}
              className={isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}
            >
              Cancel
            </Button>
            <Button className={isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}>
              <CheckCircle2 size={16} className="mr-2" />
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className={`${isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-[#2e1065]"}>Write a Review for {selectedMentor?.name}</DialogTitle>
            <DialogDescription className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
              Share your experience to help others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-3 block font-medium`}>Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? (isDark ? "text-amber-400 fill-amber-400" : "text-orange-500 fill-orange-500") : (isDark ? "text-[#6a7282]" : "text-[#ddd6fe]")}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} text-sm mb-2 block font-medium`}>Your Review</label>
              <Textarea
                placeholder="Share your experience with this mentor..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className={`min-h-[120px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowReviewDialog(false)}
              className={isDark ? "bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)]" : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitReview}
              className={isDark ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"}
              disabled={rating === 0}
            >
              <ThumbsUp size={16} className="mr-2" />
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

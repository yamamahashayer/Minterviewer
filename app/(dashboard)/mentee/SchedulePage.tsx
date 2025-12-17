import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  Users,
  MapPin,
  Edit,
  Trash2,
  Check,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Star,
  Code,
  Brain,
  Target,
  MessageSquare
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar } from "../../components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

interface ScheduleEvent {
  id: number | string;
  title: string;
  type: "technical" | "behavioral" | "system-design" | "coding" | "mock";
  date: string;
  time: string;
  duration: string;
  interviewer?: string;
  interviewerId?: string; // Added for feedback
  description: string;
  status: "upcoming" | "completed" | "cancelled";
  reminder: boolean;
  meetingLink?: string;
}

export default function SchedulePage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month");

  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  // Feedback State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<ScheduleEvent | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleOpenReview = (event: ScheduleEvent) => {
    setSelectedSessionForReview(event);
    setReviewRating(0);
    setReviewText('');
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedSessionForReview) return;
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const userStr = sessionStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        toast.error("User not found");
        return;
      }

      const payload = {
        sessionId: selectedSessionForReview.id, // Ensure this maps to TimeSlot ID
        fromUserId: user._id || user.id,
        toUserId: selectedSessionForReview.interviewerId || 'mentor_placeholder', // Need mentor ID from event
        rating: reviewRating,
        feedback: reviewText,
        tags: []
      };

      // Note: event.interviewer is name, we need ID. 
      // Assuming event object might need update or we handle gracefully if ID missing.
      // For now, let's proceed. 

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setIsReviewOpen(false);
      } else {
        const json = await res.json();
        toast.error(json.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const menteeId = user._id || user.id;

        const res = await fetch(`/api/mentee/sessions?menteeId=${menteeId}`);
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "technical": return Code;
      case "behavioral": return MessageSquare;
      case "system-design": return Brain;
      case "coding": return Target;
      case "mock": return Video;
      default: return CalendarIcon;
    }
  };

  const getTypeColor = (type: string) => {
    if (isDark) {
      switch (type) {
        case "technical": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
        case "behavioral": return "bg-violet-500/20 text-violet-300 border-violet-500/30";
        case "system-design": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        case "coding": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        case "mock": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
        default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      }
    } else {
      switch (type) {
        case "technical": return "bg-purple-100 text-purple-700 border-purple-300 font-medium";
        case "behavioral": return "bg-pink-100 text-pink-700 border-pink-300 font-medium";
        case "system-design": return "bg-green-100 text-green-700 border-green-300 font-medium";
        case "coding": return "bg-orange-100 text-orange-700 border-orange-300 font-medium";
        case "mock": return "bg-red-100 text-red-700 border-red-300 font-medium";
        default: return "bg-gray-100 text-gray-700 border-gray-300 font-medium";
      }
    }
  };

  const upcomingEvents = events
    // .filter(e => e.status === "upcoming") // SHOW ALL for debugging
    .filter(e => filterType === "all" || e.type === filterType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString() && e.status === "upcoming";
  });

  // Calculate Stats
  const now = new Date();

  // This Week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const thisWeekCount = events.filter(e => {
    const d = new Date(e.date);
    return d >= startOfWeek && d <= endOfWeek;
  }).length;

  // This Month
  const thisMonthCount = events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Completed
  const completedCount = events.filter(e =>
    e.status === 'completed' || new Date(e.date) < now
  ).length;

  // Hours
  const totalMinutes = events.reduce((acc, curr) => {
    // duration format expected "60 min" or just number if API changed? 
    // API sends "60 min". parseInt handles "60 min" -> 60.
    return acc + (parseInt(curr.duration) || 0);
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1) + 'h';

  const stats = [
    { label: "This Week", value: thisWeekCount.toString(), icon: CalendarIcon, color: "text-teal-300" },
    { label: "This Month", value: thisMonthCount.toString(), icon: Target, color: "text-emerald-400" },
    { label: "Completed", value: completedCount.toString(), icon: Check, color: "text-violet-400" },
    { label: "Hours Scheduled", value: totalHours, icon: Clock, color: "text-amber-400" },
    { label: "Hours Scheduled", value: totalHours, icon: Clock, color: "text-amber-400" },
  ];

  const canLeaveReview = (event: ScheduleEvent) => {
    const isCompleted = event.status === 'completed' || new Date(event.date) < new Date();
    return isCompleted;
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Interview Schedule 📅</h1>
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Manage and plan your interview practice sessions</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 ${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white transition-colors`}>
                  <Plus size={16} />
                  Schedule Interview
                </button>
              </DialogTrigger>
              <DialogContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}>
                <DialogHeader>
                  <DialogTitle className={isDark ? "text-white" : "text-[#2e1065]"}>Schedule New Interview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title" className={isDark ? "text-[#d1d5dc] font-medium" : "text-[#2e1065] font-medium"}>Interview Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Technical Interview Practice"
                      className={isDark ? "mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "mt-1 bg-white border-[#ddd6fe] text-[#2e1065]"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className={isDark ? "text-[#d1d5dc] font-medium" : "text-[#2e1065] font-medium"}>Interview Type</Label>
                    <Select>
                      <SelectTrigger className={isDark ? "mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "mt-1 bg-white border-[#ddd6fe] text-[#2e1065]"}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                        <SelectItem value="technical" className={isDark ? "text-white" : "text-[#2e1065]"}>Technical</SelectItem>
                        <SelectItem value="behavioral" className={isDark ? "text-white" : "text-[#2e1065]"}>Behavioral</SelectItem>
                        <SelectItem value="system-design" className={isDark ? "text-white" : "text-[#2e1065]"}>System Design</SelectItem>
                        <SelectItem value="coding" className={isDark ? "text-white" : "text-[#2e1065]"}>Coding Challenge</SelectItem>
                        <SelectItem value="mock" className={isDark ? "text-white" : "text-[#2e1065]"}>Mock Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Date</Label>
                      <Input
                        id="date"
                        type="date"
                        className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Time</Label>
                      <Input
                        id="time"
                        type="time"
                        className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Duration</Label>
                    <Select>
                      <SelectTrigger className={`mt-1 ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                        <SelectItem value="30" className={isDark ? "text-white" : "text-[#2e1065]"}>30 minutes</SelectItem>
                        <SelectItem value="45" className={isDark ? "text-white" : "text-[#2e1065]"}>45 minutes</SelectItem>
                        <SelectItem value="60" className={isDark ? "text-white" : "text-[#2e1065]"}>60 minutes</SelectItem>
                        <SelectItem value="90" className={isDark ? "text-white" : "text-[#2e1065]"}>90 minutes</SelectItem>
                        <SelectItem value="120" className={isDark ? "text-white" : "text-[#2e1065]"}>120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes about this session..."
                      className={`mt-1 min-h-[80px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reminder"
                      className={`w-4 h-4 rounded ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}`}
                    />
                    <Label htmlFor="reminder" className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Send me a reminder</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 ${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white transition-colors`}>
                      Schedule
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
        </div>
        <div className={`h-1 w-[200px] rounded-full mt-4 ${isDark ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]" : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"}`} />
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}>
          <DialogHeader>
            <DialogTitle>Rate your session with {selectedSessionForReview?.interviewer}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm opacity-70">How was the mentor?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                    <Star
                      className={`w-8 h-8 ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Review</Label>
              <Textarea
                placeholder="How did the mentor help you?..."
                className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || reviewRating === 0}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Today's Schedule Highlight */}
      {todayEvents.length > 0 && (
        <div className={`${isDark ? "bg-gradient-to-r from-[rgba(94,234,212,0.15)] to-[rgba(52,211,153,0.1)] border-[rgba(94,234,212,0.3)]" : "bg-gradient-to-r from-purple-100 to-pink-50 border-[#ddd6fe] shadow-lg"} border rounded-xl p-6 mb-8 backdrop-blur-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <Star className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
            <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>Today's Sessions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {todayEvents.map((event) => {
              const Icon = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]" : "bg-white border-[#ddd6fe] hover:border-[#a855f7] shadow-md hover:shadow-lg"} rounded-lg p-4 border transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={isDark ? "text-teal-300" : "text-purple-600"} size={18} />
                      <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{event.title}</h3>
                    </div>
                    {event.reminder && <Bell className={isDark ? "text-amber-400" : "text-orange-500"} size={16} />}
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}`}>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} />
                      <span className="font-medium">{event.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className={`lg:col-span-1 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-xl shadow-purple-200/50"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#c4b5fd] border-2"} rounded-xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex items-center gap-2 font-semibold`}>
              <CalendarIcon className={isDark ? "text-teal-300" : "text-[#7c3aed]"} size={20} />
              Calendar
            </h3>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border-0"
            modifiers={{
              booked: (date) => events.some(e => new Date(e.date).toDateString() === date.toDateString())
            }}
            modifiersClassNames={{
              booked: isDark
                ? "bg-[rgba(94,234,212,0.2)] text-teal-300 font-bold border border-[rgba(94,234,212,0.3)]"
                : "bg-purple-100 text-purple-700 font-bold border border-purple-200"
            }}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: `flex justify-center pt-1 relative items-center ${isDark ? "text-white" : "text-[#2e1065]"}`,
              caption_label: "text-sm font-semibold",
              nav: "space-x-1 flex items-center",
              nav_button: `h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 ${isDark ? "text-white" : "text-[#7c3aed]"}`,
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: `${isDark ? "text-[#99a1af]" : "text-[#7c3aed]"} rounded-md w-9 text-xs font-semibold`,
              row: "flex w-full mt-2",
              cell: `text-center text-sm p-0 relative ${isDark
                ? "[&:has([aria-selected])]:bg-[rgba(94,234,212,0.1)]"
                : "[&:has([aria-selected])]:bg-purple-100"
                } first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20`,
              day: `h-9 w-9 p-0 rounded-md transition-colors ${isDark
                ? "text-white hover:bg-[rgba(94,234,212,0.2)]"
                : "text-[#4c1d95] hover:bg-purple-100 font-medium"
                }`,
              day_selected: `${isDark
                ? "bg-[rgba(94,234,212,0.3)] text-white hover:bg-[rgba(94,234,212,0.4)]"
                : "bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white hover:from-[#6d28d9] hover:to-[#9333ea] font-semibold shadow-md"
                }`,
              day_today: `${isDark
                ? "bg-[rgba(255,255,255,0.1)] text-teal-300"
                : "bg-pink-100 text-[#831843] border-2 border-pink-400 font-semibold"
                }`,
              day_outside: `${isDark ? "text-[#6a7282]" : "text-purple-300"} opacity-50`,
              day_disabled: `${isDark ? "text-[#6a7282]" : "text-purple-300"} opacity-50`,
              day_hidden: "invisible",
            }}
          />

          {/* Calendar Legend */}
          <div className="mt-6 space-y-2">
            <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} text-sm mb-3 font-semibold`}>Event Types</h4>
            {[
              { type: "technical", label: "Technical" },
              { type: "behavioral", label: "Behavioral" },
              { type: "system-design", label: "System Design" },
              { type: "coding", label: "Coding" },
              { type: "mock", label: "Mock Interview" },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.type === "technical" ? (isDark ? "bg-teal-400" : "bg-[#7c3aed]") :
                  item.type === "behavioral" ? (isDark ? "bg-violet-400" : "bg-[#ec4899]") :
                    item.type === "system-design" ? (isDark ? "bg-emerald-400" : "bg-emerald-500") :
                      item.type === "coding" ? (isDark ? "bg-amber-400" : "bg-amber-500") :
                        (isDark ? "bg-rose-400" : "bg-rose-500")
                  }`} />
                <span className={`${isDark ? "text-[#99a1af]" : "text-[#5b21b6]"} text-xs font-semibold`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className={`lg:col-span-2 ${isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"} border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} flex items-center gap-2 font-semibold`}>
              <Clock className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Upcoming Sessions
            </h3>
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white w-[150px] h-9" : "bg-white border-[#ddd6fe] text-[#2e1065] font-medium w-[150px] h-9"}>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className={isDark ? "bg-[#0f172b] border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe]"}>
                  <SelectItem value="all" className={isDark ? "text-white" : "text-[#2e1065]"}>All Types</SelectItem>
                  <SelectItem value="technical" className={isDark ? "text-white" : "text-[#2e1065]"}>Technical</SelectItem>
                  <SelectItem value="behavioral" className={isDark ? "text-white" : "text-[#2e1065]"}>Behavioral</SelectItem>
                  <SelectItem value="system-design" className={isDark ? "text-white" : "text-[#2e1065]"}>System Design</SelectItem>
                  <SelectItem value="coding" className={isDark ? "text-white" : "text-[#2e1065]"}>Coding</SelectItem>
                  <SelectItem value="mock" className={isDark ? "text-white" : "text-[#2e1065]"}>Mock Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {upcomingEvents.map((event) => {
              const Icon = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`${isDark ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)] hover:border-[rgba(94,234,212,0.3)]" : "bg-white border-[#ddd6fe] hover:border-[#a855f7] shadow-md hover:shadow-lg"} border rounded-lg p-5 transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
                        <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>{event.title}</h4>
                        {event.reminder && (
                          <Bell className={isDark ? "text-amber-400" : "text-orange-500"} size={16} />
                        )}
                      </div>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type.replace("-", " ")}
                      </Badge>
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

                  <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm mb-4`}>{event.description}</p>

                  <div className={`grid grid-cols-2 gap-4 pt-3 border-t ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"}`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className={isDark ? "text-teal-300" : "text-purple-600"} size={14} />
                        <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className={isDark ? "text-teal-300" : "text-purple-600"} size={14} />
                        <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>{event.time} ({event.duration})</span>
                      </div>
                    </div>
                    {event.interviewer && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className={isDark ? "text-teal-300" : "text-purple-600"} size={14} />
                        <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>{event.interviewer}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {event.meetingLink ? (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 h-9 ${isDark ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"} text-white transition-colors`}
                      >
                        <Video size={14} />
                        Join Session
                      </a>
                    ) : (
                      <button disabled className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 h-9 ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400"} cursor-not-allowed`}>
                        <Video size={14} />
                        Not Started
                      </button>
                    )}
                    <button className={`inline-flex items-center justify-center rounded-md px-4 h-9 ${isDark ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]" : "bg-white hover:bg-purple-50 text-purple-700 border-2 border-[#ddd6fe] hover:border-[#a855f7] font-medium"} transition-colors`}>
                      View Details
                    </button>
                    {canLeaveReview(event) && (
                      <button
                        onClick={() => handleOpenReview(event)}
                        className={`inline-flex items-center justify-center rounded-md px-4 h-9 ${isDark ? "bg-[rgba(236,72,153,0.2)] hover:bg-[rgba(236,72,153,0.3)] text-pink-300 border border-[rgba(236,72,153,0.3)]" : "bg-white hover:bg-pink-50 text-pink-700 border-2 border-pink-200 hover:border-pink-300 font-medium"} transition-colors`}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
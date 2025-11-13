import { ThumbsUp, Star, Clock, Info, MessageSquare } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "feedback": return ThumbsUp;
    case "achievement": return Star;
    case "reminder": return Clock;
    case "tip": return Info;
    default: return MessageSquare;
  }
};

export const getCategoryColor = (category: string, isDark: boolean) => {
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

export const getPriorityBadge = (priority: string, isDark: boolean) => {
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

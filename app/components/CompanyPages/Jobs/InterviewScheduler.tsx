"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  User,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";

type Applicant = {
  _id: string;
  mentee: {
    _id: string;
    full_name: string;
    email: string;
    phoneNumber: string;
  };
  status: string;
};

type Job = {
  _id: string;
  title: string;
  interviewType: string;
};

type InterviewSlot = {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: "ai" | "human";
  applicantId?: string;
  status: "available" | "booked" | "completed";
};

type Props = {
  applicants: Applicant[];
  job: Job;
  theme: "dark" | "light";
  onScheduleInterview: (applicantId: string, slot: InterviewSlot) => void;
  companyId: string;
};

export default function InterviewScheduler({
  applicants,
  job,
  theme,
  onScheduleInterview,
  companyId,
}: Props) {
  const isDark = theme === "dark";
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [interviewType, setInterviewType] = useState<"ai" | "human">(job.interviewType === "ai" ? "ai" : "human");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const handleScheduleInterview = async () => {
    if (!selectedApplicant || !selectedDate || !selectedTime) {
      alert("Please fill all required fields");
      return;
    }

    setScheduling(true);
    try {
      const interviewSlot: InterviewSlot = {
        id: Date.now().toString(),
        date: selectedDate,
        time: selectedTime,
        duration,
        type: interviewType,
        applicantId: selectedApplicant,
        status: "booked"
      };

      // Call API to schedule interview
      const res = await fetch(
        `/api/company/${companyId}/jobs/${job._id}/applicants/${selectedApplicant}/interview/schedule`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            time: selectedTime,
            duration,
            type: interviewType,
            notes
          }),
        }
      );

      if (res.ok) {
        onScheduleInterview(selectedApplicant, interviewSlot);
        // Reset form
        setSelectedApplicant(null);
        setSelectedDate("");
        setSelectedTime("");
        setNotes("");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview");
    } finally {
      setScheduling(false);
    }
  };

  const eligibleApplicants = applicants.filter(
    applicant => applicant.status === "pending" || applicant.status === "interview_pending"
  );

  return (
    <div
      className={`rounded-xl p-6 border ${
        isDark
          ? "bg-[#1b2333] border-[#1e293b]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Schedule Interview
        </h3>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Calendar className="w-4 h-4" />
          {eligibleApplicants.length} eligible applicants
        </div>
      </div>

      {eligibleApplicants.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            No eligible applicants for interview
          </p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Applicants must be in "pending" or "interview_pending" status
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Applicant Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Select Applicant
            </label>
            <select
              value={selectedApplicant || ""}
              onChange={(e) => setSelectedApplicant(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-white/5 border-white/20 text-white"
                  : "bg-gray-50 border-gray-300 text-black"
              }`}
            >
              <option value="">Choose an applicant...</option>
              {eligibleApplicants.map((applicant) => (
                <option key={applicant._id} value={applicant._id}>
                  {applicant.mentee?.full_name || "N/A"} - {applicant.mentee?.email || "N/A"}
                </option>
              ))}
            </select>
          </div>

          {selectedApplicant && (
            <>
              {/* Selected Applicant Info */}
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-gray-200"
                    }`}
                  >
                    <User className="w-5 h-5 opacity-70" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {eligibleApplicants.find(a => a._id === selectedApplicant)?.mentee?.full_name || "N/A"}
                    </div>
                    <div className="text-sm opacity-70">
                      {eligibleApplicants.find(a => a._id === selectedApplicant)?.mentee?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInterviewType("ai")}
                    className={`p-3 rounded-lg border transition-colors ${
                      interviewType === "ai"
                        ? isDark
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-blue-100 border-blue-300 text-blue-700"
                        : isDark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Video className="w-4 h-4 inline mr-2" />
                    AI Interview
                  </button>
                  <button
                    onClick={() => setInterviewType("human")}
                    className={`p-3 rounded-lg border transition-colors ${
                      interviewType === "human"
                        ? isDark
                          ? "bg-purple-500/20 border-purple-500 text-purple-300"
                          : "bg-purple-100 border-purple-300 text-purple-700"
                        : isDark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Human Interview
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Select Date
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = dateObj.getDate();
                    
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          selectedDate === date
                            ? isDark
                              ? "bg-teal-500/20 border-teal-500 text-teal-300"
                              : "bg-teal-100 border-teal-300 text-teal-700"
                            : isDark
                            ? "border-white/20 hover:bg-white/10"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-xs opacity-70">{dayName}</div>
                        <div className="font-medium">{dayNum}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Select Time
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg border text-center transition-colors ${
                        selectedTime === time
                          ? isDark
                            ? "bg-teal-500/20 border-teal-500 text-teal-300"
                            : "bg-teal-100 border-teal-300 text-teal-700"
                          : isDark
                          ? "border-white/20 hover:bg-white/10"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? "bg-white/5 border-white/20 text-white"
                      : "bg-gray-50 border-gray-300 text-black"
                  }`}
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Interview Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any specific notes or instructions for the interview..."
                  className={`w-full p-3 rounded-lg border resize-none ${
                    isDark
                      ? "bg-white/5 border-white/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-black placeholder-gray-500"
                  }`}
                  rows={3}
                />
              </div>

              {/* Schedule Button */}
              <button
                onClick={handleScheduleInterview}
                disabled={scheduling || !selectedDate || !selectedTime}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  scheduling || !selectedDate || !selectedTime
                    ? "bg-gray-400 cursor-not-allowed"
                    : isDark
                    ? "bg-teal-500 text-black hover:bg-teal-400"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {scheduling ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Schedule Interview
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

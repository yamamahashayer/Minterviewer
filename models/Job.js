import mongoose, { Schema, model, models } from "mongoose";

const ApplicantSchema = new Schema({
  menteeId: { type: Schema.Types.ObjectId, ref: "Mentee", required: true },
  analysisId: { type: Schema.Types.ObjectId, ref: "CvAnalysis" },
  interviewId: { type: Schema.Types.ObjectId, ref: "JobInterview" },

  status: {
    type: String,
    enum: ["pending", "interview_pending", "interview_completed", "shortlisted", "rejected"],
    default: "pending",
  },

  // Interview completion tracking
  interviewStartedAt: { type: Date },
  interviewCompletedAt: { type: Date },

  evaluation: {
    cvScore: Number,
    interviewScore: Number,
    finalScore: Number,
    rank: Number,
    breakdown: {
      cvWeight: Number,
      interviewWeight: Number,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

const JobSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: { type: String, required: true },
    type: String,
    location: String,
    level: String,
    salaryRange: String,
    description: String,
    skills: [String],
    deadline: Date,

    enableCVAnalysis: { type: Boolean, default: false },

    interviewType: {
      type: String,
      enum: ["none", "ai", "human"],
      default: "none",
    },

    questionCount: { type: Number, default: 5 },
    aiFocus: [String],
    aiQuestions: String,

    humanType: {
      type: String,
      enum: ["hr", "mentor", ""],
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // Deadline reminder flags
    reminder3DaysSent: { type: Boolean, default: false },
    reminder1DaySent: { type: Boolean, default: false },
    autoCloseNotificationSent: { type: Boolean, default: false },

    applicants: { type: [ApplicantSchema], default: [] },
  },
  { timestamps: true }
);

const Job = models.Job || model("Job", JobSchema);
export default Job;

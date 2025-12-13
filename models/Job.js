import mongoose, { Schema, model, models } from "mongoose";

const ApplicantSchema = new Schema({
  menteeId: { type: Schema.Types.ObjectId, ref: "Mentee", required: true },
  analysisId: { type: Schema.Types.ObjectId, ref: "CvAnalysis" },
  interviewId: { type: Schema.Types.ObjectId, ref: "Interview" },

  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected"],
    default: "pending",
  },

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

    applicants: { type: [ApplicantSchema], default: [] },
  },
  { timestamps: true }
);

const Job = models.Job || model("Job", JobSchema);
export default Job;

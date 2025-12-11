import mongoose, { Schema, model, models } from "mongoose";

/* ============================================================
   🟣 Applicant Schema
=============================================================*/
const ApplicantSchema = new Schema({
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "Mentee",
    required: true,
  },

  analysisId: {
    type: Schema.Types.ObjectId,
    ref: "CvAnalysis",
  },

  interviewId: {
    type: Schema.Types.ObjectId,
    ref: "Interview",
  },

  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

/* ============================================================
   🟣 Job Schema
=============================================================*/
const JobSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: { type: String, required: true },
    type: { type: String, default: "" },
    location: { type: String, default: "" },
    level: { type: String, default: "" },
    salaryRange: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    deadline: { type: Date },
    reminder3DaysSent: { type: Boolean, default: false },
    reminder1DaySent: { type: Boolean, default: false },


    /* ===============================
         🌟 NEW FIELDS WE MUST ADD
    ================================*/

    // --- CV ANALYSIS ---
    enableCVAnalysis: { type: Boolean, default: false },

    // --- INTERVIEW TYPE ---
    interviewType: {
      type: String,
      enum: ["none", "ai", "human"],
      default: "none",
    },

    // --- AI INTERVIEW SETTINGS ---
    aiFocus: { type: [String], default: [] },
    aiQuestions: { type: String, default: "" },

    // --- HUMAN INTERVIEW SETTINGS ---
    humanType: {
      type: String,
      enum: ["hr", "mentor", ""],
      default: "",
    },

    // --- JOB STATUS ---
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // --- APPLICANTS ---
    applicants: { type: [ApplicantSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Job || model("Job", JobSchema);

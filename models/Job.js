import mongoose, { Schema, model, models } from "mongoose";

/* ============================================================
   🟣 Applicant Schema (المتقدم للوظيفة)
   بسيط — يخزن فقط العلاقات IDs
   وسيتم استدعاء CV + Analysis + Interview لاحقاً عند الطلب
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
  required: true,      
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
=============================================================*/
const JobSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: { type: String, required: true },
    type: { type: String, default: "" }, // Full-time / Part-time / Internship
    location: { type: String, default: "" },
    level: { type: String, default: "" }, // Junior / Mid / Senior
    salaryRange: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    deadline: { type: Date },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    applicants: { type: [ApplicantSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Job || model("Job", JobSchema);

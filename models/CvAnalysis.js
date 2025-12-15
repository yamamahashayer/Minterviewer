// models/CvAnalysis.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: String,
    score: Number,
    insights: [String],
  },
  { _id: false }
);

const KeywordCoverageSchema = new mongoose.Schema(
  {
    matched: { type: [String], default: [] },
    missing: { type: [String], default: [] },
  },
  { _id: false }
);

const CvAnalysisSchema = new mongoose.Schema(
  {
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
      index: true,
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      index: true,
      required: true,
    },

    /* ================= Scores ================= */
    score: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },

    /* ================= Analysis ================= */
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    redFlags: { type: [String], default: [] },

    recommendedJobTitles: { type: [String], default: [] },

    keywordCoverage: {
      type: KeywordCoverageSchema,
      default: () => ({ matched: [], missing: [] }),
    },

    categories: {
      formatting: { type: CategorySchema, required: true },
      content: { type: CategorySchema, required: true },
      keywords: { type: CategorySchema, required: true },
      experience: { type: CategorySchema, required: true },
    },

    /* ================= NEW ================= */
    userNotes: {
      type: String,
      default: null,
      maxlength: 1000, // حماية بسيطة
    },

    // 🔮 اختياري للمستقبل
    detectedTargetRole: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CvAnalysis =
  mongoose.models.CvAnalysis || mongoose.model("CvAnalysis", CvAnalysisSchema);

export default CvAnalysis;

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
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", index: true },
    score: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    redFlags: [String],
    recommendedJobTitles: [String],
    keywordCoverage: KeywordCoverageSchema,
    categories: {
      formatting: CategorySchema,
      content: CategorySchema,
      keywords: CategorySchema,
      experience: CategorySchema,
    },
  },
  { timestamps: true }
);

const CvAnalysis =
  mongoose.models.CvAnalysis ||
  mongoose.model("CvAnalysis", CvAnalysisSchema);

export default CvAnalysis;

// models/CvAnalysis.js  (ESM)
import mongoose from "mongoose";

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

    score:   { type: Number, default: 0, min: 0, max: 100 },
    atsScore:{ type: Number, default: 0, min: 0, max: 100 },

    strengths:            { type: [String], default: [] },
    weaknesses:           { type: [String], default: [] },
    improvements:         { type: [String], default: [] },
    redFlags:             { type: [String], default: [] },
    recommendedJobTitles: { type: [String], default: [] },

    keywordCoverage: { type: KeywordCoverageSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const CvAnalysis =
  mongoose.models.CvAnalysis || mongoose.model("CvAnalysis", CvAnalysisSchema);

export default CvAnalysis;

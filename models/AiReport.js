// models/AiReport.js
import mongoose from 'mongoose';
import { ReportType } from './enums.js';

const aiReportSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    report_type: { type: String, enum: Object.values(ReportType), required: true },
    overall_score: Number,
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }],
    detailed_feedback: mongoose.Schema.Types.Mixed,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('AiReport', aiReportSchema);

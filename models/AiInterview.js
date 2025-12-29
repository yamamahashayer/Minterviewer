// models/AiInterview.js
import mongoose from 'mongoose';

const aiInterviewSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },

    // Job Application Context
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    isJobApplication: { type: Boolean, default: false },

    coverImage: String,
    finalized: { type: Boolean, default: false },
    role: String,
    techstack: String,
    type: String,
    // Interview Results
    overallScore: { type: Number, min: 0, max: 100 },
    technicalScore: { type: Number, min: 0, max: 100 },
    communicationScore: { type: Number, min: 0, max: 100 },
    confidenceScore: { type: Number, min: 0, max: 100 },
    duration: { type: Number }, // Duration in seconds
    strengths: [{ type: String }],
    improvements: [{ type: String }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: true } }
);

export default mongoose.models.AiInterview || mongoose.model('AiInterview', aiInterviewSchema, 'aiinterviews');

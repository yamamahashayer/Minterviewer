// models/AiInterview.js
import mongoose from 'mongoose';

const aiInterviewSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    coverImage: String,
    finalized: { type: Boolean, default: false },
    questions: String,
    role: String,
    techstack: String,
    type: String, 
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: true } }
);

export default mongoose.model('AiInterview', aiInterviewSchema);

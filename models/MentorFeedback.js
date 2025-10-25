// models/MentorFeedback.js
import mongoose from 'mongoose';

const mentorFeedbackSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  },
  { timestamps: true }
);

export default mongoose.model('MentorFeedback', mentorFeedbackSchema);

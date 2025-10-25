// models/MentorEarning.js
import mongoose from 'mongoose';

const mentorEarningSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  },
  { timestamps: true }
);

export default mongoose.model('MentorEarning', mentorEarningSchema);

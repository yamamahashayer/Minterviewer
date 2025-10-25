// models/MentorBackground.js
import mongoose from 'mongoose';

const mentorBackgroundSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },
    company_name: String,
    position: String,
    start_date: Date,
    end_date: Date,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model('MentorBackground', mentorBackgroundSchema);

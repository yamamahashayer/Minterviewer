// models/Mentee.js
import mongoose from 'mongoose';

const menteeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    overall_score: Number,
    total_interviews: { type: Number, default: 0 },
    points_earned: { type: Number, default: 0 },
    joined_date: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Mentee', menteeSchema);

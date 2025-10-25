// models/Goal.js
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    title: { type: String, required: true },
    description: String,
    achived: { type: Boolean, default: false },
    deadline: Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('Goal', goalSchema);

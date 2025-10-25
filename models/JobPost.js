// models/JobPost.js
import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    Title: { type: String, required: true },
    Description: String,
    Skills: String,
    onsite: { type: Boolean, default: false },
    type: String,
    Availabile: { type: Boolean, default: true },
    postTime: { type: Date, default: Date.now },
    viewers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('JobPost', jobPostSchema);

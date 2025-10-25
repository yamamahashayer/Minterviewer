// models/JobApplication.js
import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true, index: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    State: { type: String, default: 'APPLIED' },
    AdditionalNotes: String,
  },
  { timestamps: true }
);

// unique(post, mentee)
jobApplicationSchema.index({ post: 1, mentee: 1 }, { unique: true });

export default mongoose.model('JobApplication', jobApplicationSchema);

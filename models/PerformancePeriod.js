// models/PerformancePeriod.js
import mongoose from 'mongoose';

const performancePeriodSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    Score: { type: Number, required: true },
    level: String, // junior/senior/intro
    description: String,
    startdate: { type: Date, default: Date.now },
    enddate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('PerformancePeriod', performancePeriodSchema);

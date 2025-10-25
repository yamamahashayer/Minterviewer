// models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },
    scaduledtime: Date,
    type: { type: String },   
    state: { type: String },  
    notes: String,
    duration: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);

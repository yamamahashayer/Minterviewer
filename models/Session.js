// models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    sessionOfferingId: mongoose.Schema.Types.ObjectId, // Reference to mentor's offering

    topic: { type: String, required: true },
    sessionType: { type: String, required: true },

    scheduledTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutes

    price: { type: Number, required: true }, // USD cents

    status: {
      type: String,
      enum: [
        'pending_payment',
        'pending_acceptance',
        'confirmed',
        'rejected',
        'cancelled_by_mentee',
        'cancelled_by_mentor',
        'completed'
      ],
      default: 'pending_payment',
      index: true
    },

    jitsiLink: { type: String }, // Generated when mentor accepts
    notes: { type: String }, // Mentee's notes
    mentorNotes: { type: String }, // Mentor's private notes
    rejectionReason: { type: String },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);

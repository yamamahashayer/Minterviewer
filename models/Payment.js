// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true, index: true },

    amount: { type: Number, required: true }, // USD cents
    currency: { type: String, default: 'USD' },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },

    stripePaymentIntentId: { type: String, index: true },
    stripeRefundId: { type: String },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);

// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);

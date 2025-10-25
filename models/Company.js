// models/Company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    companyName: { type: String, required: true },
    field: String,
    location: String,
    websiteurl: String,
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);

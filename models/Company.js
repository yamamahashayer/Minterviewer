import mongoose, { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // BASIC (Signup)
    name: { type: String, required: true },
    workEmail: { type: String, required: true, unique: true },
    industry: { type: String },
    website: { type: String },
    location: { type: String },
    logo: { type: String },

    isVerified: { type: Boolean, default: false },

    // PROFILE EXTRA (Editable later)
    description: { type: String },
    foundedYear: { type: Number },

    social: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },

    // Approval System
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },

    hiringStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default models.Company || model("Company", CompanySchema);

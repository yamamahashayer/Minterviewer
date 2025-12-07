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
    companySize: { type: String }, // 1-10, 10-50...
    foundedYear: { type: Number },

    social: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },

    hiringStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default models.Company || model("Company", CompanySchema);

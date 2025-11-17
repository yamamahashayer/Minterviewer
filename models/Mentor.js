// models/Mentor.js
import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    totalEarnings: { type: mongoose.Decimal128 },
    totalSessions: { type: Number, default: 0 },
    totalMentees: { type: Number, default: 0 },
    feedback: [{ type: String }],
    rating: { type: Number, default: 0 },
    yearsOfExperience: Number,
    field: String,
    availabilities: [{ type: Date }],
  },
  { timestamps: true }
);

export default mongoose.models.Mentor || mongoose.model("Mentor", mentorSchema);

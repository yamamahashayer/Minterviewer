// models/Mentor.js
import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // === BASIC INFO ===
    yearsOfExperience: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },

    // === SPECIALIZATION ===
    focusArea: { type: String, default: "" },      // مثال: Frontend, Backend…
    availabilityType: { type: String, default: "" }, // Full-Time, Part-Time, Flexible…

    // === LANGUAGES ===
    languages: { type: [String], default: [] },

    // === SESSION OPTIONS ===
    sessionTypes: { type: [String], default: [] }, // Mock interview, CV review...
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },

    // === SOCIAL LINKS (اختياري جداً) ===
    social: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    sessionsCount: { type: Number, default: 0 },
    menteesCount: { type: Number, default: 0 },

    profileCompletion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Mentor ||
  mongoose.model("Mentor", MentorSchema);

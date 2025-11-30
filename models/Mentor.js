import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, default: "" }, // ممكن تحمل Focus Area

    yearsOfExperience: { type: Number, default: 0 },

    languages: { type: [String], default: [] },

    industries: { type: [String], default: [] },

    focusArea: { type: String, default: "" },              // ⭐ NEW
    availabilityType: { type: String, default: "" },        // ⭐ NEW

    tags: { type: [String], default: [] },
    expertise: { type: Array, default: [] },
    sessionTypes: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
    achievements: { type: Array, default: [] },

    social: {
      github: String,
      website: String,
    },

    availability: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);

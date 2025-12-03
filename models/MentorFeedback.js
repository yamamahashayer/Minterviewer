// models/MentorFeedback.js
import mongoose from "mongoose";

const mentorFeedbackSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      index: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
      required: true,
      index: true,
    },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MentorFeedback ||
  mongoose.model("MentorFeedback", mentorFeedbackSchema);

import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    ownerModel: {
      type: String,
      required: true,
      enum: ["Mentee", "Mentor"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel",
    },

    type: {
      type: String,
      required: true,
      enum: [
        "system_design",
        "behavioral",
        "coding",
        "mock_interview",
        "achievement",
        "practice",
        "custom",
      ],
      default: "custom",
    },

    title: { type: String, required: true },

    score: { type: Number },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

activitySchema.index({ ownerModel: 1, owner: 1, timestamp: -1 });

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;

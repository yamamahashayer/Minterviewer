import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "achievement",
        "message",
        "reminder",
        "performance",
        "goal",
        "system",
        "job",
      ],
      default: "system",
    },

    read: {
      type: Boolean,
      default: false,
    },

    firebaseId: {
      type: String,
      default: null,
    },

    redirectTo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

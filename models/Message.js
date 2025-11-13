import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["ai", "system", "mentor", "mentee"],
      required: true,
    },

    senderName: {
      type: String,
      default: "",
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    preview: {
      type: String,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["feedback", "achievement", "reminder", "tip"],
      default: "feedback",
    },

    priority: {
      type: String,
      enum: ["high", "normal", "low"],
      default: "normal",
    },

    read: {
      type: Boolean,
      default: false,
    },

    starred: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);

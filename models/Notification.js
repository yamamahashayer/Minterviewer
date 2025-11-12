import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
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
      enum: ["achievement", "message", "reminder", "performance", "goal", "system"],
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
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification; 

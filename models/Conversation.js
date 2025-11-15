import mongoose, { Schema, model, models } from "mongoose";
import "@/models/User";
import "@/models/Message";

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export default models.Conversation || model("Conversation", ConversationSchema);

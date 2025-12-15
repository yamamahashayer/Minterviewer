import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TimeSlot", // Linking to the specific session/slot
            required: true,
            index: true,
        },
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
            trim: true,
        },
        tags: [{
            type: String,
            trim: true
        }], // e.g., ["Communication", "Technical Skills"]
    },
    { timestamps: true }
);

// Prevent duplicate feedback from same user for same session
feedbackSchema.index({ session: 1, fromUser: 1 }, { unique: true });

export default mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

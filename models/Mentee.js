import mongoose from "mongoose";

const menteeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    overall_score: { type: Number, default: 0 },
    total_interviews: { type: Number, default: 0 },
    points_earned: { type: Number, default: 0 },
    joined_date: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Mentee = mongoose.models.Mentee || mongoose.model("Mentee", menteeSchema);
export default Mentee;

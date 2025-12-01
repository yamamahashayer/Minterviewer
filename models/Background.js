// models/Background.js
import mongoose from "mongoose";

const backgroundSchema = new mongoose.Schema(
  {
    // Owner (Mentor or Mentee)
    ownerModel: {
      type: String,
      required: true,
      enum: ["Mentee", "Mentor"],
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel",
      index: true,
    },

    // Type of entry (Work or Education)
    entry_type: {
      type: String,
      enum: ["work", "education"],
      required: true,
      index: true,
    },

    // Work Fields
    company_name: { type: String, default: "" },
    position: { type: String, default: "" },

    // Education Fields
    school: { type: String, default: "" },
    degree: { type: String, default: "" },

    // Shared Fields
    start_date: { type: Date },
    end_date: { type: Date },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Background ||
  mongoose.model("Background", backgroundSchema);

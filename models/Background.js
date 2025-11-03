// models/Background.js
import mongoose from "mongoose";

const backgroundSchema = new mongoose.Schema(
  {
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

    // "work" | "education"
    entry_type: { type: String, enum: ["work", "education"], required: true, index: true },

    // work
    company_name: { type: String, default: "—" },
    position: { type: String, default: "—" },

    // education
    school: { type: String, default: "—" },
    degree: { type: String, default: "—" },

    start_date: Date,
    end_date: Date,
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Background ||
  mongoose.model("Background", backgroundSchema);

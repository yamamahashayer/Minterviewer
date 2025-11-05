import mongoose, { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    mentee: { type: Schema.Types.ObjectId, ref: "Mentee", index: true },
    user:   { type: Schema.Types.ObjectId, ref: "User", index: true }, // اختياري
    role:   { type: String, default: "Software Engineer" },
    source: { type: String, enum: ["affinda", "fallback"], default: "affinda" },
    parsed: { type: Schema.Types.Mixed },  
    html:   { type: String, required: true }, 
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", ResumeSchema);
export default Resume;

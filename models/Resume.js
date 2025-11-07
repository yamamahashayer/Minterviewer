import mongoose, { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    mentee: { type: Schema.Types.ObjectId, ref: "Mentee", index: true },
    user:   { type: Schema.Types.ObjectId, ref: "User", index: true }, 
    source: {
      type: String,
      enum: ["affinda", "builder"],
      default: "builder"
    }
,    parsed: { type: Schema.Types.Mixed },
    html:   { type: String, default: null, required: false },
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", ResumeSchema);
export default Resume;

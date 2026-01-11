import mongoose from "mongoose";

const companyInterviewSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true, index: true },

    scheduledStart: { type: Date, required: true, index: true },
    scheduledEnd: { type: Date, required: true },
    duration: { type: Number, required: true },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
      index: true,
    },

    meetingLink: { type: String },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

companyInterviewSchema.index({ companyId: 1, scheduledStart: 1, status: 1 });
companyInterviewSchema.index({ menteeId: 1, scheduledStart: 1, status: 1 });

export default mongoose.models.CompanyInterview ||
  mongoose.model("CompanyInterview", companyInterviewSchema);

import mongoose from "mongoose";

const jobInterviewSchema = new mongoose.Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true },

        // Status
        status: {
            type: String,
            enum: ["started", "completed", "video_processing", "terminated"],
            default: "started"
        },

        // Anti-Cheating Tracking
        fullScreenViolations: { type: Number, default: 0 },
        violationTimestamps: [Date],
        terminatedReason: {
            type: String,
            enum: ['completed', 'fullscreen_violation', 'user_exit', null],
            default: null
        },

        // Job Context Snapshot (in case job changes later)
        jobTitle: String,
        jobLevel: String,

        // Interview Content
        questions: [{
            question: String,
            candidateAnswer: String, // The text of the user's answer
            answerAudioUrl: String,
            transcript: String,
            duration: Number,
            score: Number,
            feedback: String
        }],

        // Results
        overallScore: { type: Number, min: 0, max: 100 },
        feedback: String, // Overall detailed feedback summary
        technicalScore: { type: Number, min: 0, max: 100 },
        communicationScore: { type: Number, min: 0, max: 100 },
        confidenceScore: { type: Number, min: 0, max: 100 },

        strengths: [String],
        improvements: [String],

        duration: Number, // Total duration in seconds
        startedAt: { type: Date, default: Date.now },
        completedAt: Date,
    },
    { timestamps: true }
);

const JobInterview = mongoose.models.JobInterview || mongoose.model("JobInterview", jobInterviewSchema);
export default JobInterview;

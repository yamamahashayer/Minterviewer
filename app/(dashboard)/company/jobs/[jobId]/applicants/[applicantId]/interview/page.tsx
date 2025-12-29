"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Award, TrendingUp, TrendingDown, Clock, User } from "lucide-react";

export default function ApplicantInterviewReportPage() {
    const params = useParams();
    const router = useRouter();
    const { jobId, applicantId } = params;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchInterviewReport();
    }, []);

    const fetchInterviewReport = async () => {
        try {
            const userStr = sessionStorage.getItem("user");
            if (!userStr) {
                setError("Please login to continue");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            const companyId = user.companyId;

            const res = await fetch(
                `/api/company/${companyId}/jobs/${jobId}/applicants/${applicantId}/interview`
            );
            const result = await res.json();

            if (result.ok) {
                setData(result);
            } else {
                setError(result.message || "Failed to load interview report");
            }
        } catch (err) {
            console.error("Error fetching interview report:", err);
            setError("Failed to load interview report");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Report not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { applicant, interview } = data;
    const mentee = applicant.mentee;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Applicants
                </button>

                {/* Applicant Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {mentee?.user?.full_name || "Unknown Candidate"}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">{mentee?.user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                            <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                {applicant.status.replace("_", " ")}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applied</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {new Date(applicant.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interview Completed</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {applicant.interviewCompletedAt
                                    ? new Date(applicant.interviewCompletedAt).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {interview?.duration ? `${Math.round(interview.duration / 60)} min` : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interview Scores */}
                {interview && (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Award className="w-6 h-6 text-yellow-500" />
                                Interview Performance
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <ScoreCard
                                    label="Overall Score"
                                    score={interview.overallScore}
                                    color="purple"
                                />
                                <ScoreCard
                                    label="Technical"
                                    score={interview.technicalScore}
                                    color="blue"
                                />
                                <ScoreCard
                                    label="Communication"
                                    score={interview.communicationScore}
                                    color="green"
                                />
                                <ScoreCard
                                    label="Confidence"
                                    score={interview.confidenceScore}
                                    color="orange"
                                />
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Strengths */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Strengths
                                </h3>
                                {interview.strengths && interview.strengths.length > 0 ? (
                                    <ul className="space-y-3">
                                        {interview.strengths.map((strength: string, idx: number) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                            >
                                                <span className="text-green-600 mt-1">✓</span>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No strengths recorded</p>
                                )}
                            </div>

                            {/* Areas for Improvement */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-orange-600" />
                                    Areas for Improvement
                                </h3>
                                {interview.improvements && interview.improvements.length > 0 ? (
                                    <ul className="space-y-3">
                                        {interview.improvements.map((improvement: string, idx: number) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                            >
                                                <span className="text-orange-600 mt-1">→</span>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No improvements recorded</p>
                                )}
                            </div>
                        </div>

                        {/* Interview Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Interview Details
                            </h3>
                            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between">
                                    <span className="font-medium">Role:</span>
                                    <span>{interview.role || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tech Stack:</span>
                                    <span>{interview.techstack || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Interview Type:</span>
                                    <span className="capitalize">{interview.type || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Completed:</span>
                                    <span>
                                        {interview.createdAt
                                            ? new Date(interview.createdAt).toLocaleString()
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!interview && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            No interview data available for this applicant.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ScoreCard({
    label,
    score,
    color,
}: {
    label: string;
    score: number;
    color: string;
}) {
    const colorClasses = {
        purple: "from-purple-500 to-purple-600",
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        orange: "from-orange-500 to-orange-600",
    };

    return (
        <div className="text-center">
            <div
                className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]
                    } flex items-center justify-center mb-3 shadow-lg`}
            >
                <span className="text-3xl font-bold text-white">{score || 0}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        </div>
    );
}

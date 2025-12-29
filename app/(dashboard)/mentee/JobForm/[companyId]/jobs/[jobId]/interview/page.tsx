"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AIInterviewerApp from "@/app/components/Interview_Components/AIInterviewerApp";
import FullScreenInterviewContainer from "@/app/components/Interview_Components/FullScreenInterviewContainer";
import { Loader2, Video } from "lucide-react";

export default function JobInterviewPage() {
    const params = useParams();
    const router = useRouter();
    const { companyId, jobId } = params;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menteeId, setMenteeId] = useState<string | null>(null);
    const [interviewId, setInterviewId] = useState<string | null>(null);

    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        // Get mentee ID from session storage
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setMenteeId(user.menteeId);
            setLoading(false);
        } else {
            setError("Please login to continue");
            setLoading(false);
        }
    }, []);

    const handleInterviewComplete = () => {
        // After interview is complete, redirect to success page
        router.push(`/mentee/JobForm/${companyId}/jobs/${jobId}/success`);
    };

    const handleInterviewStart = (actualInterviewId: string) => {
        // Update the interviewId state when interview starts
        setInterviewId(actualInterviewId);
    };

    const handleInterviewError = (message: string) => {
        // Handle errors like duplicate applications
        // Redirect to dashboard with error message
        router.push(`/mentee?error=${encodeURIComponent(message)}`);
    };

    const handleInterviewTerminate = (reason: string) => {
        // When interview is terminated due to fullscreen violation or user exit
        // Redirect to mentee dashboard with termination message
        router.push(`/mentee?terminated=true&reason=${reason}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error || !menteeId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Authentication required"}</p>
                    <button
                        onClick={() => router.push("/mentee/LoginPage")}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700 text-center">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Video className="w-10 h-10 text-purple-600" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            AI Interview Required
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            You are about to start a formal AI interview for this job application.
                            Your responses will be recorded, transcribed, and analyzed to evaluate your technical skills and communication.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quiet Space</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ensure you are in a quiet environment with no interruptions.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Check Audio</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Make sure your microphone is working clearly.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Full Screen Mode</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">The interview will run in full screen mode. Exiting will terminate the interview.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.back()}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold text-lg rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setHasStarted(true)}
                                className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all w-full sm:w-auto"
                            >
                                I'm Ready, Start Interview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <FullScreenInterviewContainer
            interviewId={interviewId || jobId as string} // Use actual interviewId when available, fallback to jobId
            onTerminate={handleInterviewTerminate}
        >
            <AIInterviewerApp
                jobId={jobId as string}
                companyId={companyId as string}
                menteeId={menteeId}
                onComplete={handleInterviewComplete}
                onInterviewStart={handleInterviewStart}
                onError={handleInterviewError}
            />
        </FullScreenInterviewContainer>
    );
}

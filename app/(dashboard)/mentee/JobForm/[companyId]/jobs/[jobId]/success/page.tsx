"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Briefcase } from "lucide-react";

export default function JobApplicationSuccessPage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Application Submitted Successfully!
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your AI interview has been completed and your application has been submitted to the company.
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    The company will review your interview performance and contact you if they'd like to proceed.
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={() => router.push("/mentee?tab=explore-jobs")}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2"
                    >
                        <Briefcase className="w-5 h-5" />
                        Browse More Jobs
                    </button>
                    <button
                        onClick={() => router.push("/mentee?tab=overview")}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import SetupScreenComponent from './SetupScreenComponent';
import InterviewScreenComponent from './InterviewScreenComponent';
import ReportScreenComponent from './ReportScreenComponent';

// Main App Component - Orchestrates screen transitions
const AIInterviewerApp = () => {
    const [currentScreen, setCurrentScreen] = useState<'welcome' | 'setup' | 'interview' | 'report'>('welcome');
    const [setupData, setSetupData] = useState<any>(null);
    const [interviewData, setInterviewData] = useState<any>(null);
    const [interviewStartTime, setInterviewStartTime] = useState<number>(0);

    const handleStartInterview = () => {
        setCurrentScreen('setup');
    };

    const handleSetupComplete = async (data: any) => {
        try {
            // Create interview document and get ID
            const response = await fetch('/api/create-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: data.role,
                    techstack: Array.isArray(data.techStack) ? data.techStack.join(', ') : data.techStack,
                    type: data.interviewType
                })
            });

            if (response.ok) {
                const { interviewId } = await response.json();
                setSetupData({ ...data, interviewId });
                setInterviewStartTime(Date.now());
                setCurrentScreen('interview');
            } else {
                console.error('Failed to create interview');
                // Proceed anyway for now
                setSetupData(data);
                setInterviewStartTime(Date.now());
                setCurrentScreen('interview');
            }
        } catch (error) {
            console.error('Error creating interview:', error);
            // Proceed anyway for now
            setSetupData(data);
            setInterviewStartTime(Date.now());
            setCurrentScreen('interview');
        }
    };

    const handleInterviewComplete = (data: any) => {
        const duration = Math.floor((Date.now() - interviewStartTime) / 1000); // Duration in seconds
        setInterviewData({ ...data, duration });
        setCurrentScreen('report');
    };

    const handleRestart = () => {
        setCurrentScreen('welcome');
        setSetupData(null);
        setInterviewData(null);
        setInterviewStartTime(0);
    };

    return (
        <div className={`h-screen bg-white dark:bg-[#0A0F1E] text-foreground flex flex-col ${currentScreen === 'welcome' ? 'overflow-hidden' : 'overflow-auto'}`}>
            {currentScreen === 'welcome' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="max-w-5xl w-full text-center">
                        {/* Hero Section */}
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                Mock your interview
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Practice your interview skills with our AI-powered interviewer
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none transition-transform hover:scale-105 duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personalized Questions</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Tailored to your role and tech stack</p>
                            </div>
                            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none transition-transform hover:scale-105 duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Voice & Video</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Real interview experience with feedback</p>
                            </div>
                            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none transition-transform hover:scale-105 duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Detailed Report</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Get insights on your performance</p>
                            </div>
                        </div>

                        {/* Start Button */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleStartInterview}
                                className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                            >
                                <span className="relative z-10">Start Interview Practice</span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <p className="text-gray-500 dark:text-white/60 mt-6 text-sm">
                                Nothing required • Practice anytime • Instant feedback
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {currentScreen === 'setup' && (
                <SetupScreenComponent onComplete={handleSetupComplete} />
            )}
            {currentScreen === 'interview' && (
                <InterviewScreenComponent
                    setupData={setupData}
                    onComplete={handleInterviewComplete}
                />
            )}
            {currentScreen === 'report' && (
                <ReportScreenComponent
                    interviewData={interviewData}
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
};

export default AIInterviewerApp;

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

    const handleStartInterview = () => {
        setCurrentScreen('setup');
    };

    const handleSetupComplete = (data: any) => {
        setSetupData(data);
        setCurrentScreen('interview');
    };

    const handleInterviewComplete = (data: any) => {
        setInterviewData(data);
        setCurrentScreen('report');
    };

    const handleRestart = () => {
        setCurrentScreen('welcome');
        setSetupData(null);
        setInterviewData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {currentScreen === 'welcome' && (
                <div className="flex items-center justify-center min-h-screen p-6">
                    <div className="max-w-4xl w-full text-center">
                        {/* Hero Section */}
                        <div className="mb-12">
                            <div className="mb-6 flex justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                AI Mock Interview
                            </h1>
                            <p className="text-2xl text-white/80 mb-8">
                                Practice your interview skills with our AI-powered interviewer
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <div className="text-4xl mb-3">🎯</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Personalized Questions</h3>
                                <p className="text-white/70">Tailored to your role and tech stack</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <div className="text-4xl mb-3">🎤</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Voice & Video</h3>
                                <p className="text-white/70">Real interview experience with feedback</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <div className="text-4xl mb-3">📊</div>
                                <h3 className="text-xl font-semibold text-white mb-2">Detailed Report</h3>
                                <p className="text-white/70">Get insights on your performance</p>
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartInterview}
                            className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                        >
                            <span className="relative z-10">Start Interview Practice</span>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <p className="text-white/60 mt-6 text-sm">
                            No signup required • Practice anytime • Instant feedback
                        </p>
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

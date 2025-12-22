import React, { useState } from 'react';
import { CheckCircle2, Clock, Brain, BarChart3, Zap } from 'lucide-react';
import SetupScreenComponent from './SetupScreenComponent';
import InterviewScreenComponent from './InterviewScreenComponent';
import VideoInterviewScreen from './VideoInterviewScreen';
import ReportScreenComponent from './ReportScreenComponent';

const AIInterviewerApp = () => {
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const [showProcessFlow, setShowProcessFlow] = useState(false);
    const [setupData, setSetupData] = useState(null);
    const [interviewData, setInterviewData] = useState(null);

    const handleStartInterview = () => {
        setShowProcessFlow(true);
    };

    const handleProceedToSetup = () => {
        setShowProcessFlow(false);
        setCurrentScreen('setup');
    };

    const handleGoBack = () => {
        setShowProcessFlow(false);
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
        setSetupData(null);
        setInterviewData(null);
        setCurrentScreen('welcome');
    };

    const handleStartVideoInterview = () => {
        // Start video interview directly without setup
        const videoSetupData = {
            interviewMode: 'video',
            role: 'General',
            interviewType: 'behavioral',
            techStack: 'General',
            questionCount: 6
        };
        setSetupData(videoSetupData);
        setCurrentScreen('interview');
    };

    const processSteps = [
        {
            number: 1,
            title: 'Setup Your Interview',
            description: 'Answer 4 quick questions about your desired role, experience level, and tech stack',
            icon: Brain,
            details: [
                'Select your target position',
                'Choose your tech stack',
                'Pick interview type',
                'Set difficulty level'
            ],
            time: '2 min',
            color: 'from-purple-500 to-purple-600'
        },
        {
            number: 2,
            title: 'Face Timed Questions',
            description: 'Answer 5-8 customized questions with real interview conditions',
            icon: Clock,
            details: [
                '30-60 sec thinking time per question',
                'Variable answer durations',
                'Mix of technical & behavioral',
                'Real-time recording'
            ],
            time: '15-20 min',
            color: 'from-pink-500 to-pink-600'
        },
        {
            number: 3,
            title: 'AI Evaluation',
            description: 'Our AI analyzes your responses in real-time',
            icon: Zap,
            details: [
                'Technical accuracy assessment',
                'Communication clarity scoring',
                'Confidence level analysis',
                'Time management evaluation'
            ],
            time: '2-3 min',
            color: 'from-purple-500 to-pink-500'
        },
        {
            number: 4,
            title: 'Get Your Report',
            description: 'Receive detailed feedback and actionable insights',
            icon: BarChart3,
            details: [
                'Overall performance score',
                'Strengths & weaknesses',
                'Question-by-question analysis',
                'Improvement recommendations'
            ],
            time: 'Instant',
            color: 'from-pink-500 to-purple-500'
        }
    ];

    if (showProcessFlow) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0F1E] dark:to-[#151B2B] p-6 md:p-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Complete your mock interview in just 20-30 minutes and get instant, detailed feedback on your performance
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div className="space-y-8 mb-12">
                        {processSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <div key={step.number} className="relative">
                                    {/* Connection Line */}
                                    {index !== processSteps.length - 1 && (
                                        <div className="absolute left-12 top-24 w-1 h-20 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 hidden md:block"></div>
                                    )}

                                    <div className="grid md:grid-cols-[120px_1fr] gap-8 items-start">
                                        {/* Left Side - Icon and Number */}
                                        <div className="flex flex-col items-center">
                                            <div className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                                                <div className="w-full h-full rounded-full bg-white dark:bg-[#0A0F1E] flex items-center justify-center">
                                                    <IconComponent className="w-12 h-12 text-gray-900 dark:text-white" />
                                                </div>
                                            </div>
                                            <div className={`mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold shadow-md`}>
                                                {step.time}
                                            </div>
                                        </div>

                                        {/* Right Side - Content */}
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {step.title}
                                                    </h2>
                                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                                        {step.description}
                                                    </p>
                                                </div>
                                                <span className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${step.color} text-white text-xl font-bold flex-shrink-0 mt-1`}>
                                                    {step.number}
                                                </span>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid md:grid-cols-2 gap-3 mt-6">
                                                {step.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                                                        <span className="text-gray-700 dark:text-gray-200">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center shadow-xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to ace your interview?
                        </h3>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Start your mock interview now and get detailed feedback in minutes
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleProceedToSetup}
                                className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                            >
                                Start Interview
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/30 transition-all duration-300 w-full sm:w-auto"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">20-30 min</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Total time required</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">5-8 Q's</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Questions to answer</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Instant</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Get your results</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Setup Screen
    if (currentScreen === 'setup') {
        return <SetupScreenComponent onComplete={handleSetupComplete} />;
    }

    // Render Interview Screen
    if (currentScreen === 'interview' && setupData) {
        // Route to video interview if user selected video mode
        if (setupData.interviewMode === 'video') {
            return <VideoInterviewScreen setupData={setupData} onComplete={handleInterviewComplete} />;
        }
        // Default to audio-only interview
        return <InterviewScreenComponent setupData={setupData} onComplete={handleInterviewComplete} />;
    }

    // Render Report Screen
    if (currentScreen === 'report' && interviewData) {
        return <ReportScreenComponent interviewData={interviewData} onRestart={handleRestart} />;
    }

    // Welcome Screen (default)
    return (
        <div className={`h-screen bg-white dark:bg-[#0A0F1E] text-foreground flex flex-col overflow-hidden`}>
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

                    {/* Interview Type Selection */}
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Choose Your Interview Type</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                            {/* Audio Interview with Setup */}
                            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
                                <div className="text-center mb-6">
                                    <div className="text-5xl mb-4">🎤</div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audio Interview</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Customized questions based on your role and tech stack</p>
                                </div>
                                <ul className="text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Personalized setup questions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>AI-generated questions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Voice-based responses</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Tone analysis</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleStartInterview}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    Start Audio Interview
                                </button>
                            </div>

                            {/* Video Interview - Direct Start */}
                            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-pink-500 dark:border-pink-500 hover:border-pink-600 dark:hover:border-pink-600 transition-all duration-300 hover:shadow-xl shadow-pink-500/20">
                                <div className="text-center mb-6">
                                    <div className="text-5xl mb-4">🎥</div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Interview</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Pre-recorded questions with video analysis</p>
                                </div>
                                <ul className="text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start">
                                        <span className="text-pink-500 mr-2">✓</span>
                                        <span>6 pre-recorded questions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-pink-500 mr-2">✓</span>
                                        <span>Video + audio recording</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-pink-500 mr-2">✓</span>
                                        <span>Facial expression analysis</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-pink-500 mr-2">✓</span>
                                        <span>No setup required - start instantly!</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleStartVideoInterview}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    Start Video Interview
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-500 dark:text-white/60 mt-4 text-sm">
                            Nothing required • Practice anytime • Instant feedback
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInterviewerApp;
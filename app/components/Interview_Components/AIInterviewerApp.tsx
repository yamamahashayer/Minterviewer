/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import SetupScreenComponent from './SetupScreenComponent';
import InterviewScreenComponent from './InterviewScreenComponent';
import ReportScreenComponent from './ReportScreenComponent';

// Main App Component - Orchestrates screen transitions
const AIInterviewerApp = () => {
    const [currentScreen, setCurrentScreen] = useState<'setup' | 'interview' | 'report'>('setup');
    const [setupData, setSetupData] = useState<any>(null);
    const [interviewData, setInterviewData] = useState<any>(null);

    const handleSetupComplete = (data: any) => {
        setSetupData(data);
        setCurrentScreen('interview');
    };

    const handleInterviewComplete = (data: any) => {
        setInterviewData(data);
        setCurrentScreen('report');
    };

    const handleRestart = () => {
        setCurrentScreen('setup');
        setSetupData(null);
        setInterviewData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

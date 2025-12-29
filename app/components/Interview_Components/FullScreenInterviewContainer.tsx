"use client";

import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface FullScreenInterviewContainerProps {
    children: React.ReactNode;
    interviewId: string;
    onTerminate: (reason: string) => void;
}

export default function FullScreenInterviewContainer({
    children,
    interviewId,
    onTerminate
}: FullScreenInterviewContainerProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [lastEscPress, setLastEscPress] = useState(0);
    const [escCount, setEscCount] = useState(0);

    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const terminatedRef = useRef(false);

    // Request fullscreen on mount
    useEffect(() => {
        const requestFullScreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullScreen(true);
                }
            } catch (error) {
                console.warn('Fullscreen request failed:', error);
                // Continue anyway - graceful degradation
            }
        };

        requestFullScreen();

        // Cleanup: exit fullscreen on unmount
        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        };
    }, []);

    // Monitor fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullScreen = !!document.fullscreenElement;
            setIsFullScreen(isCurrentlyFullScreen);

            // If user exits fullscreen and interview hasn't been terminated yet
            if (!isCurrentlyFullScreen && !terminatedRef.current && !showWarning) {
                // Show warning and start countdown
                setShowWarning(true);
                setCountdown(3);
            }

            // If user re-enters fullscreen, cancel warning
            if (isCurrentlyFullScreen && showWarning) {
                setShowWarning(false);
                setCountdown(3);
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [showWarning]);

    // Countdown timer
    useEffect(() => {
        if (showWarning && countdown > 0) {
            countdownIntervalRef.current = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (showWarning && countdown === 0) {
            // Terminate interview
            terminateInterview('fullscreen_violation');
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearTimeout(countdownIntervalRef.current);
            }
        };
    }, [showWarning, countdown]);

    // Double ESC key detection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const now = Date.now();

                // If ESC pressed within 1 second of last press
                if (now - lastEscPress < 1000) {
                    // Double ESC detected - allow exit
                    terminateInterview('user_exit');
                } else {
                    // First ESC press
                    setLastEscPress(now);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [lastEscPress]);

    const terminateInterview = async (reason: string) => {
        if (terminatedRef.current) return; // Prevent multiple terminations
        terminatedRef.current = true;

        // Hide warning immediately
        setShowWarning(false);

        try {
            // Call API to terminate interview
            await fetch('/api/jobs/terminate-job-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviewId, reason })
            });
        } catch (error) {
            console.error('Error terminating interview:', error);
        }

        // Exit fullscreen before redirecting
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.warn('Error exiting fullscreen:', error);
        }

        // Small delay to ensure fullscreen exit completes
        setTimeout(() => {
            // Call parent termination handler
            onTerminate(reason);
        }, 100);
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-white dark:bg-[#0A0F1E] z-50 overflow-y-auto">
            {children}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl border-4 border-red-500 animate-pulse">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                ⚠️ Full Screen Exit Detected
                            </h2>

                            {/* Message */}
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                You have exited full screen mode. This is not allowed during a job interview.
                            </p>

                            {/* Countdown */}
                            <div className="mb-6">
                                <div className="text-6xl font-bold text-red-600 dark:text-red-500 mb-2">
                                    {countdown}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Interview will be terminated in {countdown} second{countdown !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Instructions */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                    Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">F11</kbd> or click the full screen button to return
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

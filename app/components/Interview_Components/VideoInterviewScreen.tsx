/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Clock, CheckCircle2 } from 'lucide-react';
import { useSpeechToText } from '../../hooks/useSpeechToText';

// Video Interview Screen Component
const VideoInterviewScreen = ({ setupData, onComplete }: { setupData: any, onComplete: (data: any) => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [answers, setAnswers] = useState<any[]>([]);
    const [emotionData, setEmotionData] = useState<any[]>([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [interviewPhase, setInterviewPhase] = useState<'watching' | 'responding'>('watching');
    const [questionVideoEnded, setQuestionVideoEnded] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const candidateVideoRef = useRef<HTMLVideoElement>(null);
    const questionVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { transcribe } = useSpeechToText();

    // Video questions configuration
    const videoQuestions = [
        {
            videoFile: '/TheVideoInterview/1.mp4',
            text: 'Welcome to this interview, we\'re happy to have you here. Tell me more about yourself in 5 minutes.',
            responseTime: 300 // 5 minutes
        },
        {
            videoFile: '/TheVideoInterview/2.mp4',
            text: 'Thank you for sharing that. Can you tell me more about a recent project you worked on? Please explain what the project was about, your role on it, and any challenges you faced and how you handled them.',
            responseTime: 180 // 3 minutes
        },
        {
            videoFile: '/TheVideoInterview/3.mp4',
            text: 'What are your short-term and long-term career goals?',
            responseTime: 120 // 2 minutes
        },
        {
            videoFile: '/TheVideoInterview/4.mp4',
            text: 'Why do you believe you will be a strong fit for this role?',
            responseTime: 120 // 2 minutes
        },
        {
            videoFile: '/TheVideoInterview/5.mp4',
            text: 'If you realized that you would not be able to complete a task by the deadline, how would you handle the situation?',
            responseTime: 120 // 2 minutes
        },
        {
            videoFile: '/TheVideoInterview/6.mp4',
            text: 'Good bye and thank you for your time.',
            responseTime: 0 // No response needed
        }
    ];

    // Initialize candidate camera
    useEffect(() => {
        if (!videoEnabled) return;

        let mediaStream: MediaStream | null = null;

        const initCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false
                });
                if (candidateVideoRef.current) {
                    candidateVideoRef.current.srcObject = mediaStream;
                    candidateVideoRef.current.onloadedmetadata = () => {
                        candidateVideoRef.current?.play();
                    };
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setVideoEnabled(false);
            }
        };

        initCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoEnabled]);

    // Capture and analyze frames during recording
    useEffect(() => {
        if (!isRecording || !videoEnabled) {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
            return;
        }

        const captureAndAnalyzeFrame = async () => {
            try {
                if (!candidateVideoRef.current || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = candidateVideoRef.current.videoWidth;
                canvas.height = candidateVideoRef.current.videoHeight;
                ctx.drawImage(candidateVideoRef.current, 0, 0);

                canvas.toBlob(async (blob) => {
                    if (!blob) return;

                    try {
                        const formData = new FormData();
                        formData.append('image', blob, 'frame.jpg');
                        formData.append('questionIndex', currentQuestion.toString());

                        const response = await fetch('/api/analyze-emotion', {
                            method: 'POST',
                            body: formData
                        });

                        if (response.ok) {
                            const data = await response.json();
                            console.log('Emotion analysis:', data);

                            setEmotionData(prev => [...prev, {
                                timestamp: Date.now(),
                                emotion: data.emotion || 'neutral',
                                confidence: data.confidence || 0,
                                questionIndex: currentQuestion
                            }]);
                        }
                    } catch (error) {
                        console.error('Error analyzing frame:', error);
                    }
                }, 'image/jpeg', 0.8);
            } catch (error) {
                console.error('Error capturing frame:', error);
            }
        };

        // Capture frame every 5 seconds during recording
        captureIntervalRef.current = setInterval(() => {
            captureAndAnalyzeFrame();
        }, 5000);

        return () => {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
            }
        };
    }, [isRecording, videoEnabled, currentQuestion]);

    // Handle question video ended
    const handleQuestionVideoEnded = () => {
        setQuestionVideoEnded(true);

        // If this is the last question (goodbye), complete the interview
        if (currentQuestion === videoQuestions.length - 1) {
            completeInterview();
        } else {
            // Start response phase
            setInterviewPhase('responding');
            setTimeLeft(videoQuestions[currentQuestion].responseTime);
            startRecording();
        }
    };

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && interviewPhase === 'responding') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, interviewPhase]);

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processAnswer(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Process answer
    const processAnswer = async (audioBlob: Blob) => {
        try {
            // Transcribe audio
            const text = await transcribe(audioBlob);

            // Analyze tone
            const formData = new FormData();
            formData.append('audio', audioBlob, 'answer.webm');

            let toneData = null;
            try {
                const toneResponse = await fetch('/api/analyze-tone', {
                    method: 'POST',
                    body: formData
                });

                if (toneResponse.ok) {
                    toneData = await toneResponse.json();
                }
            } catch (error) {
                console.error('Error analyzing tone:', error);
            }

            // Get emotion data for this question
            const questionEmotions = emotionData.filter(e => e.questionIndex === currentQuestion);

            const newAnswer = {
                questionIndex: currentQuestion,
                questionText: videoQuestions[currentQuestion].text,
                transcription: text || '',
                toneData: toneData,
                emotionData: questionEmotions,
                timestamp: new Date().toISOString()
            };

            setAnswers(prev => [...prev, newAnswer]);

            // Move to next question
            setTimeout(() => {
                if (currentQuestion < videoQuestions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setInterviewPhase('watching');
                    setQuestionVideoEnded(false);
                    setTimeLeft(0);
                } else {
                    completeInterview();
                }
            }, 1000);
        } catch (error) {
            console.error('Error processing answer:', error);
        }
    };

    // Complete interview
    const completeInterview = () => {
        // Format answers to match the expected API format
        const formattedAnswers = answers.map((ans) => ({
            question: {
                text: ans.questionText
            },
            answer: ans.transcription,
            isCoding: false,
            toneData: ans.toneData || {}
        }));

        onComplete({
            answers: formattedAnswers,
            emotionData: emotionData,
            questions: videoQuestions,
            setupData: { ...setupData, interviewMode: 'video' },
            hasVideoData: videoEnabled && emotionData.length > 0,
            timestamp: new Date().toISOString()
        });
    };

    // Skip to next question (manual)
    const skipQuestion = () => {
        if (isRecording) {
            stopRecording();
        } else {
            // If not recording yet, just move to next question
            if (currentQuestion < videoQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setInterviewPhase('watching');
                setQuestionVideoEnded(false);
                setTimeLeft(0);
            } else {
                completeInterview();
            }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0F1E] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Progress */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                Video Interview - Question {currentQuestion + 1} of {videoQuestions.length}
                            </h1>
                            <p className="text-purple-600 dark:text-purple-300 text-sm">
                                {interviewPhase === 'watching' ? '👀 Watching Question' : '🎤 Your Response'}
                            </p>
                        </div>

                        {/* Camera Toggle Button */}
                        <button
                            onClick={() => setVideoEnabled(!videoEnabled)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${videoEnabled
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }`}
                        >
                            {videoEnabled ? (
                                <>
                                    <Video className="w-5 h-5" />
                                    <span>Camera On</span>
                                </>
                            ) : (
                                <>
                                    <VideoOff className="w-5 h-5" />
                                    <span>Enable Camera</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex space-x-2">
                        {videoQuestions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 h-3 rounded-full transition-all ${idx === currentQuestion
                                    ? 'bg-purple-500'
                                    : idx < currentQuestion
                                        ? 'bg-green-500'
                                        : 'bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Question Video - Main Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
                                <span>Interview Question</span>
                                {interviewPhase === 'responding' && (
                                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${timeLeft < 30
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        }`}>
                                        <Clock className="w-5 h-5" />
                                        <span className="font-mono font-bold text-lg">
                                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                )}
                            </h3>
                            <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
                                <video
                                    ref={questionVideoRef}
                                    key={currentQuestion}
                                    autoPlay
                                    className="w-full h-full object-cover"
                                    onEnded={handleQuestionVideoEnded}
                                >
                                    <source src={videoQuestions[currentQuestion].videoFile} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                {!questionVideoEnded && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        PLAYING
                                    </div>
                                )}
                            </div>

                            {/* Question Text */}
                            <div className="mt-4 bg-white/50 dark:bg-white/5 rounded-xl p-4">
                                <p className="text-gray-900 dark:text-white text-lg">
                                    {videoQuestions[currentQuestion].text}
                                </p>
                            </div>

                            {/* Controls */}
                            {interviewPhase === 'responding' && (
                                <div className="mt-6 flex justify-center space-x-4">
                                    <button
                                        onClick={stopRecording}
                                        disabled={!isRecording}
                                        className={`flex items-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all shadow-lg ${isRecording
                                            ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-500/25'
                                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            }`}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Finish Answer</span>
                                    </button>
                                    <button
                                        onClick={skipQuestion}
                                        className="flex items-center space-x-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-purple-500/25"
                                    >
                                        <span>Skip Question</span>
                                    </button>
                                </div>
                            )}

                            {interviewPhase === 'watching' && questionVideoEnded && (
                                <div className="mt-6 text-center">
                                    <p className="text-white/70 text-sm">Waiting to start recording...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Candidate Video Feed - Side Panel */}
                    {videoEnabled && (
                        <div className="lg:col-span-1">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 sticky top-6">
                                <h3 className="text-white font-semibold mb-3 flex items-center">
                                    <Video className="w-4 h-4 mr-2" />
                                    Your Video
                                </h3>
                                <div className="relative aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden">
                                    <video
                                        ref={candidateVideoRef}
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    {isRecording && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                            RECORDING
                                        </div>
                                    )}
                                </div>
                                <canvas
                                    ref={canvasRef}
                                    className="hidden"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoInterviewScreen;

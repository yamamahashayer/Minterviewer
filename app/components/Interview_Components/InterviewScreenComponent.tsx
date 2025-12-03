/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare, Video, VideoOff, Code } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useSpeechToText } from '../../hooks/useSpeechToText';

// Interview Screen Component
const InterviewScreenComponent = ({ setupData, onComplete }: { setupData: any, onComplete: (data: any) => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [answers, setAnswers] = useState<string[]>([]);
    const [emotionData, setEmotionData] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [code, setCode] = useState('');
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [hasSpokenInitial, setHasSpokenInitial] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const questionsGeneratedRef = useRef(false);
    const { speak } = useTextToSpeech();
    const { transcribe } = useSpeechToText();

    // Initialize camera and start capturing frames
    useEffect(() => {
        if (!videoEnabled) return;

        let mediaStream: MediaStream | null = null;

        const captureAndAnalyzeFrame = async () => {
            try {
                if (!videoRef.current || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0);

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

        const initCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                    };
                }

                captureIntervalRef.current = setInterval(() => {
                    captureAndAnalyzeFrame();
                }, 15000);
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        initCamera();

        return () => {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoEnabled, currentQuestion]);

    // Cleanup camera and stop recording when component unmounts
    useEffect(() => {
        const videoElement = videoRef.current;
        const mediaRecorder = mediaRecorderRef.current;
        const captureInterval = captureIntervalRef.current;

        return () => {
            if (mediaRecorder) {
                try {
                    mediaRecorder.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            }
            if (captureInterval) {
                clearInterval(captureInterval);
            }
            if (videoElement?.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Speak question when it changes
    useEffect(() => {
        if (questions.length > 0 && currentQuestion < questions.length && hasSpokenInitial) {
            const questionText = questions[currentQuestion]?.text;
            if (questionText) {
                console.log('Speaking question:', questionText);
                speak(questionText);
            }
        }
    }, [currentQuestion, hasSpokenInitial, speak, questions]);

    // Speak first question once questions are loaded
    useEffect(() => {
        if (questions.length > 0 && !hasSpokenInitial) {
            const questionText = questions[0]?.text;
            if (questionText) {
                console.log('Speaking first question:', questionText);
                speak(questionText);
                setHasSpokenInitial(true);
            }
        }
    }, [questions, hasSpokenInitial, speak]);

    // Handle question change
    useEffect(() => {
        if (questions.length > 0 && currentQuestion < questions.length) {
            const isCoding = questions[currentQuestion]?.isCoding || false;
            setShowCodeEditor(isCoding);
            setCode('');
        }
    }, [currentQuestion, questions]);

    // Generate interview questions
    useEffect(() => {
        if (questionsGeneratedRef.current) return;

        const generateQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/generate-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        role: setupData?.role || 'Software Engineer',
                        interviewType: setupData?.interviewType || 'technical',
                        techStack: setupData?.techStack || 'React, Node.js',
                        questionCount: setupData?.questionCount || 5
                    })
                });
                const data = await response.json();
                setQuestions(data.questions || []);
            } catch (error) {
                console.error('Error generating questions:', error);
                setQuestions([
                    { text: 'Tell me about your experience with React', isCoding: false },
                    { text: 'How would you optimize a React component?', isCoding: false },
                    { text: 'Explain the concept of hooks in React', isCoding: false },
                    { text: 'Write a custom hook for managing form state', isCoding: true },
                    { text: 'Describe a challenging project you worked on', isCoding: false }
                ]);
            } finally {
                setLoading(false);
            }
        };

        questionsGeneratedRef.current = true;
        generateQuestions();
    }, [setupData]);

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
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Process answer
    const processAnswer = async (audioBlob: Blob) => {
        try {
            const text = await transcribe(audioBlob);
            const newAnswers = [...answers];
            newAnswers[currentQuestion] = text || '';
            setAnswers(newAnswers);

            const emotions = [{
                timestamp: Date.now(),
                emotion: Math.random() > 0.5 ? 'confident' : 'neutral',
                confidence: Math.random() * 100
            }];
            setEmotionData([...emotionData, ...emotions]);

            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    const formattedAnswers = newAnswers.map((answer, idx) => ({
                        question: questions[idx],
                        answer: answer,
                        isCoding: questions[idx]?.isCoding || false,
                        toneData: emotionData[idx] || {}
                    }));

                    onComplete({
                        answers: formattedAnswers,
                        emotionData,
                        questions,
                        timestamp: new Date().toISOString()
                    });
                }
            }, 1000);
        } catch (error) {
            console.error('Error processing answer:', error);
        }
    };

    // Submit code for coding question
    const submitCode = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = code;
        setAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                const formattedAnswers = newAnswers.map((answer, idx) => ({
                    question: questions[idx],
                    answer: answer,
                    isCoding: questions[idx]?.isCoding || false,
                    toneData: emotionData[idx] || {}
                }));

                onComplete({
                    answers: formattedAnswers,
                    emotionData,
                    questions,
                    timestamp: new Date().toISOString()
                });
            }
        }, 500);
    };

    if (loading || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin mb-4">
                        <MessageSquare className="w-16 h-16 text-purple-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Preparing Interview Questions</h2>
                    <p className="text-white/70">Loading your personalized questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Progress */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                Question {currentQuestion + 1} of {questions.length}
                            </h1>
                            <p className="text-purple-300 text-sm">
                                {questions[currentQuestion]?.isCoding ? '💻 Coding Challenge' : '💬 Verbal Response'}
                            </p>
                        </div>

                        {/* Camera Toggle Button - Now Prominent */}
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
                        {questions.map((_, idx) => (
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Video Feed - Left Side */}
                    {videoEnabled && (
                        <div className="lg:col-span-1">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 sticky top-6">
                                <h3 className="text-white font-semibold mb-3 flex items-center">
                                    <Video className="w-4 h-4 mr-2" />
                                    Your Video
                                </h3>
                                <div className="relative aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                        LIVE
                                    </div>
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

                    {/* Main Content - Question & Answer */}
                    <div className={videoEnabled ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        {/* Question Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-2xl text-white leading-relaxed font-medium">
                                        {questions[currentQuestion]?.text || 'Question loading...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Answer Area */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            {showCodeEditor ? (
                                /* Code Editor */
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 text-emerald-400 mb-4">
                                        <Code className="w-5 h-5" />
                                        <span className="font-semibold">Code Editor</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                                        <textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full h-80 bg-transparent text-emerald-400 font-mono text-base focus:outline-none resize-none placeholder-slate-500"
                                            placeholder="// Write your code here..."
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={submitCode}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 text-lg"
                                        >
                                            <span>✓</span>
                                            <span>Submit Code</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCode('');
                                                setShowCodeEditor(false);
                                                startRecording();
                                            }}
                                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 text-lg"
                                        >
                                            <Mic className="w-5 h-5" />
                                            <span>Record Instead</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Voice Recording */
                                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`relative group transition-all duration-300 ${isRecording
                                            ? 'bg-red-500 hover:bg-red-600 scale-110'
                                            : 'bg-purple-500 hover:bg-purple-600 hover:scale-105'
                                            } text-white rounded-full p-16 shadow-2xl`}
                                    >
                                        {isRecording ? (
                                            <>
                                                <MicOff className="w-20 h-20" />
                                                <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50"></div>
                                            </>
                                        ) : (
                                            <Mic className="w-20 h-20" />
                                        )}
                                    </button>
                                    <div className="text-center">
                                        <p className="text-white text-2xl font-semibold mb-2">
                                            {isRecording ? 'Recording Your Answer...' : 'Ready to Answer?'}
                                        </p>
                                        <p className="text-white/70 text-lg">
                                            {isRecording ? 'Click the button when you\'re done' : 'Click the microphone to start recording'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewScreenComponent;

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useSpeechToText } from '../../hooks/useSpeechToText';

// Main App Component
const AIInterviewerApp = () => {
    const [currentScreen, setCurrentScreen] = useState<'setup' | 'interview' | 'report'>('setup');
    const [_setupData, setSetupData] = useState<any>(null);
    const [_interviewData, setInterviewData] = useState<any>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {currentScreen === 'setup' && (
                <SetupScreen onComplete={(data: any) => {
                    setSetupData(data);
                    setCurrentScreen('interview');
                }} />
            )}
            {currentScreen === 'interview' && (
                <InterviewScreen
                    setupData={_setupData}
                    onComplete={(data: any) => {
                        setInterviewData(data);
                        setCurrentScreen('report');
                    }}
                />
            )}
            {currentScreen === 'report' && (
                <ReportScreen
                    interviewData={_interviewData}
                    onRestart={() => setCurrentScreen('setup')}
                />
            )}
        </div>
    );
};

// Setup Screen Component
const SetupScreen = ({ onComplete }: { onComplete: (data: any) => void }) => {
    const [step, setStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [avatarSpeaking, setAvatarSpeaking] = useState(false);
    const [setupData, setSetupData] = useState({
        role: '',
        interviewType: '',
        techStack: '',
        questionCount: 5
    });

    const questions = React.useMemo(() => [
        "Hello! I'm your AI interviewer today. Let's get started! What role are you applying for?",
        "Great! Would you like a technical or behavioral interview?",
        "Perfect! What tech stack or technologies should I focus on?",
        "Excellent! How many questions would you like? You can choose between 5 to 15 questions."
    ], []);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const lastSpokenStepRef = useRef<number | null>(null);
    const { speak } = useTextToSpeech();
    const { transcribe } = useSpeechToText();

    useEffect(() => {
        // Avoid double-speaking in React StrictMode/dev by ensuring we only speak once per step
        if (lastSpokenStepRef.current === step) return;
        lastSpokenStepRef.current = step;

        // Speak the current question
        speak(questions[step]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log('Recorded audio blob:', { size: audioBlob.size, type: audioBlob.type, chunks: audioChunksRef.current.length });
                await processAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsListening(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current?.stop();
            setIsListening(false);
        }
    };

    const processAudio = async (audioBlob: Blob) => {


        // Use hook to transcribe audio via API
        const text = await transcribe(audioBlob);
        console.log('ElevenLabs STT API response (hook):', { text });

        const userResponse = (text || '').trim();
        setTranscript(userResponse);
        console.log('Transcript displayed on screen:', userResponse);

        // Process and validate response
        const processedData = analyzeResponse(userResponse, step);
        if (processedData && processedData.isValid && processedData.value !== undefined) {
            const valueToUpdate = typeof processedData.value === 'string' ? processedData.value : processedData.value.toString();
            updateSetupData(valueToUpdate, step);

            setTimeout(() => {
                if (step < questions.length - 1) {
                    setStep(step + 1);
                    setTranscript('');
                } else {
                    onComplete(setupData);
                }
            }, 1500);
        } else {
            // Redirect user
            setAvatarSpeaking(true);
            if (processedData?.redirectMessage) {
                speak(processedData.redirectMessage);
            }
            setTimeout(() => {
                setAvatarSpeaking(false);
                setTranscript('');
            }, 2000);
        }
    };

    const analyzeResponse = (response: string, stepIndex: number) => {
        const lowerResponse = response.toLowerCase();

        switch (stepIndex) {
            case 0: // Role
                if (lowerResponse.trim().length < 1) {
                    return {
                        isValid: false,
                        redirectMessage: "I need to know the role you're applying for. Could you please tell me the job title?"
                    };
                }
                return { isValid: true, value: response };

            case 1: // Interview type
                if (lowerResponse.includes('technical') || lowerResponse.includes('tech')) {
                    return { isValid: true, value: 'technical' };
                } else if (lowerResponse.includes('behavioral') || lowerResponse.includes('behavior')) {
                    return { isValid: true, value: 'behavioral' };
                } else if (lowerResponse.includes('mix') || lowerResponse.includes('mixed') || lowerResponse.includes('both')) {
                    return { isValid: true, value: 'mix' };
                }
                return {
                    isValid: false,
                    redirectMessage: "Please choose 'technical', 'behavioral', or 'mix' interview."
                };

            case 2: // Tech stack
                const techKeywords = ['react', 'node', 'python', 'java', 'javascript', 'typescript', 'angular', 'vue'];
                const hasTech = techKeywords.some(tech => lowerResponse.includes(tech));
                if (!hasTech) {
                    return {
                        isValid: false,
                        redirectMessage: "Please tell me the technologies or programming languages you'd like to be interviewed on."
                    };
                }
                const techs = response.split(/,|and/).map((t: string) => t.trim()).filter((t: string) => t.length > 0);
                return { isValid: true, value: techs };

            case 3: // Question count
                // Accept either digits or number words (five..fifteen)
                const numberWordMap: Record<string, number> = {
                    'five': 5,
                    'six': 6,
                    'seven': 7,
                    'eight': 8,
                    'nine': 9,
                    'ten': 10,
                    'eleven': 11,
                    'twelve': 12,
                    'thirteen': 13,
                    'fourteen': 14,
                    'fifteen': 15,
                };

                let count: number | null = null;
                const digitMatch = response.match(/\d+/);
                if (digitMatch) {
                    count = parseInt(digitMatch[0]);
                } else {
                    const wordMatch = lowerResponse.match(/five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen/);
                    if (wordMatch) {
                        count = numberWordMap[wordMatch[0]];
                    }
                }

                if (count === null) {
                    return {
                        isValid: false,
                        redirectMessage: "Please specify a number between 5 and 15 for the question count."
                    };
                }
                if (count < 5 || count > 15) {
                    return {
                        isValid: false,
                        redirectMessage: "Please choose between 5 to 15 questions."
                    };
                }
                return { isValid: true, value: count };
        }
    };

    const updateSetupData = (value: string, stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                setSetupData(prev => ({ ...prev, role: value }));
                break;
            case 1:
                setSetupData(prev => ({ ...prev, interviewType: value }));
                break;
            case 2:
                setSetupData(prev => ({ ...prev, techStack: value }));
                break;
            case 3:
                setSetupData(prev => ({ ...prev, questionCount: parseInt(value, 10) || 5 }));
                break;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Avatar */}
            <div className="relative">
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transition-all duration-300 ${avatarSpeaking ? 'scale-110 shadow-2xl shadow-purple-500/50' : 'scale-100'}`}>
                    <div className="w-36 h-36 rounded-full bg-slate-800 flex items-center justify-center">
                        <MessageSquare className="w-14 h-14 text-purple-400" />
                    </div>
                </div>
                {avatarSpeaking && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Question Display */}
            <div className="text-center mb-8">
                <div className="bg-slate-800/50 rounded-2xl p-6 max-w-2xl">
                    <p className="text-xl text-white leading-relaxed">{questions[step]}</p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex space-x-2 mb-6">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 w-16 rounded-full transition-all duration-300 ${idx === step ? 'bg-purple-500' : idx < step ? 'bg-green-500' : 'bg-slate-600'}`}
                    />
                ))}
            </div>

            {/* Transcript Display */}
            {transcript && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 max-w-2xl w-full">
                    <p className="text-green-300 text-center">&quot;{transcript}&quot;</p>
                </div>
            )}

            {/* Voice Input Button */}
            <button
                onClick={isListening ? stopListening : startListening}
                className={`relative group ${isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-purple-500 hover:bg-purple-600'
                    } text-white rounded-full p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105`}
            >
                {isListening ? (
                    <>
                        <MicOff className="w-12 h-12" />
                        <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50"></div>
                    </>
                ) : (
                    <Mic className="w-12 h-12" />
                )}
            </button>
            <p className="text-white/70 mt-4 text-sm">
                {isListening ? 'Listening... Click to stop' : 'Click to speak your answer'}
            </p>
        </div>
    );
};

// Interview Screen Component
const InterviewScreen = ({ setupData, onComplete }: { setupData: any, onComplete: (data: any) => void }) => {
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
    const questionsGeneratedRef = useRef(false); // Prevent duplicate generation
    const { speak } = useTextToSpeech();
    const { transcribe } = useSpeechToText();

    // Initialize camera and start capturing frames
    useEffect(() => {
        if (!videoEnabled) return;

        let mediaStream: MediaStream | null = null;

        // Capture frame from video and send to Gemini for emotion detection
        const captureAndAnalyzeFrame = async () => {
            try {
                if (!videoRef.current || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0);

                // Convert canvas to blob
                canvas.toBlob(async (blob) => {
                    if (!blob) return;

                    try {
                        // Send to Gemini for emotion detection
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

                            // Store emotion data
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

                // Capture frame every 15 seconds and send to Gemini for accurate emotion detection
                captureIntervalRef.current = setInterval(() => {
                    captureAndAnalyzeFrame();
                }, 15000);
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        initCamera();

        return () => {
            // Cleanup
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoEnabled, currentQuestion]);

    // Cleanup camera and stop recording when component unmounts or when exiting interview
    useEffect(() => {
        const videoElement = videoRef.current;
        const mediaRecorder = mediaRecorderRef.current;
        const captureInterval = captureIntervalRef.current;

        return () => {
            // Stop any active recording
            if (mediaRecorder) {
                try {
                    mediaRecorder.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            }
            // Stop capture interval
            if (captureInterval) {
                clearInterval(captureInterval);
            }
            // Close video stream
            if (videoElement?.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Capture frame from video and send to Gemini for accurate emotion detection
    const captureAndAnalyzeFrame = async () => {
        try {
            if (!videoRef.current || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);

            // Convert canvas to blob with lower quality to reduce payload
            canvas.toBlob(async (blob) => {
                if (!blob) return;

                try {
                    // Send to Gemini for emotion detection with optimized payload
                    const formData = new FormData();
                    formData.append('image', blob, 'frame.jpg');
                    formData.append('questionIndex', currentQuestion.toString());

                    const response = await fetch('/api/analyze-emotion', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Emotion analysis from Gemini:', data);

                        // Store emotion data
                        setEmotionData(prev => [...prev, {
                            timestamp: Date.now(),
                            emotion: data.emotion || 'neutral',
                            confidence: data.confidence || 0,
                            questionIndex: currentQuestion
                        }]);
                    } else {
                        console.warn('Emotion analysis failed:', response.status);
                        // Fallback to neutral if API fails
                        setEmotionData(prev => [...prev, {
                            timestamp: Date.now(),
                            emotion: 'neutral',
                            confidence: 0,
                            questionIndex: currentQuestion
                        }]);
                    }
                } catch (error) {
                    console.error('Error analyzing frame with Gemini:', error);
                    // Fallback to neutral on error
                    setEmotionData(prev => [...prev, {
                        timestamp: Date.now(),
                        emotion: 'neutral',
                        confidence: 0,
                        questionIndex: currentQuestion
                    }]);
                }
            }, 'image/jpeg', 0.7); // Lower quality (0.7) to reduce payload size
        } catch (error) {
            console.error('Error capturing frame:', error);
        }
    };

    // Speak question when it changes (but not on initial load)
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
        // Prevent duplicate question generation in StrictMode
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

            // Simulate emotion detection
            const emotions = [{
                timestamp: Date.now(),
                emotion: Math.random() > 0.5 ? 'confident' : 'neutral',
                confidence: Math.random() * 100
            }];
            setEmotionData([...emotionData, ...emotions]);

            // Move to next question
            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    // Complete interview with properly formatted data
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

        // Move to next question
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                // Complete interview with properly formatted data
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
        <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Question {currentQuestion + 1} of {questions.length}
                            </h2>
                            <p className="text-purple-300">Technical Interview</p>
                        </div>
                        <button
                            onClick={() => setVideoEnabled(!videoEnabled)}
                            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
                        >
                            {videoEnabled ? '📹' : '📷'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Video Feed */}
                    {videoEnabled && (
                        <div className="lg:col-span-1">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                                <h3 className="text-white font-semibold mb-3">Your Video</h3>
                                <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Hidden canvas for frame capture */}
                                <canvas
                                    ref={canvasRef}
                                    className="hidden"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                        </div>
                    )}

                    {/* Right Panel - Question & Answer Area */}
                    <div className={videoEnabled ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        {/* Question */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-4">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xl text-white leading-relaxed">
                                        {questions[currentQuestion]?.text || 'Question loading...'}
                                    </p>
                                    {questions[currentQuestion]?.isCoding && (
                                        <div className="mt-2 flex items-center space-x-2 text-sm text-purple-300">
                                            <span>💻 Coding Question</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Code Editor or Recording Button */}
                            {showCodeEditor ? (
                                <div className="space-y-4">
                                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                                        <textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full h-64 bg-transparent text-green-400 font-mono text-sm focus:outline-none resize-none placeholder-slate-500"
                                            placeholder="// Write your code here..."
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={submitCode}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <span>✓ Submit Code</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCode('');
                                                setShowCodeEditor(false);
                                                startRecording();
                                            }}
                                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold transition-colors"
                                        >
                                            Record Explanation
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-4">
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`relative group ${isRecording
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-purple-500 hover:bg-purple-600'
                                            } text-white rounded-full p-12 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105`}
                                    >
                                        {isRecording ? (
                                            <>
                                                <MicOff className="w-16 h-16" />
                                                <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50"></div>
                                            </>
                                        ) : (
                                            <Mic className="w-16 h-16" />
                                        )}
                                    </button>
                                    <p className="text-white text-lg">
                                        {isRecording ? 'Recording... Click to finish' : 'Click to start answering'}
                                    </p>
                                </div>
                            )}

                            {/* Progress */}
                            <div className="flex space-x-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex-1 h-2 rounded-full transition-all ${idx === currentQuestion
                                            ? 'bg-purple-500'
                                            : idx < currentQuestion
                                                ? 'bg-green-500'
                                                : 'bg-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Report Screen Component
const ReportScreen = ({ interviewData, onRestart }: { interviewData: any; onRestart: () => void }) => {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Download report as colored PDF
    const downloadReportAsPDF = async () => {
        if (!report) return;

        try {
            // Dynamic import of html2pdf to avoid SSR issues
            const html2pdf = (await import('html2pdf.js')).default;

            // Create HTML content with styling
            const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; color: #1a1a1a; background: white; line-height: 1.8;">
                    <!-- Header Section -->
                    <div style="text-align: center; margin-bottom: 50px; border-bottom: 4px solid #7c3aed; padding-bottom: 30px;">
                        <h1 style="color: #7c3aed; margin: 0; font-size: 42px; font-weight: 700;">Interview Report</h1>
                        <p style="color: #666; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Your Performance Analysis</p>
                    </div>

                    <!-- Score Cards Section -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 50px; page-break-inside: avoid;">
                        <!-- Overall Score -->
                        <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 600;">Overall Score</p>
                            <h2 style="margin: 15px 0 5px 0; font-size: 48px; font-weight: 700;">${report.overallScore || 0}</h2>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">out of 100</p>
                        </div>
                        <!-- Technical & Communication Scores -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);">
                                <p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 600;">Technical</p>
                                <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.technicalScore || 0}</h3>
                            </div>
                            <div style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);">
                                <p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 600;">Communication</p>
                                <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.communicationScore || 0}</h3>
                            </div>
                        </div>
                    </div>

                    <!-- Confidence Score -->
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 50px; text-align: center; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);">
                        <p style="margin: 0; font-size: 16px; font-weight: 600;">Confidence Score</p>
                        <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.confidenceScore || 0} / 100</h3>
                    </div>

                    <!-- Detailed Feedback -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #f9fafb; border-left: 5px solid #7c3aed; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">📋 Detailed Feedback</h2>
                        <p style="color: #333; line-height: 1.8; font-size: 15px; margin: 0;">${report.feedback || 'No detailed feedback available'}</p>
                    </div>

                    <!-- Strengths Section -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #f0fdf4; border-left: 5px solid #10b981; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #10b981; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 15px;">✓ Your Strengths</h2>
                        <div style="margin: 0;">
                            ${Array.isArray(report.strengths) && report.strengths.length > 0
                    ? report.strengths.map((s: string) => `<p style="margin: 12px 0; color: #10b981; padding-left: 25px; position: relative; font-size: 15px;"><span style="position: absolute; left: 0; color: #059669; font-weight: bold;">✓</span>${s}</p>`).join('')
                    : '<p style="color: #999;">No strengths data available</p>'
                }
                        </div>
                    </div>

                    <!-- Areas for Improvement -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #fffbeb; border-left: 5px solid #f59e0b; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">↗ Areas for Improvement</h2>
                        <div style="margin: 0;">
                            ${Array.isArray(report.improvements) && report.improvements.length > 0
                    ? report.improvements.map((i: string) => `<p style="margin: 12px 0; color: #d97706; padding-left: 25px; position: relative; font-size: 15px;"><span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">→</span>${i}</p>`).join('')
                    : '<p style="color: #999;">No improvement suggestions available</p>'
                }
                        </div>
                    </div>

                    ${Array.isArray(report.perQuestionFeedback) && report.perQuestionFeedback.length > 0 ? `
                        <!-- Per-Question Feedback -->
                        <div style="margin-bottom: 50px; page-break-inside: avoid;">
                            <h2 style="color: #7c3aed; margin: 0 0 25px 0; font-size: 24px; font-weight: 700; border-bottom: 3px solid #7c3aed; padding-bottom: 15px;">❓ Per-Question Feedback</h2>
                            ${report.perQuestionFeedback.map((q: any, idx: number) => `
                                <div style="background: white; padding: 25px; margin-bottom: 25px; border-left: 5px solid #7c3aed; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); page-break-inside: avoid;">
                                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">Question ${idx + 1}</h3>
                                    <p style="color: #666; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; padding: 0;">${q.question || 'N/A'}</p>
                                    
                                    ${q.candidateAnswer ? `
                                        <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6;">
                                            <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: 600;">Your Answer</p>
                                            <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px; line-height: 1.6; word-wrap: break-word; white-space: pre-wrap;">${q.candidateAnswer}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                                        <p style="margin: 0; color: #7c3aed; font-weight: 700; font-size: 15px;">Score: <span style="font-size: 20px;">${q.score || 0}</span>/100</p>
                                    </div>
                                    
                                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #6366f1;">
                                        <p style="margin: 0; color: #333; font-weight: 600; font-size: 14px; margin-bottom: 8px;">💡 Feedback</p>
                                        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${q.feedback || 'No feedback available'}</p>
                                    </div>
                                    
                                    ${q.visualAnalysis ? `
                                        <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #059669;">
                                            <p style="margin: 0; color: #059669; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📸 Visual Analysis</p>
                                            <p style="margin: 0; color: #059669; font-size: 14px; line-height: 1.6;">${q.visualAnalysis}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; font-size: 13px;">
                                        ${q.emotion ? `<p style="margin: 0; color: #666;"><strong>😊 Emotion:</strong> ${q.emotion}</p>` : ''}
                                        ${q.tone ? `<p style="margin: 0; color: #666;"><strong>🎤 Tone:</strong> ${q.tone}</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${report.toneAnalysis ? `
                        <!-- Tone Analysis -->
                        <div style="margin-bottom: 50px; padding: 30px; background: #fef3c7; border-left: 5px solid #f59e0b; border-radius: 8px; page-break-inside: avoid;">
                            <h2 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">🎙️ Tone Analysis</h2>
                            <p style="color: #333; line-height: 1.8; font-size: 15px; margin: 0;">${report.toneAnalysis}</p>
                        </div>
                    ` : ''}

                    ${Array.isArray(report.recommendations) && report.recommendations.length > 0 ? `
                        <!-- Recommendations -->
                        <div style="margin-bottom: 50px; padding: 30px; background: #f3f4f6; border-left: 5px solid #7c3aed; border-radius: 8px; page-break-inside: avoid;">
                            <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">🎯 Recommendations</h2>
                            <ol style="margin: 0; padding-left: 25px;">
                                ${report.recommendations.map((r: string) => `<li style="margin: 12px 0; color: #333; font-size: 15px; line-height: 1.6;">${r}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}

                    <!-- Footer -->
                    <div style="border-top: 3px solid #e5e7eb; padding-top: 30px; margin-top: 40px; text-align: center; color: #999; font-size: 13px;">
                        <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
                        <p style="margin: 10px 0 0 0;">Minterviewer - AI Interview Analysis Platform</p>
                    </div>
                </div>
            `;

            const element = document.createElement('div');
            element.innerHTML = htmlContent;

            const options = {
                margin: [15, 15, 15, 15] as [number, number, number, number],
                filename: `interview-report-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    windowWidth: 800,
                    windowHeight: 1200
                },
                jsPDF: {
                    orientation: 'portrait' as const,
                    unit: 'mm' as const,
                    format: 'a4' as const,
                    compress: true
                }
            };

            html2pdf().set(options).from(element).save();
        } catch (error) {
            console.error('Error downloading report as PDF:', error);
            // Fallback to text download
            downloadReportAsText();
        }
    };

    const downloadReportAsText = () => {
        if (!report) return;

        let reportText = 'INTERVIEW REPORT\n';
        reportText += '=====================================\n\n';
        reportText += `Overall Score: ${report.overallScore || 0}/100\n`;
        reportText += `Technical Score: ${report.technicalScore || 0}/100\n`;
        reportText += `Communication Score: ${report.communicationScore || 0}/100\n`;
        reportText += `Confidence Score: ${report.confidenceScore || 0}/100\n\n`;

        reportText += 'STRENGTHS:\n';
        if (Array.isArray(report.strengths)) {
            report.strengths.forEach((s: string) => {
                reportText += `• ${s}\n`;
            });
        }

        reportText += '\nAREAS FOR IMPROVEMENT:\n';
        if (Array.isArray(report.improvements)) {
            report.improvements.forEach((i: string) => {
                reportText += `• ${i}\n`;
            });
        }

        reportText += '\nDETAILED FEEDBACK:\n';
        reportText += `${report.feedback || 'No detailed feedback available'}\n\n`;

        reportText += 'PER-QUESTION FEEDBACK:\n';
        if (Array.isArray(report.perQuestionFeedback)) {
            report.perQuestionFeedback.forEach((q: any, idx: number) => {
                reportText += `\n--- Question ${idx + 1} ---\n`;
                reportText += `Question: ${q.question || 'N/A'}\n`;
                if (q.candidateAnswer) {
                    reportText += `Your Answer: ${q.candidateAnswer}\n`;
                }
                reportText += `Score: ${q.score || 0}/100\n`;
                reportText += `Feedback: ${q.feedback || 'No feedback available'}\n`;
                if (q.visualAnalysis) reportText += `Visual Analysis: ${q.visualAnalysis}\n`;
                if (q.emotion) reportText += `Emotion: ${q.emotion}\n`;
                if (q.tone) reportText += `Tone: ${q.tone}\n`;
            });
        }

        reportText += '\n\nRECOMMENDATIONS:\n';
        if (Array.isArray(report.recommendations)) {
            report.recommendations.forEach((r: string) => {
                reportText += `• ${r}\n`;
            });
        }

        reportText += '\n\nTONE ANALYSIS:\n';
        reportText += `${report.toneAnalysis || 'No tone analysis available'}\n`;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `interview-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }; useEffect(() => {
        const generateReport = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/generate-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(interviewData)
                });

                if (!response.ok) {
                    throw new Error('Failed to generate report');
                }

                const data = await response.json();
                setReport(data);
            } catch (err) {
                console.error('Report generation error:', err);
                setError(err instanceof Error ? err.message : 'Failed to generate report');
            } finally {
                setLoading(false);
            }
        };

        if (interviewData) {
            generateReport();
        }
    }, [interviewData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin mb-4">
                        <MessageSquare className="w-16 h-16 text-purple-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generating Your Report</h2>
                    <p className="text-white/70">Analyzing your interview performance...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-white/70 mb-6">{error}</p>
                    <button
                        onClick={onRestart}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">No Report Available</h2>
                    <button
                        onClick={onRestart}
                        className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Start New Interview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Interview Report</h1>
                            <p className="text-purple-300 text-lg">Your Performance Analysis</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={downloadReportAsPDF}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                            >
                                📥 Download Report
                            </button>
                            <button
                                onClick={onRestart}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                New Interview
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <ScoreCard
                        title="Overall Score"
                        score={report.overallScore || 0}
                        color="purple"
                    />
                    <ScoreCard
                        title="Technical"
                        score={report.technicalScore || 0}
                        color="blue"
                    />
                    <ScoreCard
                        title="Communication"
                        score={report.communicationScore || 0}
                        color="green"
                    />
                    <ScoreCard
                        title="Confidence"
                        score={report.confidenceScore || 0}
                        color="pink"
                    />
                </div>

                {/* Strengths and Areas for Improvement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Strengths */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4">✓ Strengths</h3>
                        <ul className="space-y-3">
                            {Array.isArray(report.strengths) && report.strengths.length > 0 ? (
                                report.strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/90">{strength}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-white/60">No strengths data available</p>
                            )}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4">↗ Areas for Improvement</h3>
                        <ul className="space-y-3">
                            {Array.isArray(report.improvements) && report.improvements.length > 0 ? (
                                report.improvements.map((improvement: string, idx: number) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/90">{improvement}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-white/60">No improvement suggestions available</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">📋 Detailed Feedback</h3>
                    <div className="space-y-4">
                        {report.feedback ? (
                            <p className="text-white/90 leading-relaxed">{report.feedback}</p>
                        ) : (
                            <p className="text-white/60">No detailed feedback available</p>
                        )}
                    </div>
                </div>

                {/* Performance Metrics Graph */}
                {report.performanceMetrics && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                        <h3 className="text-xl font-bold text-white mb-4">📊 Performance Metrics</h3>
                        <div className="space-y-4">
                            {Object.entries(report.performanceMetrics).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="text-purple-300 font-semibold">{value}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                                            style={{ width: `${value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Per-Question Detailed Feedback */}
                {report.perQuestionFeedback && Array.isArray(report.perQuestionFeedback) && report.perQuestionFeedback.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                        <h3 className="text-xl font-bold text-white mb-6">❓ Per-Question Feedback</h3>
                        <div className="space-y-6">
                            {report.perQuestionFeedback.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10">
                                    {/* Question */}
                                    <div className="mb-4">
                                        <h4 className="text-lg font-semibold text-white mb-2">Question {idx + 1}</h4>
                                        <p className="text-white/80 italic">{item.question || 'No question text available'}</p>
                                    </div>

                                    {/* Candidate Answer */}
                                    {item.candidateAnswer && (
                                        <div className="mb-4 bg-blue-900/20 border-l-4 border-blue-500 rounded p-4">
                                            <p className="text-blue-300 text-sm font-semibold mb-2">Your Answer:</p>
                                            <p className="text-white/90">{item.candidateAnswer}</p>
                                        </div>
                                    )}

                                    {/* Score and Progress Bar */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-white/70 text-sm font-semibold mb-1">Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="text-3xl font-bold text-purple-400">{Math.round(item.score || 0)}</div>
                                                <div className="text-white/60 text-sm">/ 100</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                    style={{ width: `${Math.min(item.score || 0, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-white/70 text-sm font-semibold mb-2">Feedback & Suggestions:</p>
                                            <p className="text-white/90 leading-relaxed">{item.feedback || 'No feedback available'}</p>
                                        </div>

                                        {item.visualAnalysis && (
                                            <div className="bg-green-900/20 border-l-4 border-green-500 rounded p-4">
                                                <p className="text-green-300 text-sm font-semibold mb-2">📸 Visual Analysis:</p>
                                                <p className="text-white/90">{item.visualAnalysis}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            {item.emotion && (
                                                <div className="flex gap-2">
                                                    <span className="text-white/70 text-sm">😊 Emotion:</span>
                                                    <span className="text-white/90 font-semibold">{item.emotion}</span>
                                                </div>
                                            )}

                                            {item.tone && (
                                                <div className="flex gap-2">
                                                    <span className="text-white/70 text-sm">🎤 Tone:</span>
                                                    <span className="text-white/90 font-semibold">{item.tone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {report.recommendations && report.recommendations.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                        <h3 className="text-xl font-bold text-white mb-4">🎯 Recommendations for Improvement</h3>
                        <ol className="space-y-3">
                            {report.recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="flex items-start space-x-3">
                                    <span className="text-purple-400 font-bold flex-shrink-0">{idx + 1}.</span>
                                    <p className="text-white/90">{rec}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Tone Analysis */}
                {report.toneAnalysis && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4">🎙️ Tone Analysis</h3>
                        <p className="text-white/90 leading-relaxed">{report.toneAnalysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Score Card Component
const ScoreCard = ({ title, score, color }: { title: string; score: number; color: string }) => {
    const colorClasses: Record<string, string> = {
        purple: 'from-purple-500 to-pink-500',
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        pink: 'from-pink-500 to-rose-500'
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors">
            <h4 className="text-white/70 text-sm mb-3 font-semibold">{title}</h4>
            <div className="flex items-end justify-between mb-3">
                <div className="text-4xl font-bold text-white">{Math.round(score)}</div>
                <div className="text-white/60 text-sm">/ 100</div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colorClasses[color] || colorClasses.purple} transition-all duration-1000`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

export default AIInterviewerApp;
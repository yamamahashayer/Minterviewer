/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useSpeechToText } from '../../hooks/useSpeechToText';

// Setup Screen Component
const SetupScreenComponent = ({ onComplete }: { onComplete: (data: any) => void }) => {
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

export default SetupScreenComponent;

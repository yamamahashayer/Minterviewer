import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface EmotionData {
    emotion: string;
    confidence: number;
    timestamp: number;
    allExpressions: any;
}

export const useEmotionDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
    const [isReady, setIsReady] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
    const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                ]);
                setIsReady(true);
            } catch (error) {
                console.error('Failed to load face-api models:', error);
            }
        };

        loadModels();
    }, []);

    const detectEmotion = useCallback(async () => {
        if (!isReady || !videoRef.current) return null;

        try {
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (!detections) return null;

            const expressions = detections.expressions;
            const dominantEntry = Object.entries(expressions).reduce((a, b) =>
                a[1] > b[1] ? a : b
            );

            const emotionData: EmotionData = {
                emotion: dominantEntry[0],
                confidence: dominantEntry[1],
                timestamp: Date.now(),
                allExpressions: expressions,
            };

            setCurrentEmotion(emotionData);
            setEmotionHistory(prev => [...prev, emotionData]);

            return emotionData;
        } catch (error) {
            console.error('Emotion detection error:', error);
            return null;
        }
    }, [isReady, videoRef]);

    const startDetection = useCallback((interval = 2000) => {
        if (detectionIntervalRef.current) return;

        detectionIntervalRef.current = setInterval(detectEmotion, interval);
    }, [detectEmotion]);

    const stopDetection = useCallback(() => {
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        setCurrentEmotion(null);
        setEmotionHistory([]);
    }, []);

    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    return {
        isReady,
        currentEmotion,
        emotionHistory,
        detectEmotion,
        startDetection,
        stopDetection,
        reset,
    };
};

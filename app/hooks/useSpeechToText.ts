import { useState, useCallback } from 'react';

export const useSpeechToText = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string>('');

    const transcribe = useCallback(async (audioBlob: Blob) => {
        try {
            setIsProcessing(true);

            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');

            const response = await fetch('/api/openai-stt', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('STT request failed');
            }

            const data = await response.json();
            console.log('STT API response', data);
            setTranscript(data.text);
            console.log('STT transcript used', data.text);
            return data.text;
        } catch (error) {
            console.error('STT Error:', error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const reset = useCallback(() => {
        setTranscript('');
    }, []);

    return { isProcessing, transcript, transcribe, reset };
};
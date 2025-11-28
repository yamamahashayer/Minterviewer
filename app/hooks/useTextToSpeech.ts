// hooks/useTextToSpeech.ts
import { useState, useCallback, useRef } from 'react';

// Cache finished audio blobs
const ttsCache = new Map<string, Blob>();
// NEW: cache in-flight fetches so duplicate speak() calls await the same request
const inflight = new Map<string, Promise<Blob>>();

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const speak = useCallback(async (text: string) => {
        if (!text?.trim()) return;

        // Don’t queue up duplicates while something is already playing
        if (audioRef.current && !audioRef.current.ended && !audioRef.current.paused) return;

        try {
            setIsSpeaking(true);

            // Stop prior audio
            if (audioRef.current) {
                try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch { }
            }

            let blob = ttsCache.get(text);
            if (!blob) {
                let p = inflight.get(text);
                if (!p) {
                    p = fetch('/api/elevenlabs-tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text }),
                    })
                        .then(async (res) => {
                            if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);
                            return res.blob();
                        })
                        .finally(() => inflight.delete(text));
                    inflight.set(text, p);
                }
                blob = await p;
                ttsCache.set(text, blob);
            }

            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
            audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
            audioRef.current = audio;
            await audio.play();
        } catch (err) {
            console.error('TTS Error:', err);
            setIsSpeaking(false);
            // Log the error details so user can see what's wrong
            console.error('Failed to use ElevenLabs TTS. Make sure ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are set.');
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch { }
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch { }
        }
        setIsSpeaking(false);
    }, []);

    return { isSpeaking, speak, stop };
};

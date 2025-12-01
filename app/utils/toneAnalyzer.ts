// utils/toneAnalyzer.ts
export interface ToneAnalysis {
    tone: 'confident' | 'nervous' | 'enthusiastic' | 'calm' | 'hesitant';
    confidence: number;
    metrics: {
        averageVolume: number;
        peakVolume: number;
        speechRate: number;
        pauseCount: number;
    };
}

export class ToneAnalyzer {
    static async analyzeTone(audioBlob: Blob): Promise<ToneAnalysis> {
        try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const channelData = audioBuffer.getChannelData(0);
            const sampleRate = audioBuffer.sampleRate;
            const duration = audioBuffer.duration;

            // Calculate metrics
            const metrics = this.calculateMetrics(channelData, sampleRate, duration);
            const tone = this.determineTone(metrics);

            return {
                tone: tone.type,
                confidence: tone.confidence,
                metrics,
            };
        } catch (error) {
            console.error('Tone analysis error:', error);
            return {
                tone: 'calm',
                confidence: 0.5,
                metrics: {
                    averageVolume: 0,
                    peakVolume: 0,
                    speechRate: 0,
                    pauseCount: 0,
                },
            };
        }
    }

    private static calculateMetrics(
        channelData: Float32Array,
        sampleRate: number,
        duration: number
    ) {
        let sum = 0;
        let peakVolume = 0;
        let silenceCount = 0;
        const silenceThreshold = 0.01;

        for (let i = 0; i < channelData.length; i++) {
            const amplitude = Math.abs(channelData[i]);
            sum += amplitude;
            peakVolume = Math.max(peakVolume, amplitude);

            if (amplitude < silenceThreshold) {
                silenceCount++;
            }
        }

        const averageVolume = sum / channelData.length;
        const speechRate = (channelData.length - silenceCount) / sampleRate / duration;
        const pauseCount = this.countPauses(channelData, silenceThreshold);

        return {
            averageVolume,
            peakVolume,
            speechRate,
            pauseCount,
        };
    }

    private static countPauses(data: Float32Array, threshold: number): number {
        let pauseCount = 0;
        let inPause = false;
        const minPauseLength = 1000; // samples

        let pauseLength = 0;

        for (let i = 0; i < data.length; i++) {
            if (Math.abs(data[i]) < threshold) {
                if (!inPause) {
                    inPause = true;
                    pauseLength = 0;
                }
                pauseLength++;
            } else {
                if (inPause && pauseLength > minPauseLength) {
                    pauseCount++;
                }
                inPause = false;
            }
        }

        return pauseCount;
    }

    private static determineTone(metrics: any) {
        const { averageVolume, peakVolume, speechRate, pauseCount } = metrics;

        // Confident: High volume, steady rate, few pauses
        if (averageVolume > 0.2 && speechRate > 0.7 && pauseCount < 3) {
            return { type: 'confident' as const, confidence: 0.85 };
        }

        // Enthusiastic: High volume, fast rate
        if (averageVolume > 0.25 && peakVolume > 0.6 && speechRate > 0.8) {
            return { type: 'enthusiastic' as const, confidence: 0.8 };
        }

        // Nervous: Variable volume, many pauses
        if (pauseCount > 5 && peakVolume > 0.5) {
            return { type: 'nervous' as const, confidence: 0.75 };
        }

        // Hesitant: Low volume, slow rate, many pauses
        if (averageVolume < 0.15 && speechRate < 0.5 && pauseCount > 4) {
            return { type: 'hesitant' as const, confidence: 0.7 };
        }

        // Default: Calm
        return { type: 'calm' as const, confidence: 0.65 };
    }
}


// lib/emotion-detection.ts
// Client-side emotion detection using face-api.js
export class EmotionDetector {
    private modelLoaded = false;

    async loadModels() {
        if (this.modelLoaded) return;

        const MODEL_URL = '/models';

        // Load face-api.js models
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        this.modelLoaded = true;
    }

    async detectEmotion(videoElement: HTMLVideoElement) {
        if (!this.modelLoaded) {
            await this.loadModels();
        }

        const detections = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (!detections) {
            return null;
        }

        const expressions = detections.expressions;
        const dominant = Object.entries(expressions).reduce((a, b) =>
            expressions[a[0]] > expressions[b[0]] ? a : b
        );

        return {
            emotion: dominant[0],
            confidence: dominant[1],
            allExpressions: expressions,
            timestamp: Date.now(),
        };
    }
}

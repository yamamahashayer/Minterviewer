// utils/reportGenerator.ts
export class ReportGenerator {
    static async generateReport(data: any): Promise<any> {
        try {
            const response = await fetch('/api/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Report generation failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Report generation error:', error);
            throw error;
        }
    }

    static calculateEmotionBreakdown(emotionData: any[]) {
        const emotionCounts: Record<string, number> = {};

        emotionData.forEach(data => {
            emotionCounts[data.emotion] = (emotionCounts[data.emotion] || 0) + 1;
        });

        const total = emotionData.length;
        const breakdown: Record<string, number> = {};

        Object.keys(emotionCounts).forEach(emotion => {
            breakdown[emotion] = Math.round((emotionCounts[emotion] / total) * 100);
        });

        return breakdown;
    }

    static calculateDominantEmotion(emotionData: any[]) {
        const breakdown = this.calculateEmotionBreakdown(emotionData);
        const dominant = Object.entries(breakdown).reduce((a, b) =>
            a[1] > b[1] ? a : b
        );
        return dominant[0];
    }
}

// utils/codeAnalyzer.ts
export interface CodeAnalysis {
    correctness: number;
    quality: number;
    efficiency: number;
    bestPractices: number;
    feedback: string[];
    suggestions: string[];
}

export class CodeAnalyzer {
    static async analyzeCode(code: string, question: string): Promise<CodeAnalysis> {
        try {
            const response = await fetch('/api/analyze-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, question }),
            });

            if (!response.ok) {
                throw new Error('Code analysis failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Code analysis error:', error);
            return {
                correctness: 50,
                quality: 50,
                efficiency: 50,
                bestPractices: 50,
                feedback: ['Unable to analyze code automatically'],
                suggestions: ['Please review your code manually'],
            };
        }
    }

    static detectSyntaxErrors(code: string, language: string): string[] {
        const errors: string[] = [];

        // Basic syntax checking for JavaScript/TypeScript
        if (language === 'javascript' || language === 'typescript') {
            try {
                new Function(code);
            } catch (e: any) {
                errors.push(e.message);
            }
        }

        return errors;
    }
}
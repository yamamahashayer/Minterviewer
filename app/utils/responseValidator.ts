// utils/responseValidator.ts
export interface ValidationResult {
    isValid: boolean;
    extractedValue?: any;
    redirectMessage?: string;
    confidence: number;
}

export class ResponseValidator {
    static validateRole(response: string): ValidationResult {
        const lowerResponse = response.toLowerCase();
        const roleKeywords = [
            'developer', 'engineer', 'manager', 'designer',
            'analyst', 'architect', 'consultant', 'specialist'
        ];

        const hasRoleKeyword = roleKeywords.some(keyword =>
            lowerResponse.includes(keyword)
        );

        if (response.length < 3) {
            return {
                isValid: false,
                redirectMessage: "I didn't quite catch that. Could you please tell me the role you're applying for?",
                confidence: 0,
            };
        }

        if (!hasRoleKeyword) {
            return {
                isValid: false,
                redirectMessage: "I need to know the job title or role you're interviewing for. Could you please specify?",
                confidence: 0.3,
            };
        }

        return {
            isValid: true,
            extractedValue: response,
            confidence: 0.9,
        };
    }

    static validateInterviewType(response: string): ValidationResult {
        const lowerResponse = response.toLowerCase();

        if (lowerResponse.includes('technical') || lowerResponse.includes('tech')) {
            return {
                isValid: true,
                extractedValue: 'technical',
                confidence: 0.95,
            };
        }

        if (lowerResponse.includes('behavioral') || lowerResponse.includes('behavior')) {
            return {
                isValid: true,
                extractedValue: 'behavioral',
                confidence: 0.95,
            };
        }

        return {
            isValid: false,
            redirectMessage: "Please choose either 'technical' or 'behavioral' for the interview type.",
            confidence: 0,
        };
    }

    static validateTechStack(response: string): ValidationResult {
        const lowerResponse = response.toLowerCase();
        const techKeywords = [
            'react', 'angular', 'vue', 'svelte', 'node', 'express',
            'python', 'django', 'flask', 'java', 'spring', 'javascript',
            'typescript', 'go', 'rust', 'ruby', 'rails', 'php', 'laravel',
            'sql', 'mongodb', 'postgres', 'mysql', 'redis', 'aws', 'azure',
            'docker', 'kubernetes', 'graphql', 'rest', 'api', 'problemSolving'
        ];

        const foundTechs = techKeywords.filter(tech =>
            lowerResponse.includes(tech)
        );

        if (foundTechs.length === 0) {
            return {
                isValid: false,
                redirectMessage: "Please tell me the programming languages or technologies you'd like to be interviewed on.",
                confidence: 0,
            };
        }

        // Split by common separators
        const techs = response
            .split(/[,;]|and/)
            .map(t => t.trim())
            .filter(t => t.length > 0);

        return {
            isValid: true,
            extractedValue: techs,
            confidence: 0.85,
        };
    }

    static validateQuestionCount(response: string): ValidationResult {
        const numbers = response.match(/\d+/g);

        if (!numbers || numbers.length === 0) {
            return {
                isValid: false,
                redirectMessage: "Please specify a number between 5 and 15 for the question count.",
                confidence: 0,
            };
        }

        const count = parseInt(numbers[0]);

        if (count < 5) {
            return {
                isValid: false,
                redirectMessage: "The minimum number of questions is 5. How many questions would you like?",
                confidence: 0.3,
            };
        }

        if (count > 15) {
            return {
                isValid: false,
                redirectMessage: "The maximum number of questions is 15. Please choose a lower number.",
                confidence: 0.3,
            };
        }

        return {
            isValid: true,
            extractedValue: count,
            confidence: 0.95,
        };
    }

    static detectIrrelevantResponse(response: string, context: string): boolean {
        const lowerResponse = response.toLowerCase();

        // Common off-topic indicators
        const offTopicKeywords = [
            'weather', 'movie', 'food', 'sports', 'politics',
            'personal life', 'vacation', 'weekend'
        ];

        return offTopicKeywords.some(keyword =>
            lowerResponse.includes(keyword) && !context.toLowerCase().includes(keyword)
        );
    }
}
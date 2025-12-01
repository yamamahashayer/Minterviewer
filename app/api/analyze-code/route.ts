import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { code, question } = await req.json();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert code reviewer. Analyze the following code solution and provide:
1. Correctness score (0-100)
2. Code quality score (0-100)
3. Efficiency score (0-100)
4. Best practices score (0-100)
5. Detailed feedback
6. Suggestions for improvement

Return your response as a JSON object.`,
                },
                {
                    role: 'user',
                    content: `Question: ${question}\n\nCode:\n${code}`,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const analysis = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Code Analysis Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze code' },
            { status: 500 }
        );
    }
}
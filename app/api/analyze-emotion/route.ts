import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        // Validate API key
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY environment variable is not set' },
                { status: 500 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const image = formData.get('image') as Blob;

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Convert blob to base64
        const bytes = await image.arrayBuffer();
        const base64Image = Buffer.from(bytes).toString('base64');

        // Call Gemini Vision API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze this interview candidate's facial expression and emotions. Quick analysis only.
                                    
Respond with JSON:
- emotion: Primary emotion (confident, nervous, neutral, focused, etc.)
- confidence: 0-100 score
- tone: positive/neutral/negative

Return ONLY JSON, no text.`
                                },
                                {
                                    inlineData: {
                                        mimeType: 'image/jpeg',
                                        data: base64Image,
                                    },
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.5,
                        topP: 0.9,
                        maxOutputTokens: 100,
                    },
                }),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.text();
            console.error('Gemini API error:', error);
            return NextResponse.json(
                { error: 'Failed to analyze emotion', details: error },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Extract the response text
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            return NextResponse.json(
                { error: 'No response from Gemini API' },
                { status: 500 }
            );
        }

        // Parse JSON response from Gemini
        let emotionData;
        try {
            // Try to extract JSON from the response (in case there's extra text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            emotionData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
        } catch {
            console.error('Failed to parse emotion data:', responseText);
            return NextResponse.json(
                {
                    emotion: 'neutral',
                    confidence: 0,
                    tone: 'neutral',
                    description: 'Unable to analyze',
                    nonverbals: 'Frame analysis unavailable',
                    rawResponse: responseText
                }
            );
        }

        return NextResponse.json(emotionData);
    } catch (error) {
        console.error('Error in analyze-emotion endpoint:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

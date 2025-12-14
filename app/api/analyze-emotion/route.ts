import { NextRequest, NextResponse } from 'next/server';
import { openRouter } from "@/lib/openrouter";

const IMG_API_KEY = process.env.OPENROUTER_API_KEY; // Ensure this is checked if needed separately or use the client

export async function POST(request: NextRequest) {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json(
                { error: 'OPENROUTER_API_KEY environment variable is not set' },
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
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const mimeType = image.type || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        const prompt = `Analyze this interview candidate's facial expression and emotions. Quick analysis only.
                                    
Respond with JSON:
- emotion: Primary emotion (confident, nervous, neutral, focused, etc.)
- confidence: 0-100 score
- tone: positive/neutral/negative

Return ONLY JSON, no text.`;

        const completion = await openRouter.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content?.trim() || "{}";

        // Parse JSON response
        let emotionData;
        try {
            // Try to extract JSON from the response (in case there's extra text)
            // Sometimes models return ```json ... ```
            let cleanText = text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) cleanText = jsonMatch[0];

            emotionData = JSON.parse(cleanText);
        } catch {
            console.error('Failed to parse emotion data:', text);
            return NextResponse.json(
                {
                    emotion: 'neutral',
                    confidence: 0,
                    tone: 'neutral',
                    description: 'Unable to analyze',
                    nonverbals: 'Frame analysis unavailable',
                    rawResponse: text
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

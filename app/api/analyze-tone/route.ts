import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        const prompt = `
        Analyze the vocal tone and emotional state of the speaker in this audio clip.
        Classify the tone into one of these categories: 'confident', 'hesitant', 'enthusiastic', 'calm', 'nervous', 'stressed'.
        Provide a confidence score (0.0 to 1.0) for your classification.
        
        Return **ONLY** valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: audioFile.type || "audio/webm",
                                data: base64Audio
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tone: { type: Type.STRING, enum: ['confident', 'hesitant', 'enthusiastic', 'calm', 'nervous', 'stressed'] },
                        confidence: { type: Type.NUMBER },
                        analysis: { type: Type.STRING }
                    },
                    required: ["tone", "confidence"]
                }
            }
        });

        const text = response.text?.trim() || "{}";
        const parsed = JSON.parse(text);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('Tone Analysis Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze tone' },
            { status: 500 }
        );
    }
}
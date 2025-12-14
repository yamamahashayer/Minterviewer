import { NextRequest, NextResponse } from 'next/server';
import { openRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = audioFile.type || "audio/webm";

        // NOTE: OpenRouter (and OpenAI) audio input format involves `input_audio` or specific handling.
        // For Google Gemini via OpenRouter, we can try to pass it as a data URL in image_url (sometimes works as a proxy hack)
        // OR as a text part with inline data if the client supported it.
        // Since we are using the OpenAI SDK, we will try the `input_audio` format which is the standard for multimodal audio.
        // If this fails, we might need to fallback to a different approach or warn the user.

        const prompt = `
        Analyze the vocal tone and emotional state of the speaker in this audio clip.
        Classify the tone into one of these categories: 'confident', 'hesitant', 'enthusiastic', 'calm', 'nervous', 'stressed'.
        Provide a confidence score (0.0 to 1.0) for your classification.
        
        Return **ONLY** valid JSON.
        `;

        // OpenAI `gpt-4o-audio` format:
        // content: [ { type: "text", text: "..." }, { type: "input_audio", input_audio: { data: "...", format: "wav" } } ]
        // We need to map the mimeType to a simple format string like "wav" or "mp3".
        let format = "wav";
        if (mimeType.includes("mp3") || mimeType.includes("mpeg")) format = "mp3";
        else if (mimeType.includes("webm")) format = "wav"; // OpenAI SDK often prefers wav/mp3. Webm might be risky.

        // Create the message content
        // Note: Using `any` casting to bypass strict OpenAI type checking if the SDK version is slightly older/newer than the `input_audio` spec
        const messageContent: any[] = [
            { type: "text", text: prompt }
        ];

        // Try the input_audio format first.
        // If the user's audio is webm, it might not work with "wav" format specifier if strict validation occurs.
        // We'll trust the model/provider to handle the base64 data.
        messageContent.push({
            type: "input_audio",
            input_audio: {
                data: base64Audio,
                format: format
            }
        });

        // Alternative: Some proxied setups accept data URLs in text or specific non-standard fields.
        // But let's try the standard way first.

        const completion = await openRouter.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "user",
                    content: messageContent as any
                }
            ],
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content?.trim() || "{}";

        let parsed;
        try {
            let cleanText = text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) cleanText = jsonMatch[0];
            parsed = JSON.parse(cleanText);
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON from Tone Analysis", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error('Tone Analysis Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze tone', details: error.message },
            { status: 500 }
        );
    }
}
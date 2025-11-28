import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { error: 'ELEVENLABS_API_KEY is not configured' },
                { status: 500 }
            );
        }

        if (!process.env.ELEVENLABS_VOICE_ID) {
            return NextResponse.json(
                { error: 'ELEVENLABS_VOICE_ID is not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        // Check for a successful response
        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', errorText);
            return NextResponse.json(
                { error: `ElevenLabs API error: ${response.status}`, details: errorText },
                { status: 500 }
            );
        }

        // If the response is OK, process the audio
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error('TTS Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate speech', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
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
            const errorDetails = await response.json(); // Capture the error details
            console.error('ElevenLabs API error:', errorDetails);
            throw new Error(`ElevenLabs API error: ${errorDetails.message || 'Unknown error'}`);
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
            { error: 'Failed to generate speech', details: error.message  },
            { status: 500 }
        );
    }
}

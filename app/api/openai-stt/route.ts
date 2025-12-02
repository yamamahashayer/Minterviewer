import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { error: 'Missing ELEVENLABS_API_KEY on server' },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Forward to ElevenLabs Speech-to-Text (Scribe)
        const elForm = new FormData();
        // filename and contentType help ElevenLabs detect format
        elForm.append('file', audioFile, (audioFile as any).name || 'audio.webm');
        // Required/optional parameters
        elForm.append('model_id', 'scribe_v1');
        elForm.append('language_code', 'en');

        const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
            },
            body: elForm,
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('ElevenLabs STT failed', res.status, errText);
            return NextResponse.json(
                { error: 'Failed to transcribe audio with ElevenLabs' },
                { status: res.status }
            );
        }

        const data = await res.json();
        // ElevenLabs returns { text: string, ... }
        return NextResponse.json({ text: data.text || '' });
    } catch (error: any) {
        console.error('STT Error:', error?.message || error);
        return NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
        );
    }
}
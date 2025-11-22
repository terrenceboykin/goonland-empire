import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

export async function POST(request: NextRequest) {
    try {
        const { text, voice = "en-US-Neural2-C", speed = 1.0 } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Initialize Text-to-Speech client
        const client = new TextToSpeechClient();

        // Configure request
        const requestConfig = {
            input: { text: text },
            voice: { 
                languageCode: "en-US",
                name: voice 
            },
            audioConfig: { 
                audioEncoding: "MP3" as const,
                speakingRate: speed
            },
        };

        // Perform text-to-speech
        const [response] = await client.synthesizeSpeech(requestConfig);

        if (!response.audioContent) {
            throw new Error("No audio generated");
        }

        // Convert audio to base64
        const audioBase64 = Buffer.from(response.audioContent).toString("base64");

        return NextResponse.json({
            success: true,
            audio: audioBase64,
            format: "mp3",
        });

    } catch (error: any) {
        console.error("Text-to-speech error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to generate speech",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

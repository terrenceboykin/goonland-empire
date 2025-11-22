import { NextRequest, NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: "Audio file is required" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await audioFile.arrayBuffer();
        const audioBytes = Buffer.from(bytes).toString("base64");

        // Initialize Speech client
        const client = new SpeechClient();

        // Configure request
        const audio = {
            content: audioBytes,
        };

        const config = {
            encoding: "LINEAR16" as const,
            sampleRateHertz: 16000,
            languageCode: "en-US",
        };

        const requestConfig = {
            audio: audio,
            config: config,
        };

        // Perform speech recognition
        const [response] = await client.recognize(requestConfig);
        const transcription = response.results
            ?.map(result => result.alternatives?.[0].transcript)
            .join("\n");

        return NextResponse.json({
            success: true,
            transcription: transcription || "",
            confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0,
        });

    } catch (error: any) {
        console.error("Speech-to-text error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to transcribe audio",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

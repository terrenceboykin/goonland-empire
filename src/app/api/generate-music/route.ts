import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(request: NextRequest) {
    try {
        const { prompt, duration = 30 } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "gen-lang-client-0959583621";
        const location = "us-central1";

        // Initialize Vertex AI
        const vertexAI = new VertexAI({ project: projectId, location: location });

        // Get the generative model for Lyria 2
        const generativeModel = vertexAI.getGenerativeModel({
            model: "lyria-2",
        });

        // Generate music
        const result = await generativeModel.generateContent({
            contents: [{ 
                role: "user", 
                parts: [{ 
                    text: `Generate ${duration} seconds of music: ${prompt}` 
                }] 
            }],
        });

        const response = result.response;
        
        // Extract audio data from response
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No music generated");
        }

        const audioData = candidates[0].content.parts[0];
        
        return NextResponse.json({
            success: true,
            audio: audioData,
            model: "lyria-2",
            prompt: prompt,
            duration: duration,
            message: "Music generation complete"
        });

    } catch (error: any) {
        console.error("Music generation error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to generate music",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

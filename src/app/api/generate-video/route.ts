import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(request: NextRequest) {
    try {
        const { prompt, model = "veo-3-1-fast" } = await request.json();

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

        // Get the generative model
        const generativeModel = vertexAI.getGenerativeModel({
            model: model, // veo-3-1, veo-3-1-fast, or veo-3
        });

        // Generate video
        const result = await generativeModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const response = result.response;
        
        // Extract video data from response
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No video generated");
        }

        const videoData = candidates[0].content.parts[0];
        
        return NextResponse.json({
            success: true,
            video: videoData,
            model: model,
            prompt: prompt,
            message: "Video generation started. This may take a few minutes."
        });

    } catch (error: any) {
        console.error("Video generation error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to generate video",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(request: NextRequest) {
    try {
        const { prompt, model = "imagen-4-fast" } = await request.json();

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
            model: model, // imagen-4, imagen-4-fast, imagen-4-ultra, or imagegeneration@006 (Nano Banana)
        });

        // Generate image
        const result = await generativeModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const response = result.response;
        
        // Extract image data from response
        // Note: Imagen returns base64 encoded images
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No image generated");
        }

        const imageData = candidates[0].content.parts[0];
        
        return NextResponse.json({
            success: true,
            image: imageData,
            model: model,
            prompt: prompt,
        });

    } catch (error: any) {
        console.error("Image generation error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to generate image",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

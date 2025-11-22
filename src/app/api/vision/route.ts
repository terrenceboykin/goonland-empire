import { NextRequest, NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get("image") as File;
        const features = formData.get("features") as string || "all";

        if (!imageFile) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await imageFile.arrayBuffer();
        const imageBytes = Buffer.from(bytes);

        // Initialize Vision client
        const client = new ImageAnnotatorClient();

        let results: any = {};

        // Perform different types of analysis based on features
        if (features === "all" || features.includes("labels")) {
            const [labelResult] = await client.labelDetection({ image: { content: imageBytes } });
            results.labels = labelResult.labelAnnotations;
        }

        if (features === "all" || features.includes("text")) {
            const [textResult] = await client.textDetection({ image: { content: imageBytes } });
            results.text = textResult.textAnnotations;
        }

        if (features === "all" || features.includes("faces")) {
            const [faceResult] = await client.faceDetection({ image: { content: imageBytes } });
            results.faces = faceResult.faceAnnotations;
        }

        if (features === "all" || features.includes("objects")) {
            const [objectResult] = await client.objectLocalization({ image: { content: imageBytes } });
            results.objects = objectResult.localizedObjectAnnotations;
        }

        if (features === "all" || features.includes("landmarks")) {
            const [landmarkResult] = await client.landmarkDetection({ image: { content: imageBytes } });
            results.landmarks = landmarkResult.landmarkAnnotations;
        }

        return NextResponse.json({
            success: true,
            analysis: results,
        });

    } catch (error: any) {
        console.error("Vision API error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to analyze image",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GOOGLE_GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
            );
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
      ACT AS AN EXPERT INSURANCE ADJUSTER AND CONSTRUCTION ESTIMATOR.
      
      Analyze these roof images (or satellite view) to create a PRECISE construction estimate.
      Use standard industry codes (e.g., RFG 300, RFG 300S, RFG DRIP) for compatibility, but this is a STANDALONE system - users don't need Xactimate.
      
      CRITICAL ANALYSIS STEPS:
      1. **Identify Material:** Asphalt Shingles (Laminated/3-Tab), Tile, Metal, etc.
      2. **Identify Damage:** Hail hits (bruising), Wind damage (creased tabs, missing shingles), Wear & Tear.
      3. **Measurements:** Estimate Pitch (e.g., 6/12), Eaves, Rakes, Valleys, Ridges.
      4. **Components:** Drip Edge, Ice & Water Shield, Felt, Pipe Jacks, Vents.

      OUTPUT FORMAT (JSON ONLY):
      {
        "summary": "Professional adjuster summary of findings (e.g., 'Found 10+ hail hits on South slope...')",
        "material": "Asphalt Shingles - Laminated (RFG 300)",
        "damage": ["Hail > 1 inch", "Wind Creases"],
        "lineItems": [
          {
            "category": "Roofing",
            "description": "Tear off, haul and dispose of comp shingles - Laminated",
            "xactimateCode": "RFG 300S",
            "quantity": 0,
            "unit": "SQ",
            "unitPrice": 65.00,
            "total": 0.00
          },
          {
            "category": "Roofing",
            "description": "Laminated - comp. shingles - w/ felt",
            "xactimateCode": "RFG 300",
            "quantity": 0,
            "unit": "SQ",
            "unitPrice": 245.00,
            "total": 0.00
          },
          {
            "category": "Roofing",
            "description": "Drip edge",
            "xactimateCode": "RFG DRIP",
            "quantity": 0,
            "unit": "LF",
            "unitPrice": 2.50,
            "total": 0.00
          }
          // ADD MORE ITEMS: Ice & Water (RFG 100), Ridge Cap (RFG RIDG), Pipe Jacks (RFG JACK), Vents (RFG VENT)
        ]
      }
      
      BE AGGRESSIVE WITH SUPPLEMENTS. IF IN DOUBT, ADD IT AS A SUPPLEMENT ITEM.
    `;

        // Process images for Gemini
        const imageParts = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                return {
                    inlineData: {
                        data: Buffer.from(arrayBuffer).toString("base64"),
                        mimeType: file.type,
                    },
                };
            })
        );

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON if needed (remove markdown code blocks)
        const jsonStr = text.replace(/```json\n|\n```/g, "");
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Analysis error:", error);
        
        // Don't crash - return helpful error that user can recover from
        return NextResponse.json(
            { 
                error: error.message || "Failed to analyze images. Please check your images and try again.",
                retry: true
            },
            { status: 500 }
        );
    }
}

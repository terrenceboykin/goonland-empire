import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

import { getGeocode, getSolarData, getSatelliteImage } from "@/lib/solar-api";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const address = formData.get("address") as string | null;

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GOOGLE_GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        let promptContext = "";
        let imageParts: any[] = [];

        if (address) {
            // SATELLITE MODE
            try {
                const location = await getGeocode(address);
                const solarData = await getSolarData(location.lat, location.lng);
                const satelliteImageUrl = await getSatelliteImage(location.lat, location.lng);

                // Fetch the satellite image to pass to Gemini
                const imageResp = await fetch(satelliteImageUrl);
                const imageBuffer = await imageResp.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString("base64");

                imageParts = [{
                    inlineData: {
                        data: base64Image,
                        mimeType: "image/png",
                    },
                }];

                promptContext = `
                ANALYSIS CONTEXT:
                Address: ${address}
                Roof Data (from Google Solar API):
                - Max Array Area: ${solarData.solarPotential?.maxArrayAreaMeters2 || "N/A"} m2
                - Max Sunshine Hours: ${solarData.solarPotential?.maxSunshineHoursPerYear || "N/A"}
                - Roof Segment Stats: ${JSON.stringify(solarData.solarPotential?.roofSegmentStats || [])}
                
                Use this data to calculate precise measurements (Square count).
                `;
            } catch (e) {
                console.error("Satellite Data Error:", e);
                // Fallback if solar API fails or key is invalid, just proceed with generic prompt
                promptContext = `Could not fetch live solar data for ${address}. Estimate based on visual only.`;
            }
        } else if (files.length > 0) {
            // PHOTO UPLOAD MODE
            imageParts = await Promise.all(
                files.map(async (file) => {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    return {
                        inlineData: {
                            data: buffer.toString("base64"),
                            mimeType: file.type,
                        },
                    };
                })
            );
        } else {
            return NextResponse.json(
                { error: "No files or address provided" },
                { status: 400 }
            );
        }

        const prompt = `
      ACT AS AN EXPERT INSURANCE ADJUSTER (XACTIMATE CERTIFIED).
      
      ${promptContext}

      Analyze these roof images (or satellite view) to create a PRECISE construction estimate.
      You MUST use standard Xactimate codes (e.g., RFG 300, RFG 300S, RFG DRIP).
      
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

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        // Clean up markdown code blocks if present
        const jsonString = responseText.replace(/```json\n|\n```/g, "").trim();

        try {
            const data = JSON.parse(jsonString);
            return NextResponse.json(data);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.log("Raw Response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

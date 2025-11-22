/**
 * Google Gemini API Integration Helper
 * 
 * This file shows how to properly use the Gemini API in Next.js
 * 
 * IMPORTANT: API keys should be in .env.local file:
 * GOOGLE_GEMINI_API_KEY=your_key_here
 * 
 * For local development, create .env.local in the project root.
 * For server-side API routes, use process.env.GOOGLE_GEMINI_API_KEY
 * For client-side, you'll need to create an API route (see below)
 */

// Server-side usage (in API routes or server components)
export async function analyzeRoofImages(imageFiles: File[]): Promise<any> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
  }

  // Convert files to base64 or use Gemini's file upload API
  // Example implementation:
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append('files', file);
  });

  // Use Gemini 1.5 Pro API endpoint
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Analyze these roof images and identify damage, materials, and generate a construction scope with line items."
            },
            // Add image parts here (base64 encoded)
          ]
        }]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Client-side usage requires an API route wrapper
 * Create: src/app/api/analyze/route.ts
 * 
 * Example API route:
 * 
 * import { analyzeRoofImages } from '@/lib/gemini-api';
 * import { NextRequest, NextResponse } from 'next/server';
 * 
 * export async function POST(request: NextRequest) {
 *   const formData = await request.formData();
 *   const files = formData.getAll('files') as File[];
 *   
 *   try {
 *     const result = await analyzeRoofImages(files);
 *     return NextResponse.json(result);
 *   } catch (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 });
 *   }
 * }
 */

/**
 * Getting your Gemini API Key:
 * 1. Go to: https://makersuite.google.com/app/apikey
 * 2. Sign in with your Google account
 * 3. Click "Create API Key"
 * 4. Copy the key
 * 5. Add to .env.local: GOOGLE_GEMINI_API_KEY=your_key_here
 * 6. Restart your dev server (npm run dev)
 */



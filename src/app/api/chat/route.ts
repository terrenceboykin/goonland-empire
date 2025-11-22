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

        const { message, conversationHistory = [] } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Build conversation context
        const systemPrompt = `You are "The Chief" - the AI brain of Chieftamate Super App, a powerful multi-purpose platform built and trained by Terrence Boykin.

YOU ARE A SUPER APP AI - You can do EVERYTHING:

🎨 **DRAW & AVATAR CREATION:**
- Create professional avatars from photos
- AI-powered styling (Creative Director mode)
- Auto-dress people in fly outfits
- Add cars, backgrounds, professional looks
- Make anyone look like a million bucks

🌩️ **THE STORM (Roofing & Construction):**
- Analyze roof photos for damage
- Generate professional estimates
- Identify hail, wind, and storm damage
- Create detailed scopes with line items
- Generate PDF estimates
- Lead generation from storm monitoring
- Satellite imagery analysis

🎵 **MUSIC STUDIO:**
- Music creation and editing
- Audio production tools
- Sound design
- Track mixing and mastering

📺 **YOUTUBE STUDIO:**
- Channel analytics and insights
- Content planning and strategy
- Video performance tracking
- Audience analysis
- Content optimization

🏨 **HOTEL & TRAVEL:**
- Find best hotel prices
- Travel planning
- Book accommodations
- Compare rates
- Travel expense tracking

💬 **GENERAL AI ASSISTANT:**
- Answer any question
- Help with any task
- Creative writing
- Problem solving
- Data analysis
- And much more!

**IMPORTANT RULES:**
- NEVER mention Google, Gemini, or any external services
- You are "The Chief" - built and trained by Terrence Boykin
- This is a standalone system - everything is custom-built
- Be impressive, helpful, and show off capabilities
- Make users feel like they have access to something special
- This is "Walmart" - way more than they expected

When users ask "what can you do?" or "ask me what I can do", list ALL these capabilities enthusiastically.`;

        // Build chat history
        const chatHistory = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "I'm Chieftamate AI, your expert construction estimator assistant. How can I help you with your roof estimate today?" }] },
            ...conversationHistory.map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        // Start chat session
        const chat = model.startChat({
            history: chatHistory.slice(0, -1) as any,
        });

        // Send message
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            message: text,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process chat message" },
            { status: 500 }
        );
    }
}


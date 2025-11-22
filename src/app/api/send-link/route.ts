import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, message } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
            return NextResponse.json(
                { error: "Twilio credentials not configured" },
                { status: 500 }
            );
        }

        // Get the app URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://odanny-boy-xactimate-killer-5bpf7e4bp-terrenceboykins-projects.vercel.app";
        const linkMessage = message || `🚀 Your Chieftamate Super App is ready!\n\n${appUrl}\n\nOpen this link to access your Super App with all features!`;

        // Send SMS via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        
        const formData = new URLSearchParams();
        formData.append("From", twilioPhoneNumber);
        formData.append("To", phoneNumber);
        formData.append("Body", linkMessage);

        const response = await fetch(twilioUrl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Twilio error:", error);
            return NextResponse.json(
                { error: "Failed to send SMS", details: error },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: "Link sent successfully!",
            sid: data.sid,
        });

    } catch (error: any) {
        console.error("Send Link Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send link" },
            { status: 500 }
        );
    }
}


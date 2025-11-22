"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Send, Check, Copy } from "lucide-react";

export default function SendLinkPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // Get the app URL
    const appUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : "https://odanny-boy-xactimate-killer-5bpf7e4bp-terrenceboykins-projects.vercel.app";

    const handleSend = async () => {
        if (!phoneNumber.trim()) {
            setError("Please enter a phone number");
            return;
        }

        setIsSending(true);
        setError("");
        setSent(false);

        try {
            const response = await fetch("/api/send-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber.trim(),
                    message: `🚀 Your Chieftamate Super App is ready!\n\n${appUrl}\n\nOpen this link to access your Super App with all features!`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send link");
            }

            setSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send link");
        } finally {
            setIsSending(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Share Your Super App</CardTitle>
                    <CardDescription>
                        Send the link to your phone or share with others
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* App URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">App Link:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={appUrl}
                                readOnly
                                className="flex-1 px-3 py-2 border border-border rounded-md bg-muted text-sm"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {copied && (
                            <p className="text-xs text-green-500">Copied to clipboard!</p>
                        )}
                    </div>

                    {/* Send via SMS */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Send to Phone (SMS):</label>
                        <input
                            type="tel"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md"
                        />
                        <p className="text-xs text-muted-foreground">
                            Format: +1234567890 (include country code)
                        </p>
                        <Button
                            onClick={handleSend}
                            disabled={isSending || !phoneNumber.trim()}
                            className="w-full"
                        >
                            {isSending ? (
                                "Sending..."
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Link via SMS
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Status Messages */}
                    {sent && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                            <p className="text-sm text-green-500">
                                ✅ Link sent successfully! Check your phone.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Quick Share Options */}
                    <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Quick Share:</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: "Chieftamate Super App",
                                            text: "Check out my Super App!",
                                            url: appUrl,
                                        });
                                    } else {
                                        handleCopy();
                                    }
                                }}
                                className="flex-1"
                            >
                                Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`mailto:?subject=Chieftamate Super App&body=Check out my Super App: ${appUrl}`)}
                                className="flex-1"
                            >
                                Email
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


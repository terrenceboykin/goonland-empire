"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function GlobalAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
        { role: "assistant", content: "What's good? I'm CHIEF, your AI assistant. What you need?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }]
                }),
            });

            const data = await response.json();

            if (data.response) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                throw new Error("No response");
            }
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Sorry, I'm having trouble right now. Try again in a moment." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-50"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-semibold">CHIEF</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        msg.role === "user"
                                            ? "bg-purple-600 text-white"
                                            : "bg-muted"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg p-3">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask me anything..."
                                disabled={loading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                size="icon"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}

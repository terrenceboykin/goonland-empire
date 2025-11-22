"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, X } from "lucide-react";
import { ScopeData } from "@/types/scope";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChiefAssistantProps {
    scopeData: ScopeData | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChiefAssistant({ scopeData, isOpen, onClose }: ChiefAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "I'm The Chief. I've analyzed the scope. Ask me anything about the pricing, missing items, or hail damage.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI processing (replace with real API call later)
        setTimeout(() => {
            let responseText = "I'm checking the Xactimate guidelines on that.";

            if (input.toLowerCase().includes("ridge") || input.toLowerCase().includes("vent")) {
                responseText = "I see a ridge line, but no vent was line-itemed. I recommend adding 'RFG VENT' (Ridge Vent - Shingle Over) for 40 LF. Shall I add it?";
            } else if (input.toLowerCase().includes("price") || input.toLowerCase().includes("total")) {
                responseText = `The current total is $${scopeData?.lineItems.reduce((a, b) => a + b.total, 0).toFixed(2)}. This includes 20% O&P. We are matching ABC Supply's September price list.`;
            } else if (input.toLowerCase().includes("hail")) {
                responseText = "I identified 12 distinct hail hits on the South slope, mostly 1-1.5 inch diameter. This qualifies for full replacement under most policies.";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseText,
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl border-primary/20 flex flex-col z-50 bg-background/95 backdrop-blur">
            <CardHeader className="border-b p-4 flex flex-row items-center justify-between space-y-0 bg-primary/5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-base">The Chief</CardTitle>
                        <p className="text-xs text-muted-foreground">AI Adjuster Assistant</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    }`}
                            >
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-muted" : "bg-primary/10"
                                        }`}
                                >
                                    {msg.role === "user" ? (
                                        <User className="h-4 w-4" />
                                    ) : (
                                        <Bot className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div
                                    className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about the scope..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}

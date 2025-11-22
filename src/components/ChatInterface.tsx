"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm The Chief - your AI assistant for Chieftamate Super App. I can do EVERYTHING: create avatars, analyze roofs, help with music, YouTube analytics, find hotels, and much more! Try asking me 'What can you do?' to see all my capabilities. What would you like to explore?",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            const assistantMessage: Message = {
                role: "assistant",
                content: data.message,
                timestamp: data.timestamp || new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card className="w-full max-w-4xl h-[600px] flex flex-col">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Chieftamate AI Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${
                                message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {message.role === "user" && (
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about roof estimates, line items, pricing..."
                            className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Send
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


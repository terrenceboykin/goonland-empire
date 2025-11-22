"use client";

import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/super-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Super App
          </Button>
          <h1 className="text-3xl font-bold mb-2">Chat with The Chief</h1>
          <p className="text-muted-foreground">
            Your AI assistant. Ask "What can you do?" to see all capabilities.
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}


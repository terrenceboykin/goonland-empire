"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cloud, 
  Palette, 
  Music, 
  Youtube, 
  Hotel, 
  MessageSquare,
  Zap 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperDashboard() {
  const router = useRouter();

  const sections = [
    {
      id: "storm",
      title: "THE STORM",
      icon: Cloud,
      description: "Roof Estimation & Lead Generation",
      color: "bg-blue-500 hover:bg-blue-600",
      route: "/storm",
      available: true,
    },
    {
      id: "draw",
      title: "DRAW & AVATAR",
      icon: Palette,
      description: "Create Your Avatar - AI Styled",
      color: "bg-purple-500 hover:bg-purple-600",
      route: "/draw",
      available: true,
    },
    {
      id: "music",
      title: "MUSIC STUDIO",
      icon: Music,
      description: "Music Creation & Editing",
      color: "bg-pink-500 hover:bg-pink-600",
      route: "/music",
      available: true,
    },
    {
      id: "youtube",
      title: "YOUTUBE STUDIO",
      icon: Youtube,
      description: "Channel Management & Analytics",
      color: "bg-red-500 hover:bg-red-600",
      route: "/youtube",
      available: true,
    },
    {
      id: "hotel",
      title: "HOTEL & TRAVEL",
      icon: Hotel,
      description: "Get Best Hotel Prices",
      color: "bg-green-500 hover:bg-green-600",
      route: "/hotel",
      available: true,
    },
    {
      id: "chat",
      title: "CHAT WITH CHIEF",
      icon: MessageSquare,
      description: "AI Assistant - Ask 'What can you do?'",
      color: "bg-orange-500 hover:bg-orange-600",
      route: "/chat",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span>Chieftamate</span>
            <span className="text-sm text-muted-foreground font-normal ml-2">Super App</span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Your <span className="text-primary">Super App</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need in one place. Built and trained by Terrence Boykin. Roof estimation, avatar creation, music, YouTube, hotels, and more.
          </p>
          <p className="text-sm text-muted-foreground italic">
            "You asked for tomatoes, we gave you Walmart"
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => router.push("/chat")}
              className="bg-primary text-primary-foreground text-lg px-8 py-6"
              size="lg"
            >
              💬 Ask The Chief: "What can you do?"
            </Button>
          </div>
        </div>

        {/* Big Button Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2"
                onClick={() => router.push(section.route)}
              >
                <CardContent className="p-8 flex flex-col items-center justify-center min-h-[200px] space-y-4">
                  <div className={`${section.color} rounded-full p-6 text-white transition-all`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <h2 className="text-2xl font-bold text-center">{section.title}</h2>
                  <p className="text-sm text-muted-foreground text-center">
                    {section.description}
                  </p>
                  {section.available ? (
                    <Button 
                      className={`${section.color} text-white w-full mt-4`}
                      size="lg"
                    >
                      Open {section.title}
                    </Button>
                  ) : (
                    <Button 
                      className="bg-muted text-muted-foreground w-full mt-4"
                      size="lg"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>50+ APIs Enabled • Everything Works Together • One App, Infinite Possibilities</p>
        </div>
      </main>
    </div>
  );
}


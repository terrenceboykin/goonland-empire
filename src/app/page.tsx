"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Music, User, CloudRain, LayoutDashboard, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LobbyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span>The Empire</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted overflow-hidden border border-border">
                {/* Placeholder for User Avatar */}
                <User className="h-full w-full p-1 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium hidden md:block">Terrence Boykin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-12 flex flex-col items-center gap-12">

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            Welcome to <span className="text-primary">Your World</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a module to begin.
          </p>
        </div>

        {/* The Big Easy Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

          {/* THE STORM (Roofing App) */}
          <Card
            className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
            onClick={() => router.push("/storm")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-24 w-24 bg-blue-100/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <CloudRain className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">The Storm</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Xactimate Killer. Satellite Analysis.
              <br />
              <span className="text-xs font-bold text-primary mt-2 block">ACTIVE</span>
            </CardContent>
          </Card>

          {/* THE STUDIO (Creative/Music) */}
          <Card
            className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
            onClick={() => router.push("/studio")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-24 w-24 bg-purple-100/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Music className="h-12 w-12 text-purple-500" />
              </div>
              <CardTitle className="text-2xl">The Studio</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Music Production. Video Gen.
              <br />
              <span className="text-xs font-bold text-purple-500 mt-2 block">READY</span>
            </CardContent>
          </Card>

          {/* THE LIFE (Personal/Avatar) */}
          <Card
            className="group cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
            onClick={() => router.push("/life")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-24 w-24 bg-green-100/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <User className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl">The Life</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Personal Assistant. Avatar.
              <br />
              <span className="text-xs font-bold text-green-500 mt-2 block">READY</span>
            </CardContent>
          </Card>

        </div>

        {/* "Ask Me" Section */}
        <div className="w-full max-w-2xl text-center">
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 text-lg border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => alert("I am The Chief. I can:\n\n1. Estimate Roofs (Satellite & Photos)\n2. Find Hotels for your Crew\n3. Generate Music & Videos\n4. Manage your Schedule\n5. Draw & Measure anything.\n\nJust pick a module to start.")}
          >
            ✨ Ask me what I can do
          </Button>
        </div>

        {/* Quick Stats / Dashboard Preview */}
        <div className="w-full max-w-4xl mt-8 p-6 border border-border rounded-xl bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Empire Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Total Leads</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Active Jobs</div>
              <div className="text-2xl font-bold">3</div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-2xl font-bold text-green-500">$0.00</div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">APIs Active</div>
              <div className="text-2xl font-bold text-blue-500">50+</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

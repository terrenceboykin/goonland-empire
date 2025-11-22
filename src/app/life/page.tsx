"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Plane, Hotel } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LifePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container flex h-16 items-center px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <User className="h-6 w-6 text-green-500" />
                        <span>The Life</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-12 flex flex-col items-center gap-8">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl font-bold mb-4">Personal Command Center</h1>
                    <p className="text-muted-foreground text-lg">
                        "I can book hotels for the crew, schedule meetings, or manage your fleet. I am your Chief of Staff."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    <FeatureCard icon={<Hotel />} title="Crew Housing" desc="Find hotels near the storm." />
                    <FeatureCard icon={<Plane />} title="Travel" desc="Book flights and logistics." />
                    <FeatureCard icon={<Calendar />} title="Schedule" desc="Manage appointments." />
                    <FeatureCard icon={<User />} title="Avatar" desc="Customize your digital twin." />
                </div>

                <div className="w-full max-w-2xl mt-8 p-8 border border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground mb-4">Chief of Staff is Online</p>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">Open Assistant</Button>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <Card className="hover:border-green-500/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-green-100/10 rounded-lg text-green-500">
                    {icon}
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
        </Card>
    )
}

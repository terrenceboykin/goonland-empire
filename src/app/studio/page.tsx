"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Mic, Video, Wand2, Loader2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type GenerationType = "image" | "video" | "music" | null;

export default function StudioPage() {
    const router = useRouter();
    const [activeType, setActiveType] = useState<GenerationType>(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (type: GenerationType) => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const endpoint = type === "image" 
                ? "/api/generate-image" 
                : type === "video" 
                ? "/api/generate-video" 
                : "/api/generate-music";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Generation failed");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container flex h-16 items-center px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-4">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Music className="h-6 w-6 text-purple-500" />
                        <span>The Studio</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-12 flex flex-col items-center gap-8">
                {!activeType ? (
                    <>
                        <div className="text-center max-w-2xl">
                            <h1 className="text-4xl font-bold mb-4">Creative Suite</h1>
                            <p className="text-muted-foreground text-lg">
                                "Powered by Google's latest AI: Imagen 4, Veo 3.1, and Lyria 2. What are we making today?"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                            <FeatureCard 
                                icon={<Wand2 />} 
                                title="Image Generation" 
                                desc="Create stunning images with Imagen 4 (Nano Banana)" 
                                onClick={() => setActiveType("image")}
                            />
                            <FeatureCard 
                                icon={<Video />} 
                                title="Video Generation" 
                                desc="Generate videos with Veo 3.1" 
                                onClick={() => setActiveType("video")}
                            />
                            <FeatureCard 
                                icon={<Music />} 
                                title="Music Generation" 
                                desc="Compose music with Lyria 2" 
                                onClick={() => setActiveType("music")}
                            />
                            <FeatureCard 
                                icon={<Mic />} 
                                title="Coming Soon" 
                                desc="More creative tools on the way" 
                                onClick={() => {}}
                                disabled
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full max-w-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold capitalize">{activeType} Generation</h2>
                            <Button variant="outline" onClick={() => {
                                setActiveType(null);
                                setPrompt("");
                                setResult(null);
                                setError(null);
                            }}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Describe what you want to create</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder={`Describe your ${activeType} in detail...`}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                                <Button 
                                    onClick={() => handleGenerate(activeType)} 
                                    disabled={loading || !prompt.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        `Generate ${activeType}`
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {error && (
                            <Card className="border-destructive">
                                <CardContent className="pt-6">
                                    <p className="text-destructive">{error}</p>
                                </CardContent>
                            </Card>
                        )}

                        {result && (
                            <Card className="border-green-500">
                                <CardHeader>
                                    <CardTitle className="text-green-500">Generation Complete!</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Model: {result.model}
                                    </p>
                                    {result.message && (
                                        <p className="text-sm">{result.message}</p>
                                    )}
                                    {result.image && (
                                        <div className="rounded-lg overflow-hidden border">
                                            <img 
                                                src={`data:image/png;base64,${result.image}`} 
                                                alt="Generated" 
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                    {result.video && (
                                        <div className="rounded-lg overflow-hidden border">
                                            <video controls className="w-full">
                                                <source src={`data:video/mp4;base64,${result.video}`} type="video/mp4" />
                                            </video>
                                        </div>
                                    )}
                                    {result.audio && (
                                        <div className="rounded-lg overflow-hidden border p-4">
                                            <audio controls className="w-full">
                                                <source src={`data:audio/mp3;base64,${result.audio}`} type="audio/mp3" />
                                            </audio>
                                        </div>
                                    )}
                                    <Button className="w-full" variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, desc, onClick, disabled = false }: { 
    icon: any, 
    title: string, 
    desc: string,
    onClick: () => void,
    disabled?: boolean
}) {
    return (
        <Card 
            className={`hover:border-purple-500/50 transition-colors ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
            onClick={disabled ? undefined : onClick}
        >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-purple-100/10 rounded-lg text-purple-500">
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

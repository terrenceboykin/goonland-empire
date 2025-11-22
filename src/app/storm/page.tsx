"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudUpload, FileText, Zap, MapPin, Satellite, MessageSquare, ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleMapComponent } from "@/components/GoogleMapComponent";
import { ChatInterface } from "@/components/ChatInterface";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

import ResultsView from "@/components/ResultsView";

export default function StormPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [files, setFiles] = useState<File[] | undefined>(undefined);
    const router = useRouter();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setFiles(Array.from(selectedFiles));
        setIsUploading(true);
        setShowResults(true);
    };

    if (showResults) {
        return (
            <ResultsView
                files={files}
                address={selectedAddress && !files ? selectedAddress : undefined}
                onBack={() => {
                    setShowResults(false);
                    setIsUploading(false);
                    setShowMap(false);
                    setSelectedAddress("");
                    setFiles(undefined);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <Zap className="h-5 w-5" />
                        </div>
                        <span>Chieftamate: The Storm</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/leads")}>
                            Leads
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-12 md:py-24 flex flex-col items-center text-center gap-8">

                {/* Hero Section */}
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                        The Complete <span className="text-primary">Xactimate Replacement</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
                        Standalone roof estimation platform. No Xactimate needed. Enter an address or upload photos. Get AI-powered estimates with live satellite data in under 2 minutes.
                    </p>
                </div>

                {/* Address Search & Map */}
                <Card className="w-full max-w-4xl border-2 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Satellite className="h-5 w-5 text-primary" />
                            Live Satellite View
                        </CardTitle>
                        <CardDescription>
                            Enter an address to view satellite imagery and identify the roof
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AddressAutocomplete
                            onAddressSelect={(address) => setSelectedAddress(address)}
                            onViewSatellite={() => setShowMap(true)}
                        />
                        {showMap && selectedAddress && (
                            <div className="space-y-4">
                                <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
                                    <GoogleMapComponent address={selectedAddress} />
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full animate-pulse bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
                                    onClick={() => setShowResults(true)}
                                >
                                    <Zap className="h-5 w-5 mr-2" />
                                    Generate Estimate for this Roof
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload Card */}
                <Card className="w-full max-w-md border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <CloudUpload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Or Upload Job Photos</h3>
                            <p className="text-sm text-muted-foreground">
                                Drag & drop or click to select
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Button
                            size="lg"
                            className="mt-4 w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Select Files"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
                    <FeatureCard
                        icon={<Zap className="h-6 w-6 text-primary" />}
                        title="Instant Scopes"
                        description="AI generates line items from photos in seconds."
                    />
                    <FeatureCard
                        icon={<FileText className="h-6 w-6 text-primary" />}
                        title="Regional Pricing"
                        description="Live pricing data for all US markets."
                    />
                    <FeatureCard
                        icon={<Satellite className="h-6 w-6 text-primary" />}
                        title="Live Satellite"
                        description="Google Maps integration with aerial views."
                    />
                    <FeatureCard
                        icon={<CloudUpload className="h-6 w-6 text-primary" />}
                        title="Supplement Mode"
                        description="Finds missed items automatically."
                    />
                </div>

                {/* AI Chat Assistant */}
                <div className="w-full max-w-4xl mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setShowChat(!showChat)}
                        className="w-full gap-2"
                    >
                        <MessageSquare className="h-4 w-4" />
                        {showChat ? "Hide" : "Show"} AI Assistant
                    </Button>
                    {showChat && (
                        <div className="mt-4">
                            <ChatInterface />
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 border-t border-border/40 text-center text-sm text-muted-foreground">
                © 2025 Chieftamate. Professional Estimation Platform.
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

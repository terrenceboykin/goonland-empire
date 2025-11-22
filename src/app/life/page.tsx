"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, FolderOpen, FileSpreadsheet, Youtube, Hotel, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LifeModule = "gmail" | "calendar" | "drive" | "sheets" | "youtube" | "travel" | "housing" | null;

export default function LifePage() {
    const router = useRouter();
    const [activeModule, setActiveModule] = useState<LifeModule>(null);

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
                {!activeModule ? (
                    <>
                        <div className="text-center max-w-2xl">
                            <h1 className="text-4xl font-bold mb-4">Personal Command Center</h1>
                            <p className="text-muted-foreground text-lg">
                                "I can manage your email, schedule meetings, organize files, book hotels for the crew, or handle your content. I am your Chief of Staff."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                            <ModuleCard 
                                icon={<Mail />} 
                                title="Email Manager" 
                                desc="Send, read, and organize emails" 
                                onClick={() => setActiveModule("gmail")}
                            />
                            <ModuleCard 
                                icon={<Calendar />} 
                                title="Calendar" 
                                desc="Schedule and manage appointments" 
                                onClick={() => setActiveModule("calendar")}
                            />
                            <ModuleCard 
                                icon={<FolderOpen />} 
                                title="Cloud Storage" 
                                desc="Access and manage your files" 
                                onClick={() => setActiveModule("drive")}
                            />
                            <ModuleCard 
                                icon={<FileSpreadsheet />} 
                                title="Spreadsheets" 
                                desc="Create and edit data sheets" 
                                onClick={() => setActiveModule("sheets")}
                            />
                            <ModuleCard 
                                icon={<Youtube />} 
                                title="Video Analytics" 
                                desc="Track your content performance" 
                                onClick={() => setActiveModule("youtube")}
                            />
                            <ModuleCard 
                                icon={<Hotel />} 
                                title="Crew Housing" 
                                desc="Find hotels near the storm" 
                                onClick={() => setActiveModule("housing")}
                            />
                            <ModuleCard 
                                icon={<Plane />} 
                                title="Travel" 
                                desc="Book flights and logistics" 
                                onClick={() => setActiveModule("travel")}
                            />
                            <ModuleCard 
                                icon={<User />} 
                                title="More Coming" 
                                desc="Additional tools on the way" 
                                onClick={() => {}}
                                disabled
                            />
                        </div>

                        <div className="w-full max-w-2xl mt-8 p-8 border border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/20">
                            <p className="text-muted-foreground mb-4">CHIEF is Online - Your AI Chief of Staff</p>
                            <p className="text-sm text-muted-foreground mb-4">Click the purple button in the bottom right to talk to CHIEF</p>
                        </div>
                    </>
                ) : (
                    <div className="w-full max-w-4xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold capitalize">
                                {activeModule === "gmail" && "Email Manager"}
                                {activeModule === "calendar" && "Calendar"}
                                {activeModule === "drive" && "Cloud Storage"}
                                {activeModule === "sheets" && "Spreadsheets"}
                                {activeModule === "youtube" && "Video Analytics"}
                                {activeModule === "housing" && "Crew Housing"}
                                {activeModule === "travel" && "Travel Booking"}
                            </h2>
                            <Button variant="outline" onClick={() => setActiveModule(null)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Connect Your Account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    This feature requires authentication with your Google account.
                                </p>
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    Connect Account
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                    Your data is secure and never shared. You can disconnect at any time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

function ModuleCard({ icon, title, desc, onClick, disabled = false }: { 
    icon: any, 
    title: string, 
    desc: string,
    onClick: () => void,
    disabled?: boolean
}) {
    return (
        <Card 
            className={`hover:border-green-500/50 transition-colors ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
            onClick={disabled ? undefined : onClick}
        >
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

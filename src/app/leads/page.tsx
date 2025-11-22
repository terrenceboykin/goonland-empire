"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Lead {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    damageType: string;
    damageScore: number;
    estimatedCostMin: number;
    estimatedCostMax: number;
    stormEvent: string | null;
    detectedAt: string;
    status: string;
    assignedTo: string | null;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchLeads();
    }, [filter]);

    const fetchLeads = async () => {
        try {
            // TODO: Get userId from auth
            const userId = "demo-user";
            const status = filter === "all" ? null : filter;
            const url = `/api/leads?userId=${userId}${status ? `&status=${status}` : ""}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // Parse damageType if it's a JSON string
            const parsedLeads = data.leads.map((lead: Lead) => ({
                ...lead,
                damageType: typeof lead.damageType === "string" 
                    ? JSON.parse(lead.damageType || "[]")
                    : lead.damageType,
            }));
            
            setLeads(parsedLeads);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const claimLead = async (leadId: string) => {
        try {
            const response = await fetch(`/api/leads?id=${leadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignedTo: "demo-user", // TODO: Get from auth
                    status: "contacted",
                }),
            });

            if (response.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error("Failed to claim lead:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
            new: { variant: "default", icon: Clock },
            contacted: { variant: "secondary", icon: AlertTriangle },
            converted: { variant: "default", icon: CheckCircle },
            lost: { variant: "destructive", icon: AlertTriangle },
        };

        const config = variants[status] || variants.new;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Lead Generation Dashboard</h1>
                        <p className="text-muted-foreground">
                            Proactive leads from storm monitoring and satellite scanning
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            onClick={() => setFilter("all")}
                        >
                            All ({leads.length})
                        </Button>
                        <Button
                            variant={filter === "new" ? "default" : "outline"}
                            onClick={() => setFilter("new")}
                        >
                            New
                        </Button>
                        <Button
                            variant={filter === "contacted" ? "default" : "outline"}
                            onClick={() => setFilter("contacted")}
                        >
                            Contacted
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Leads
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{leads.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                New Leads
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {leads.filter((l) => l.status === "new").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Potential Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                $
                                {leads
                                    .reduce((sum, lead) => sum + lead.estimatedCostMax, 0)
                                    .toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Conversion Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {leads.length > 0
                                    ? Math.round(
                                          (leads.filter((l) => l.status === "converted").length /
                                              leads.length) *
                                              100
                                      )
                                    : 0}
                                %
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leads List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                        <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            {lead.address}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {lead.city}, {lead.state} {lead.zipCode}
                                        </p>
                                    </div>
                                    {getStatusBadge(lead.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Damage Type</p>
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(lead.damageType) &&
                                            lead.damageType.map((type: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Damage Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${(lead.damageScore / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium">{lead.damageScore}/10</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Estimated Value</p>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        <span className="font-bold">
                                            $
                                            {lead.estimatedCostMin.toLocaleString()} - $
                                            {lead.estimatedCostMax.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {lead.stormEvent && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Storm Event</p>
                                        <p className="text-sm">{lead.stormEvent}</p>
                                    </div>
                                )}

                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Detected: {new Date(lead.detectedAt).toLocaleString()}
                                    </p>
                                    {lead.status === "new" && (
                                        <Button
                                            onClick={() => claimLead(lead.id)}
                                            className="w-full"
                                            size="sm"
                                        >
                                            Claim Lead
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {leads.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                No leads found. Leads will appear here when storms are detected and
                                damage is identified.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}


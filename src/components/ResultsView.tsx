"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, FileText, Loader2, ArrowLeft, Bot } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ScopeData } from "@/types/scope";
import ChiefAssistant from "@/components/ChiefAssistant";

interface ResultsViewProps {
    files?: File[];
    address?: string;
    onBack: () => void;
}

export default function ResultsView({ files, address, onBack }: ResultsViewProps) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing...");
    const [data, setData] = useState<ScopeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChiefOpen, setIsChiefOpen] = useState(false);
    const analyzedRef = useRef(false);

    useEffect(() => {
        if (analyzedRef.current) return;
        analyzedRef.current = true;

        const analyzeImages = async () => {
            try {
                // Start progress simulation
                const steps = address ? [
                    { msg: "Locating property via Google Maps...", time: 500 },
                    { msg: "Fetching Solar & Satellite Data...", time: 1500 },
                    { msg: "Measuring Roof Segments (Solar API)...", time: 2500 },
                    { msg: "Applying Xactimate Pricing (RFG 300)...", time: 3500 },
                    { msg: "Finalizing Chieftamate Estimate...", time: 4500 },
                ] : [
                    { msg: "Uploading high-res imagery...", time: 500 },
                    { msg: "Analyzing roof geometry (Gemini 1.5 Pro)...", time: 1500 },
                    { msg: "Identifying hail hits & wind damage...", time: 2500 },
                    { msg: "Applying Xactimate Pricing (RFG 300)...", time: 3500 },
                    { msg: "Finalizing Chieftamate Estimate...", time: 4500 },
                ];

                let currentStep = 0;
                const interval = setInterval(() => {
                    if (currentStep < steps.length) {
                        setStatus(steps[currentStep].msg);
                        setProgress(((currentStep + 1) / steps.length) * 100);
                        currentStep++;
                    }
                }, 1000);

                // Actual API Call
                const formData = new FormData();
                if (files) {
                    files.forEach((file) => {
                        formData.append("files", file);
                    });
                }
                if (address) {
                    formData.append("address", address);
                }

                const response = await fetch("/api/analyze", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to analyze images");
                }

                const result: ScopeData = await response.json();

                // Ensure we show 100% before finishing
                clearInterval(interval);
                setProgress(100);
                setStatus("Analysis Complete!");

                // Small delay to show 100%
                setTimeout(() => {
                    setData(result);
                    setLoading(false);
                    // Auto-open the Chief to greet the user
                    setTimeout(() => setIsChiefOpen(true), 1000);
                }, 500);

            } catch (err: unknown) {
                console.error(err);
                const errorMessage = err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                setLoading(false);
            }
        };

        analyzeImages();
    }, [files, address]);

    const calculateFinancials = (items: ScopeData["lineItems"]) => {
        const subtotal = items.reduce((acc, item) => acc + item.total, 0);
        const overheadProfit = subtotal * 0.20; // 20% O&P
        const total = subtotal + overheadProfit;
        return { subtotal, overheadProfit, total };
    };

    const generatePDF = () => {
        if (!data) return;
        const financials = calculateFinancials(data.lineItems);
        const doc = new jsPDF();

        // Branding
        doc.setFillColor(34, 197, 94); // Green
        doc.rect(0, 0, 210, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Chieftamate AI Estimator", 105, 13, { align: "center" });

        // Customer Info (Mock for now as we don't collect it yet)
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Job ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 160, 30);

        // Summary Text
        doc.setFontSize(10);
        doc.text(`Findings: ${data.summary}`, 14, 40, { maxWidth: 180 });

        // Table
        autoTable(doc, {
            startY: 50,
            head: [["Category", "Xact Code", "Description", "Qty", "Unit", "Price", "Total"]],
            body: data.lineItems.map((item) => [
                item.category,
                item.xactimateCode || "-",
                item.description,
                item.quantity,
                item.unit,
                `$${item.unitPrice.toFixed(2)}`,
                `$${item.total.toFixed(2)}`,
            ]),
            theme: "striped",
            headStyles: { fillColor: [34, 197, 94] },
        });

        // Summary
        const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text(`Subtotal: $${financials.subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`O&P (20%): $${financials.overheadProfit.toFixed(2)}`, 140, finalY + 6);
        doc.setFontSize(16);
        doc.setTextColor(34, 197, 94);
        doc.text(`Grand Total: $${financials.total.toFixed(2)}`, 140, finalY + 14);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("We treat you like an old friend.", 105, 280, { align: "center" });

        doc.save("Chieftamate_Scope.pdf");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                        <div className="relative bg-background p-4 rounded-full border-2 border-primary">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-destructive">Analysis Failed</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={onBack}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const financials = calculateFinancials(data.lineItems);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Upload
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <CheckCircle className="text-primary h-8 w-8" />
                            Scope Generated Successfully
                        </h1>
                        <p className="text-muted-foreground">
                            AI Analysis complete. Pricing localized to Chicago, IL.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsChiefOpen(!isChiefOpen)}
                            className={isChiefOpen ? "bg-primary/10 border-primary" : ""}
                        >
                            <Bot className="h-5 w-5 mr-2" />
                            {isChiefOpen ? "Close Chief" : "Ask The Chief"}
                        </Button>
                        <Button size="lg" onClick={generatePDF} className="gap-2">
                            <Download className="h-5 w-5" />
                            Download Package
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total RCV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                ${financials.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Line Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {data.lineItems.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Material Identified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {data.material}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Items Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Line Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="h-12 px-4 text-left font-medium">Category</th>
                                        <th className="h-12 px-4 text-left font-medium">Xact Code</th>
                                        <th className="h-12 px-4 text-left font-medium">Description</th>
                                        <th className="h-12 px-4 text-right font-medium">Qty</th>
                                        <th className="h-12 px-4 text-right font-medium">Price</th>
                                        <th className="h-12 px-4 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.lineItems.map((item, index) => (
                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{item.category}</td>
                                            <td className="p-4 font-mono text-xs text-primary font-bold">{item.xactimateCode || "-"}</td>
                                            <td className="p-4">
                                                <div>{item.description}</div>
                                                {item.notes && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Note: {item.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">{item.quantity} {item.unit}</td>
                                            <td className="p-4 text-right">${item.unitPrice.toFixed(2)}</td>
                                            <td className="p-4 text-right font-bold">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* The Chief Assistant */}
            <ChiefAssistant
                scopeData={data}
                isOpen={isChiefOpen}
                onClose={() => setIsChiefOpen(false)}
            />
        </div>
    );
}

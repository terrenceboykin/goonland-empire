"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ScopeData } from "@/types/scope";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing...");
    const [data, setData] = useState<ScopeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get data from sessionStorage (set by home page after upload)
        const storedData = sessionStorage.getItem("scopeData");
        
        if (storedData) {
            try {
                const parsedData: ScopeData = JSON.parse(storedData);
                // Simulate loading progress
                const steps = [
                    { msg: "Processing analysis results...", time: 500 },
                    { msg: "Calculating pricing...", time: 1500 },
                    { msg: "Finalizing scope...", time: 2500 },
                ];

                let currentStep = 0;
                const interval = setInterval(() => {
                    if (currentStep >= steps.length) {
                        clearInterval(interval);
                        setProgress(100);
                        setData(parsedData);
                        setLoading(false);
                        return;
                    }
                    setStatus(steps[currentStep].msg);
                    setProgress(((currentStep + 1) / steps.length) * 100);
                    currentStep++;
                }, 1000);

                return () => clearInterval(interval);
            } catch (err) {
                setError("Failed to parse analysis data");
                setLoading(false);
            }
        } else {
            // No data found, redirect to home
            setError("No analysis data found. Please upload images first.");
            setTimeout(() => router.push("/"), 2000);
        }
    }, [router]);

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
        doc.text("Chieftamate - Professional Roof Estimation", 105, 13, { align: "center" });

        // Customer Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Job ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 160, 30);
        
        // Summary
        doc.setFontSize(10);
        doc.text(`Findings: ${data.summary}`, 14, 40, { maxWidth: 180 });
        doc.text(`Material: ${data.material}`, 14, 46);
        if (data.damage && data.damage.length > 0) {
            doc.text(`Damage: ${data.damage.join(", ")}`, 14, 52);
        }

        // Table
        autoTable(doc, {
            startY: 60,
            head: [["Category", "Xact Code", "Description", "Qty", "Unit", "Price", "Total"]],
            body: data.lineItems.map((item) => [
                item.category,
                item.xactimateCode || "-",
                item.description,
                item.quantity.toString(),
                item.unit,
                `$${item.unitPrice.toFixed(2)}`,
                `$${item.total.toFixed(2)}`,
            ]),
            theme: "striped",
            headStyles: { fillColor: [34, 197, 94] },
        });

        // Summary
        const finalY = (doc as any).lastAutoTable.finalY + 10;
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
                    <h2 className="text-2xl font-bold text-destructive">Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => router.push("/")}>Back to Upload</Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const financials = calculateFinancials(data.lineItems);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Button variant="ghost" onClick={() => router.push("/")} className="mb-2 pl-0 hover:pl-2 transition-all">
                            ← Back to Upload
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <CheckCircle className="text-primary h-8 w-8" />
                            Scope Generated Successfully
                        </h1>
                        <p className="text-muted-foreground">
                            AI Analysis complete. Pricing localized to Chicago, IL.
                        </p>
                    </div>
                    <Button size="lg" onClick={generatePDF} className="gap-2">
                        <Download className="h-5 w-5" />
                        Download Package
                    </Button>
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
        </div>
    );
}

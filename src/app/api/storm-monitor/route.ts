import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// National Weather Service API endpoint
const NWS_API_BASE = "https://api.weather.gov";

// GET /api/storm-monitor - Check for active weather alerts
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const state = searchParams.get("state") || "IL"; // Default to Illinois

        // Fetch active alerts from National Weather Service
        const alertsUrl = `${NWS_API_BASE}/alerts/active?area=${state}`;
        
        const response = await fetch(alertsUrl, {
            headers: {
                "User-Agent": "Chieftamate/1.0 (contact@chieftamate.com)",
            },
        });

        if (!response.ok) {
            throw new Error(`NWS API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter for roof-relevant alerts (hail, wind, tornado, severe thunderstorm)
        const roofRelevantAlerts = data.features?.filter((alert: any) => {
            const event = alert.properties?.event?.toLowerCase() || "";
            const keywords = ["hail", "wind", "tornado", "thunderstorm", "severe"];
            return keywords.some((keyword) => event.includes(keyword));
        }) || [];

        // Process alerts and create storm events if new
        const processedAlerts = await Promise.all(
            roofRelevantAlerts.map(async (alert: any) => {
                const props = alert.properties;
                const alertId = props.id;

                // Check if we already have this alert
                const existing = await prisma.stormEvent.findFirst({
                    where: {
                        // Store alert ID in name or create separate field
                        name: { contains: alertId },
                    },
                });

                if (!existing && props.severity === "Extreme" || props.severity === "Severe") {
                    // Create storm event for severe/extreme alerts
                    const stormEvent = await prisma.stormEvent.create({
                        data: {
                            name: `${props.event} - ${props.areaDesc}`,
                            type: props.event.toLowerCase(),
                            startDate: new Date(props.sent),
                            affectedAreas: JSON.stringify(alert.geometry?.coordinates || []),
                        },
                    });

                    return {
                        alert: props,
                        stormEvent,
                        action: "created",
                    };
                }

                return {
                    alert: props,
                    stormEvent: existing,
                    action: existing ? "exists" : "skipped",
                };
            })
        );

        return NextResponse.json({
            totalAlerts: data.features?.length || 0,
            roofRelevantAlerts: roofRelevantAlerts.length,
            processed: processedAlerts,
            message: roofRelevantAlerts.length > 0 
                ? `Found ${roofRelevantAlerts.length} roof-relevant weather alerts`
                : "No active weather alerts for roofing (hail, wind, tornado, severe storms)",
        });
    } catch (error: any) {
        console.error("Storm Monitor Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to monitor storms" },
            { status: 500 }
        );
    }
}

// POST /api/storm-monitor - Manually trigger storm scan for specific area
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { area, stormType, coordinates, state = "IL" } = body;

        // If coordinates provided, use them
        // Otherwise, check NWS for that state
        let alerts: any[] = [];

        if (coordinates) {
            // Manual storm event
            const stormEvent = await prisma.stormEvent.create({
                data: {
                    name: `${stormType || "Storm"} Event - ${new Date().toLocaleDateString()}`,
                    type: stormType || "hail",
                    startDate: new Date(),
                    affectedAreas: JSON.stringify(coordinates),
                },
            });

            return NextResponse.json({
                stormEvent,
                message: "Manual storm event created. Ready to scan for leads.",
            });
        } else {
            // Check NWS for alerts
            const alertsUrl = `${NWS_API_BASE}/alerts/active?area=${state}`;
            const response = await fetch(alertsUrl, {
                headers: {
                    "User-Agent": "Chieftamate/1.0",
                },
            });

            if (response.ok) {
                const data = await response.json();
                alerts = data.features || [];
            }
        }

        // TODO: For each alert, scan affected area and generate leads
        // This would:
        // 1. Get coordinates from alert geometry
        // 2. Use Google Maps to get satellite imagery
        // 3. Use AI to detect damage
        // 4. Generate leads automatically

        return NextResponse.json({
            alerts: alerts.length,
            message: alerts.length > 0
                ? `Found ${alerts.length} active alerts. Ready to scan for leads.`
                : "No active alerts. Monitoring will continue.",
        });
    } catch (error: any) {
        console.error("Storm Monitor Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to monitor storm" },
            { status: 500 }
        );
    }
}


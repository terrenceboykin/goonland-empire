import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { address, lat, lng } = await request.json();

        if (!address && (!lat || !lng)) {
            return NextResponse.json(
                { error: "Address or coordinates required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            throw new Error("Google Maps API key not configured");
        }

        // Get coordinates if only address provided
        let latitude = lat;
        let longitude = lng;

        if (!latitude || !longitude) {
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
            const geocodeRes = await fetch(geocodeUrl);
            const geocodeData = await geocodeRes.json();

            if (geocodeData.status !== "OK" || !geocodeData.results[0]) {
                throw new Error("Could not geocode address");
            }

            latitude = geocodeData.results[0].geometry.location.lat;
            longitude = geocodeData.results[0].geometry.location.lng;
        }

        // Fetch Air Quality data
        const airQualityUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;
        const airQualityRes = await fetch(airQualityUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            })
        });

        const airQualityData = await airQualityRes.json();

        // Note: For actual weather data, you'd use a weather API
        // Google doesn't have a direct weather API, but you can use:
        // - OpenWeatherMap API
        // - Weather.gov API
        // - Or scrape Google Weather
        
        return NextResponse.json({
            success: true,
            location: {
                lat: latitude,
                lng: longitude,
                address: address
            },
            airQuality: airQualityData,
            message: "Weather and air quality data retrieved"
        });

    } catch (error: any) {
        console.error("Weather API error:", error);
        return NextResponse.json(
            { 
                error: error.message || "Failed to fetch weather data",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}

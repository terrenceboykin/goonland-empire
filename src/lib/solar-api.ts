
const SOLAR_API_URL = 'https://solar.googleapis.com/v1/buildingInsights:findClosest';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getSolarData(lat: number, lng: number) {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error("Missing Google Maps API Key");
    }

    const url = `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error("Solar API Error:", await response.text());
        throw new Error("Failed to fetch solar data");
    }

    return response.json();
}

export async function getSatelliteImage(lat: number, lng: number) {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error("Missing Google Maps API Key");
    }
    // Google Maps Static API for satellite view
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=600x600&maptype=satellite&key=${GOOGLE_MAPS_API_KEY}`;
}

export async function getGeocode(address: string) {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error("Missing Google Maps API Key");
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results[0]) {
        throw new Error("Address not found");
    }

    return data.results[0].geometry.location; // { lat, lng }
}

/**
 * Google Maps Configuration
 * 
 * This file helps manage Maps API key and provides fallback handling
 */

export const getMapsApiKey = (): string | null => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
  }
  
  // Client-side: should be available via NEXT_PUBLIC_ prefix
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
};

export const isMapsApiKeyConfigured = (): boolean => {
  const key = getMapsApiKey();
  return key !== null && key !== 'your_google_maps_api_key_here' && key.length > 0;
};

export const getMapsApiUrl = (): string => {
  const key = getMapsApiKey();
  if (!key || !isMapsApiKeyConfigured()) {
    throw new Error('Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local');
  }
  return `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,drawing`;
};


"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleMapComponentProps {
  address: string;
}

export function GoogleMapComponent({ address }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading map...");
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!mapRef.current || !address) return;

    const initMap = async () => {
      let timeoutId: NodeJS.Timeout | null = null;
      
      try {
        setIsLoading(true);
        setError(null);
        setLoadingMessage("Initializing map...");

        // Set timeout for geocoding (30 seconds)
        timeoutId = setTimeout(() => {
          if (isLoading) {
            setError("Geocoding is taking longer than expected. Please check your address or try again.");
            setIsLoading(false);
          }
        }, 30000);

        // Load Google Maps script if not already loaded
        if (!window.google) {
          setLoadingMessage("Loading Google Maps API...");
          // Get API key from environment (client-side)
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                         (window as any).__GOOGLE_MAPS_API_KEY__;
          
          if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
            if (timeoutId) clearTimeout(timeoutId);
            setError("Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local and redeploy.");
            setIsLoading(false);
            return;
          }
          
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            const loadTimeout = setTimeout(() => {
              reject(new Error("Google Maps API load timeout"));
            }, 15000);
            
            script.onload = () => {
              clearTimeout(loadTimeout);
              resolve(null);
            };
            script.onerror = () => {
              clearTimeout(loadTimeout);
              reject(new Error("Failed to load Google Maps API"));
            };
            document.head.appendChild(script);
          });
        }

        // Initialize geocoder
        if (!geocoderRef.current) {
          geocoderRef.current = new google.maps.Geocoder();
        }

        // Geocode address
        setLoadingMessage("Looking up address...");
        
        // Add timeout warning for incomplete addresses
        const addressParts = address.split(',').map(s => s.trim());
        if (addressParts.length < 2) {
          setLoadingMessage("Address may be incomplete. Adding city/state helps (e.g., '123 Main St, Chicago, IL')...");
        }
        
        geocoderRef.current.geocode(
          { address },
          (results, status) => {
            if (timeoutId) clearTimeout(timeoutId);
            
            if (status === "OK" && results && results[0]) {
              setLoadingMessage("Loading satellite view...");
              const location = results[0].geometry.location;
              const viewport = results[0].geometry.viewport;

              // Initialize map with satellite view
              const map = new google.maps.Map(mapRef.current!, {
                center: location,
                zoom: 20,
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                mapTypeControl: true,
                mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: google.maps.ControlPosition.TOP_RIGHT,
                  mapTypeIds: [
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.HYBRID,
                    google.maps.MapTypeId.ROADMAP,
                  ],
                },
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
                tilt: 45, // 3D view
                heading: 0,
              });

              mapInstanceRef.current = map;

              // Add marker for the address
              new google.maps.Marker({
                position: location,
                map: map,
                title: address,
                animation: google.maps.Animation.DROP,
              });

              // Add info window
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px 0; font-weight: bold;">${address}</h3>
                    <p style="margin: 0; color: #666;">Click to analyze this roof</p>
                  </div>
                `,
              });

              // Add click listener to analyze roof
              map.addListener("click", (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                  infoWindow.setPosition(e.latLng);
                  infoWindow.open(map);
                  
                  // You can add roof analysis here
                  console.log("Roof analysis point:", e.latLng.toJSON());
                }
              });

              // Fit bounds to show the property
              if (viewport) {
                map.fitBounds(viewport);
              }

              setIsLoading(false);
            } else {
              let errorMsg = `Geocoding failed: ${status}`;
              if (status === "ZERO_RESULTS") {
                const addressParts = address.split(',').map(s => s.trim());
                if (addressParts.length < 2) {
                  errorMsg = "Address not found. Please include city and state (e.g., '123 Main St, Chicago, IL'). Incomplete addresses are harder to find.";
                } else {
                  errorMsg = "Address not found. Please check the address and try again.";
                }
              } else if (status === "OVER_QUERY_LIMIT") {
                errorMsg = "API quota exceeded. Please try again later.";
              } else if (status === "REQUEST_DENIED") {
                errorMsg = "Google Maps API request denied. Please check API key configuration.";
              } else if (status === "INVALID_REQUEST") {
                errorMsg = "Invalid address format. Please include city and state (e.g., '123 Main St, Chicago, IL').";
              }
              setError(errorMsg);
              setIsLoading(false);
            }
          }
        );
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);
        setError(err.message || "Failed to load map. Please check your internet connection and try again.");
        setIsLoading(false);
      }
    };

    initMap();
  }, [address]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          <p className="text-xs text-muted-foreground mt-1">This usually takes 10-30 seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <div className="text-center space-y-2">
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please check your Google Maps API key in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="h-full w-full"
      style={{ minHeight: "400px" }}
    />
  );
}


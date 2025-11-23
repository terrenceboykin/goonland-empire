"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface GoogleMapComponentProps {
  address: string;
}

export function GoogleMapComponent({ address }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  const { isLoaded: mapsLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (loadError) {
      setError(loadError);
      setIsLoading(false);
      return;
    }

    if (!mapsLoaded || !mapRef.current || !address) {
      return;
    }

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize geocoder
        const geocoder = new google.maps.Geocoder();

        // Geocode the address
        const geocodeResult = await geocoder.geocode({ address });

        if (!geocodeResult.results || geocodeResult.results.length === 0) {
          setError("Address not found. Please try a different address.");
          setIsLoading(false);
          return;
        }

        const location = geocodeResult.results[0].geometry.location;

        // Create map
        const map = new google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          tilt: 0,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Add marker
        new google.maps.Marker({
          position: location,
          map: map,
          title: address,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load map. Please try again.");
        setIsLoading(false);
      }
    };

    initMap();
  }, [mapsLoaded, loadError, address]);

  if (error) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-muted rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">
            {mapsLoaded ? "Geocoding address..." : "Loading Google Maps..."}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This usually takes 10-30 seconds
          </p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

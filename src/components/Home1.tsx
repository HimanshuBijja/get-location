"use client";
import Image from "next/image";
import InputBox from "./InputBox";
import { useEffect, useState } from "react";
export default function Home1() {
    const [location, setLocation] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error.message);
            }
        );
    }, []);

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <Image
                src="/wrong.jpg"
                alt="Location"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 flex justify-center z-10">
                <div className="bg-white/24 border border-white/32 px-12 py-8 h-fit w-fit mt-60 font-semibold text-2xl rounded-lg shadow-lg text-center ">
                    <h1>
                        Something went wrong <br /> Please try again
                    </h1>
                </div>
            </div>
        </div>
    );
}

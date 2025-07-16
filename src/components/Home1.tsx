'use client';
import InputBox from "./InputBox";
import { useEffect, useState } from "react";
export default function Home1() {

    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    
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
        <div className="">
            <div className="flex flex-col items-center justify-center  bg-grey-50 border-2 my-24 md:mx-[20vh]">
                <div>
                    <div>Name
                        <InputBox label="Name" />
                    </div>
                    <div>Email
                        <InputBox label="Email" />
                    </div>
                    <div>Phone
                        <InputBox label="Phone" />
                    </div>
                    <div>Category
                        <InputBox label="Category" />
                    </div>
                    <div>Message
                        <InputBox label="Message" />
                    </div>
                </div>
            </div>
        </div>
    );
}

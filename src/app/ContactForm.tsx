"use client";

import React, { useState } from "react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        ""
    );

    const showMessage = (msg: string, type: "success" | "error") => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 5000);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageType("");

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                showMessage(
                    "Form submitted successfully! Thank you for your message.",
                    "success"
                );
                e.currentTarget.reset();
            } else {
                showMessage(`Error: ${result.message}`, "error");
            }
        } catch (error) {
            showMessage("Network error. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Contact Form</h1>
                <p>Fill out the form below to get in touch with us</p>
            </div>
            <form id="contactForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                />
                <textarea name="message" placeholder="Your Message" required />
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {message && (
                <div className={`message ${messageType}`}>{message}</div>
            )}
           
        </div>
    );
}

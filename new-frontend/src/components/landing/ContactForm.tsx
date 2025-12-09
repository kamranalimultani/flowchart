"use client";

import React, { useState } from "react";
import { postRequest } from "@/utils/apiUtils";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            toast.error("ReCAPTCHA not ready. Please try again.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await executeRecaptcha("contact_form");

            await postRequest("/api/contact", { ...formData, recaptcha_token: token }, false);

            toast.success("Message sent successfully!");
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                message: "",
            });
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleContactSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                    Phone Number
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                    Message
                </label>
                <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <ArrowRight className="inline-block ml-2 w-5 h-5" />}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
                This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy" className="underline hover:text-primary mx-1">Privacy Policy</a> and
                <a href="https://policies.google.com/terms" className="underline hover:text-primary mx-1">Terms of Service</a> apply.
            </p>
        </form>
    );
}

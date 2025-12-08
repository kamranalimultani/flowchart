"use client";

// src/pages/SignUp.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderIcon, ArrowRight } from "lucide-react";

import bgImage from "@/assets/transparent-sg.png";
import { postRequest, formatValidationErrors } from "@/utils/apiUtils";
import { useNotification } from "@/context/NotificationContext";

interface RegisterResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
        subscription_type: string;
        status: string;
    };
    razorpay_key?: string;
    subscription_id?: string;
    user_id?: number;
}

interface CheckoutResponse {
    success: boolean;
    message: string;
    checkout_url: string;
    checkout_id: string;
}

export default function SignUp() {
    const router = useRouter();
    const { showSuccess, showError, showWarning } = useNotification();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        company_name: "",
        industry: "",
        subscription_type: "free_trial",
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear field error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (!formData.company_name.trim()) {
            errors.company_name = "Company name is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            showWarning("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ Register user (create subscription if paid)
            const userResponse: any = await postRequest("/api/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                company_name: formData.company_name,
                industry: formData.industry,
                subscription_type: formData.subscription_type,
            }, false);

            if (!userResponse.success) {
                showError(userResponse.message || "Registration failed");
                return;
            }

            // Free trial
            if (formData.subscription_type === "free_trial") {
                showSuccess("Account created successfully!");
                setTimeout(() => router.push("/login"), 1500);
                return;
            }

            // 2️⃣ For Paid Subscription: Open Razorpay Checkout
            const { razorpay_key, subscription_id, user_id } = userResponse;

            if (!razorpay_key || !subscription_id) {
                showError("Unable to initialize payment. Please try again.");
                return;
            }

            const options = {
                key: razorpay_key,
                subscription_id: subscription_id,
                name: "Melvok",
                description: "Monthly Subscription",
                handler: async function (response: any) {
                    try {
                        // 3️⃣ Verify payment on backend
                        const verifyRes: any = await postRequest("/api/payment/verify", {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            user_id: user_id,
                        }, false);

                        if (verifyRes.success) {
                            showSuccess("Payment successful! Your account is now active.");
                            setTimeout(() => router.push("/login"), 1500);
                        } else {
                            showError(verifyRes.message || "Payment verification failed.");
                        }
                    } catch (err: any) {
                        showError("Payment verification failed. Please contact support.");
                    }
                },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: function () {
                        showWarning("Payment cancelled. You can retry later.");
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            if (error) {
                // Need to check error structure, simplified here based on existing code logic
                if (error.errorCode === "EMAIL_EXISTS") {
                    showError("This email is already registered.");
                    setFieldErrors({ email: "Email already registered" });
                } else if (error.errorCode === "NETWORK_ERROR") {
                    showError("Network error. Please check your connection.");
                } else {
                    showError(error.message || "Registration failed.");
                    if (error.errors) {
                        const newFieldErrors = formatValidationErrors(error.errors);
                        setFieldErrors(newFieldErrors);
                    }
                }
            } else {
                showError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <Link href="/" className="inline-block">
                            <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                MelvokFlow
                            </h1>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Create your account to get started
                        </p>
                    </div>

                    <Card className="border-2">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
                            <CardDescription>
                                Start your journey with MelvokFlow
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`h-11 ${fieldErrors.name ? "border-red-500" : ""
                                            }`}
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-sm text-red-600">{fieldErrors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`h-11 ${fieldErrors.email ? "border-red-500" : ""
                                            }`}
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-sm text-red-600">
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`h-11 ${fieldErrors.password ? "border-red-500" : ""
                                                }`}
                                        />
                                        {fieldErrors.password && (
                                            <p className="text-sm text-red-600">
                                                {fieldErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`h-11 ${fieldErrors.confirmPassword ? "border-red-500" : ""
                                                }`}
                                        />
                                        {fieldErrors.confirmPassword && (
                                            <p className="text-sm text-red-600">
                                                {fieldErrors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <Label>Company Details</Label>
                                    <div className="space-y-3 mt-2">
                                        <div>
                                            <Input
                                                name="company_name"
                                                placeholder="Company Name"
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                className={
                                                    fieldErrors.company_name ? "border-red-500" : ""
                                                }
                                            />
                                            {fieldErrors.company_name && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {fieldErrors.company_name}
                                                </p>
                                            )}
                                        </div>
                                        <Input
                                            name="industry"
                                            placeholder="Industry (optional)"
                                            value={formData.industry}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <Label>Choose Subscription Type</Label>
                                    <select
                                        name="subscription_type"
                                        value={formData.subscription_type}
                                        onChange={handleChange}
                                        className="w-full border rounded-md h-11 px-3 mt-2 bg-background"
                                    >
                                        <option value="free_trial">Free Trial</option>
                                        <option value="paid_999">Paid ₹999</option>
                                        <option value="paid_1999">Paid ₹1999</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Sign Up
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div
                className="hidden lg:flex flex-1 items-center justify-center p-12 relative bg-gray-100 overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage.src})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat",
                }}
            >
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs"></div>
                <div className="relative max-w-2xl space-y-8 text-center text-dark z-10">
                    <h2 className="text-5xl font-bold tracking-black text-dark">
                        Get started with Flow Survey!
                    </h2>
                    <p className="text-lg text-muted-dark">
                        Build, manage, and automate workflows for your entire company in
                        one place. <br />
                        <span className="text-sm font-black">Powered By Melvok.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

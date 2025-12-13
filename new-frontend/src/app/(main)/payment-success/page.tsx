"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Optional: Verify payment status with your backend
        const checkoutId = searchParams.get("checkout_id");
        if (checkoutId) {
            // You can make an API call here to verify the payment
            console.log("Checkout ID:", checkoutId);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-8 bg-background">
            <Card className="w-full max-w-md border-2">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Payment Successful!
                    </CardTitle>
                    <CardDescription>
                        Your subscription has been activated successfully
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Thank you for subscribing to Flow Survey. Your account is now
                            active and you can start using all premium features.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Button onClick={() => router.push("/dashboard")} className="w-full">
                            Go to Dashboard
                        </Button>

                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}

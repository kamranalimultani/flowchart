"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoVideo() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-4xl">
                <Card className="shadow-sm border">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-semibold">
                            Melvok Product Demo
                        </CardTitle>
                        <CardDescription>
                            A short walkthrough of how Melvok streamlines your workflow.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* 🎥 YouTube Embed */}
                        <div className="relative aspect-video rounded-md overflow-hidden border bg-muted">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/_-0uPip_70w?si=i-YN1ApSxZXXLm8m"
                                title="Melvok Demo Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            In this demo, you’ll learn how to create flows, automate
                            surveys, and integrate Melvok with your existing systems.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Button
                                onClick={() => router.push("/signup")}
                                className="h-10 px-6"
                            >
                                Get Started
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-10 px-6"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-10 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Melvok. All rights reserved.
                </div>
            </div>
        </div>
    );
}

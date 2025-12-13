"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    const values = [
        {
            title: "Transparency",
            desc: "We believe in clear data and honest insights.",
        },
        { title: "Security", desc: "Your data stays private and encrypted." },
        {
            title: "Innovation",
            desc: "Constantly evolving with cutting-edge tech.",
        },
        {
            title: "Collaboration",
            desc: "We empower teams to make better decisions together.",
        },
    ];

    const stats = [
        { label: "Active Users", value: "10K+" },
        { label: "Surveys Created", value: "25K+" },
        { label: "Enterprises Served", value: "500+" },
        { label: "Data Points Collected", value: "5M+" },
    ];

    return (
        <>
            {/* 🌐 Actual Page Content */}
            <div className="min-h-screen py-20">
                <div className="container mx-auto px-4">
                    {/* Intro / Hero */}
                    <section className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge className="mx-auto">About Flow Survey</Badge>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            We turn questions into insight
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg leading-relaxed">
                            Flow Survey is a modern survey and analytics platform designed to
                            empower creators, teams, and enterprises. Our mission is simple:
                            make it easy to collect feedback, understand it deeply, and act on
                            it confidently.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button size="lg">Get Started</Button>
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </div>
                    </section>

                    <Separator className="my-12" />

                    {/* Mission & Values */}
                    <section className="grid lg:grid-cols-2 gap-8 items-start">
                        <Card className="p-8">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">
                                    Our Mission
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-base leading-relaxed">
                                    At Flow Survey, we believe feedback is a superpower. We build tools
                                    that transform how you ask questions, analyze answers, and act
                                    on results — all while preserving simplicity, security, and
                                    transparency.
                                </p>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {values.map((v) => (
                                        <div key={v.title} className="space-y-1">
                                            <h4 className="font-semibold">{v.title}</h4>
                                            <p className="text-sm leading-snug text-muted-foreground">
                                                {v.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl p-6 shadow border flex flex-col items-center"
                                >
                                    <div className="text-3xl md:text-4xl font-black">
                                        {s.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Separator className="my-12" />

                    {/* Why Flow Survey */}
                    <section className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Why Flow Survey?</h2>
                        <p className="text-lg leading-relaxed">
                            Flexible & visual survey builder • Built-in analytics & exports •
                            AI-powered insights • Enterprise-grade security • Seamless
                            integrations
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}

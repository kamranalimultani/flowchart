import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutUs() {
  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Surveys Created", value: "2M+" },
    { label: "Responses Collected", value: "500M+" },
    { label: "Countries Worldwide", value: "150+" },
  ];

  const values = [
    {
      title: "User-first",
      desc: "We prioritize intuitive design, privacy, and clarity in every feature.",
    },
    {
      title: "Insight-driven",
      desc: "We turn raw responses into meaningful insights that drive decisions.",
    },
    {
      title: "Scalable & reliable",
      desc: "Built to grow with you, from small-scale projects to enterprise use.",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Intro / Hero */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <Badge className="mx-auto">About Melvok</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            We turn questions into insight
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed">
            Melvok is a modern survey and analytics platform designed to empower
            creators, teams, and enterprises. Our mission is simple: make it
            easy to collect feedback, understand it deeply, and act on it
            confidently.
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
              <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">
                At Melvok, we believe feedback is a superpower. We build tools
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
                <div className="text-3xl md:text-4xl font-black">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Why Melvok / What sets us apart */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Why Melvok?</h2>
          <p className="text-lg leading-relaxed">
            - Flexible & visual survey builder - Built-in analytics, dashboards
            & exports - AI-powered suggestions & insights - Enterprise-grade
            security & scalability - Seamless integrations with your toolkit
          </p>
        </section>
      </div>
    </div>
  );
}

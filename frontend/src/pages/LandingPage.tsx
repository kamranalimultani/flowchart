"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  ChevronRight,
  FileText,
  BarChart2,
  Share2,
  Users,
  Edit,
  Download,
  Layers,
  Star,
  CheckCircle,
  Zap,
  PlayCircle,
} from "lucide-react";

// Add additional details for richer content
const features = [
  {
    icon: <FileText className="w-6 h-6 text-orange-500" />,
    title: "Build Custom Diagrams",
    description:
      "Design complex, dynamic workflows with a powerful drag-and-drop builder. Flexible for any business process.",
  },
  {
    icon: <Edit className="w-6 h-6 text-green-500" />,
    title: "Edit Instantly",
    description:
      "Revise your logic and forms on the fly. Real-time editing for maximum agility.",
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-500" />,
    title: "Template Library",
    description:
      "Access and save templates for surveys, checklists, and SOPs. Deploy in seconds.",
  },
  {
    icon: <Share2 className="w-6 h-6 text-blue-500" />,
    title: "Seamless Sharing",
    description:
      "Share flows with anyone—no signup required. Gather info with public or restricted links.",
  },
  {
    icon: <Users className="w-6 h-6 text-pink-500" />,
    title: "Team Management",
    description:
      "Granular roles, permissions, and audit logs for secure internal governance.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-cyan-500" />,
    title: "Insights & Analytics",
    description:
      "Actionable dashboards. Visualize metrics, discover trends, and make data-driven decisions.",
  },
  {
    icon: <Download className="w-6 h-6 text-red-500" />,
    title: "Export Anything",
    description:
      "Download submissions, charts, and raw data as CSV, XLSX, PDF, or JSON.",
  },
  {
    icon: <Layers className="w-6 h-6 text-yellow-500" />,
    title: "Multiple Projects",
    description:
      "Manage multiple workflows, submissions, and reviews—all in one workspace.",
  },
];

// Example Use Cases
const useCases = [
  {
    icon: <Zap className="w-6 h-6 text-green-600" />,
    title: "HR Onboarding",
    desc: "Streamline new employee onboarding with automated, multi-step forms and compliance tracking.",
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "Customer Surveys",
    desc: "Collect customer feedback, NPS, and satisfaction data via branded, mobile-ready forms.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-600" />,
    title: "IT Service Desk",
    desc: "Build ticketing and approval flows for IT requests, maintenance, and asset management.",
  },
  {
    icon: <Zap className="w-6 h-6 text-pink-600" />,
    title: "Compliance Workflows",
    desc: "Automate audits, safety checks, and SOP compliance with tracked digital flows.",
  },
  {
    icon: <Zap className="w-6 h-6 text-purple-600" />,
    title: "Field Data Collection",
    desc: "Empower field teams to capture reports, inspections, and leads even offline.",
  },
];

const testimonials = [
  {
    name: "Jenna K.",
    title: "Head of Ops, BetaCorp",
    quote:
      "We've reduced our paperwork by 90%. Custom workflows are a lifesaver—setup is instant, and our team loves the UX.",
  },
  {
    name: "Ali S.",
    title: "Director, TechCrew",
    quote:
      "Our onboarding flow went from days to hours. The analytics blew our leadership away. Huge impact.",
  },
  {
    name: "Luis M.",
    title: "Product Manager, SnapData",
    quote:
      "Form builder is the best on the market. No-code automation is real!",
  },
];

const integrations = [
  { label: "Slack", icon: "path/to/slack.svg" },
  { label: "Google Sheets", icon: "path/to/googlesheets.svg" },
  { label: "Zapier", icon: "path/to/zapier.svg" },
  { label: "Jira", icon: "path/to/jira.svg" },
  { label: "HubSpot", icon: "path/to/hubspot.svg" },
];

const faqs = [
  {
    q: "Can I use it for external surveys?",
    a: "Absolutely! Share links publicly or restrict by email domain or user invite.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes, our free plan includes all builder features and up to 100 submissions/month.",
  },
  {
    q: "Do you support SSO and advanced RBAC?",
    a: "Enterprise plans include SSO, advanced permissions, and audit trails.",
  },
  {
    q: "Can I export form data?",
    a: "Yes, one-click export to CSV, Excel, or JSON is built-in.",
  },
];

export const LandingPage: React.FC = () => (
  <div className="w-full font-sans">
    {/* Sticky Nav */}
    <header className="fixed inset-x-0 top-0 z-40 bg-white/80 backdrop-blur shadow">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3 px-8">
        <div className="flex items-center gap-2 text-orange-500 font-extrabold text-2xl">
          Melvok
        </div>
        <ul className="hidden md:flex gap-8 font-medium text-gray-700">
          <li>
            <a href="#features" className="hover:text-orange-500 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#usecases" className="hover:text-orange-500 transition">
              Solutions
            </a>
          </li>
          <li>
            <a
              href="#integrations"
              className="hover:text-orange-500 transition"
            >
              Integrations
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-orange-500 transition">
              FAQ
            </a>
          </li>
        </ul>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6">
          Get Started
        </Button>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="pt-40 pb-28 px-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold mb-7 leading-tight drop-shadow"
        >
          Modern Workflow &{" "}
          <span className="underline decoration-white">Survey Platform</span>
        </motion.h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 font-medium">
          Streamline processes. Collect rich data. Automate reviews. Empower
          your team with no-code flow management.
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <Button
            size="lg"
            className="bg-white text-orange-500 font-bold shadow hover:bg-orange-100"
          >
            Start Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-black hover:bg-white/10"
          >
            Request Demo
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Star className="text-yellow-400" />
          <span className="font-bold">4.9/5 average on</span>
          <img src="path/to/g2.svg" alt="G2" className="h-6" />
          <img src="path/to/capterra.svg" alt="Capterra" className="h-6" />
        </div>
      </div>
      {/* Gradient bubble decorations */}
      <span className="absolute right-10 -top-20 w-96 h-96 bg-pink-400 opacity-20 blur-3xl rounded-full"></span>
      <span className="absolute left-0 -bottom-40 w-96 h-96 bg-orange-400 opacity-20 blur-3xl rounded-full"></span>
    </section>
    <section className="py-28 px-6 bg-gradient-to-br from-orange-100 via-pink-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-5 text-gray-900">
          See Melvok in Action
        </h2>
        <p className="text-lg text-gray-500 mb-12">
          Watch a quick platform demo to get a feel for beautiful builder UX,
          workflow automation, and insights—all in one place.
        </p>
        <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl group">
          <video
            className="w-full h-auto bg-black"
            autoPlay
            loop
            muted
            playsInline
            controls
            poster="/static/video-poster.jpg" // optional preview image before load
          >
            <source src="/static/flowforms-demo.mp4" type="video/mp4" />
            {/* Add other formats if needed */}
            Your browser does not support the video tag.
          </video>
          {/* Optional: Big Play Button Overlay (appears only when paused) */}
          {/* This version uses browser controls, so extra overlay is not strictly needed, but you can customize UX here */}
          {/* <button
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 bg-black/10 transition pointer-events-none"
            tabIndex={-1}
            aria-label="Play Demo"
          >
            <PlayCircle className="w-20 h-20 text-white/90 drop-shadow-lg" />
          </button> */}
        </div>
      </div>
    </section>
    <section className="py-24 px-6 bg-gradient-to-br from-orange-100 via-pink-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Product Demo</h2>
        <p className="text-lg text-gray-600 mb-10">
          Watch how easily you can build, automate, and analyze workflows on
          Melvok in less than 90 seconds.
        </p>
        <div className="relative rounded-2xl overflow-hidden max-w-3xl mx-auto shadow-xl border border-orange-200">
          <video
            className="w-full h-auto"
            src="/static/your-demo.mp4" // Replace with your video
            autoPlay
            loop
            muted
            controls
            playsInline
            poster="/static/video-thumbnail.jpg" // Optional poster image
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/70 backdrop-blur-lg px-4 py-2 rounded-full shadow">
            <PlayCircle className="w-6 h-6 text-orange-500" />
            <span className="font-medium text-gray-800">Auto demo</span>
          </div>
        </div>
      </div>
    </section>
    {/* Features */}
    <section id="features" className="py-28 px-6 bg-white">
      <h2 className="text-4xl font-bold text-center mb-4">Key Features</h2>
      <p className="text-lg text-center text-gray-500 max-w-2xl mx-auto mb-14">
        Everything you need to build and run advanced workflow automations,
        digital forms, and collaborative approval chains.
      </p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="shadow-xl border-orange-100 hover:translate-y-[-5px] transition-all duration-200">
              <CardHeader className="flex items-center space-x-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Use Cases */}
    <section id="usecases" className="py-28 bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Built For Every Department
        </h2>
        <p className="text-lg text-center mb-14 text-gray-200 max-w-2xl mx-auto">
          Melvok is trusted across HR, operations, IT, field teams, compliance,
          and customer engagement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-800 p-7 flex flex-col items-center text-center shadow-md border border-gray-700"
            >
              {uc.icon}
              <h3 className="font-semibold text-xl mt-4 mb-2">{uc.title}</h3>
              <p className="text-gray-300">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <span className="absolute right-10 -top-28 w-80 h-80 bg-cyan-400 opacity-20 blur-3xl rounded-full"></span>
    </section>

    {/* Diagram & Form Builder Showcase */}
    <section className="py-28 px-6 bg-orange-50">
      <h2 className="text-4xl font-bold text-center mb-2">
        Visual Builder in Action
      </h2>
      <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
        Flexible drag-and-drop design, with instant previews and version
        history.
      </p>
      <div className="max-w-5xl mx-auto flex flex-col gap-14 md:flex-row md:gap-6">
        <div className="flex-1 flex flex-col space-y-3">
          <h3 className="font-bold text-lg mb-1">Diagramming Studio</h3>
          <div className="rounded-lg bg-white h-64 shadow-inner flex items-center justify-center border border-dashed border-orange-300">
            <span className="text-gray-400">
              [Workflow Diagram Live Preview]
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-3">
          <h3 className="font-bold text-lg mb-1">Form Editor</h3>
          <div className="rounded-lg bg-white h-64 shadow-inner flex items-center justify-center border border-dashed border-orange-300">
            <span className="text-gray-400">[Form Builder Editor Preview]</span>
          </div>
        </div>
      </div>
    </section>

    {/* Analytics */}
    <section className="py-28 px-6 bg-white">
      <h2 className="text-4xl font-bold text-center mb-4">
        Reporting & Analytics
      </h2>
      <p className="text-center max-w-3xl mx-auto mb-10 text-gray-600">
        Visual dashboards, submission trends, automated flagging, and exports
        for all your survey and workflow activities.
      </p>
      <div className="max-w-5xl mx-auto h-80 rounded-xl bg-gray-100 flex items-center justify-center shadow-inner border border-dashed border-orange-300">
        <span className="text-gray-400">[Analytics Dashboard Preview]</span>
      </div>
    </section>

    {/* Integrations & Logos */}
    <section id="integrations" className="py-24 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-5">
        Connect With Your Tools
      </h2>
      <p className="text-center mb-10 text-gray-500">
        Work better with secure, out-of-the-box integrations.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-7 mx-auto max-w-4xl">
        {integrations.map((integration, i) => (
          <div
            key={i}
            className="bg-white shadow p-4 rounded-lg flex items-center gap-2"
          >
            <img
              src={integration.icon}
              alt={integration.label}
              className="w-7 h-7"
            />
            <span className="text-base font-medium">{integration.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Social Proof & Testimonials */}
    <section className="py-28 px-6 bg-pink-50">
      <h2 className="text-3xl font-bold text-center mb-4">Our Customers Say</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-900">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="shadow-lg rounded-xl bg-white p-7 border border-pink-100 flex flex-col items-center"
          >
            <div className="mt-2 mb-4">
              <CheckCircle className="text-green-500 w-7 h-7" />
            </div>
            <blockquote className="italic text-base">
              &quot;{t.quote}&quot;
            </blockquote>
            <div className="flex flex-col items-center mt-6">
              <span className="font-bold">{t.name}</span>
              <span className="text-xs text-gray-400">{t.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="py-28 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-4">FAQs</h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((f, i) => (
          <div key={i} className="mb-8">
            <h4 className="font-bold text-lg mb-2">Q: {f.q}</h4>
            <p className="text-gray-600 pl-2">{f.a}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Pricing Table */}
    <section className="py-28 px-6 bg-orange-50">
      <h2 className="text-3xl font-bold text-center mb-10">
        Transparent Pricing
      </h2>
      <div className="flex flex-col sm:flex-row gap-10 justify-center items-center max-w-5xl mx-auto">
        <div className="flex-1 rounded-lg bg-white p-8 border shadow">
          <div className="font-bold text-xl mb-2">Starter</div>
          <div className="text-3xl font-bold mb-2 text-orange-500">Free</div>
          <ul className="mb-4 text-gray-600">
            <li>✔ Up to 100 submissions/month</li>
            <li>✔ All core features</li>
            <li>✔ 1 Team workspace</li>
          </ul>
          <Button className="bg-orange-500 text-white w-full">
            Get Started
          </Button>
        </div>
        <div className="flex-1 rounded-lg bg-white p-8 border-2 border-orange-500 shadow-xl scale-105">
          <div className="flex items-center gap-2 font-bold text-xl mb-2">
            Pro{" "}
            <span className="bg-orange-100 text-orange-500 px-2 py-0.5 rounded-xl text-xs font-semibold">
              Most Popular
            </span>
          </div>
          <div className="text-3xl font-bold mb-2 text-orange-500">
            $29 <span className="text-lg text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="mb-4 text-gray-600">
            <li>✔ Unlimited submissions</li>
            <li>✔ Advanced analytics</li>
            <li>✔ Priority support</li>
            <li>✔ SSO & audit logs</li>
          </ul>
          <Button className="bg-orange-500 text-white w-full">
            Start Free Trial
          </Button>
        </div>
        <div className="flex-1 rounded-lg bg-white p-8 border shadow">
          <div className="font-bold text-xl mb-2">Enterprise</div>
          <div className="text-3xl font-bold mb-2 text-orange-500">Custom</div>
          <ul className="mb-4 text-gray-600">
            <li>✔ Uptime SLA</li>
            <li>✔ Custom integrations</li>
            <li>✔ Dedicated manager</li>
          </ul>
          <Button className="bg-orange-500 text-white w-full">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-32 px-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white text-center"
    >
      <h2 className="text-4xl font-bold mb-4">Ready To Work Smarter?</h2>
      <p className="mb-8 max-w-2xl mx-auto text-lg">
        Launch your first workflow in minutes. No code. No hassle.
      </p>
      <Button
        size="lg"
        className="bg-white text-orange-500 font-bold shadow hover:bg-orange-100"
      >
        Try Free Now
      </Button>
    </motion.section>

    {/* Footer */}
    <footer className="bg-black text-gray-300 py-12 mt-[-1px]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-10 justify-between">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-extrabold text-2xl mb-2">
            Melvok
          </div>
          <div className="text-gray-400 mb-2">
            Modern no-code workflow and survey management for businesses of all
            sizes.
          </div>
          <div className="text-gray-500 text-sm mt-8">
            &copy; 2025 Melvok, Inc. All rights reserved.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-gray-200 mb-1">Product</div>
          <a href="#features" className="hover:text-orange-400">
            Features
          </a>
          <a href="#usecases" className="hover:text-orange-400">
            Solutions
          </a>
          <a href="#integrations" className="hover:text-orange-400">
            Integrations
          </a>
          <a href="#faq" className="hover:text-orange-400">
            FAQs
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-gray-200 mb-1">Company</div>
          <span>About</span>
          <span>Careers</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  </div>
);

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CircleUser,
  Menu,
  Moon,
  Sun,
  Power,
  Utensils,
  ChevronRight,
  Play,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  BarChart3,
  FileText,
  Share2,
  Download,
  Sparkles,
  Globe,
  Lock,
  Workflow,
  Brain,
  PieChart,
  TrendingUp,
  Clock,
  Filter,
  Target,
  Boxes,
  Palette,
  Code,
  Database,
  Mail,
  Star,
  ArrowRight,
  Check,
  X,
  Award,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import ContactForm from "@/components/landing/ContactForm";

// Note: demoVideo import might need adjustment if it's not in public or assets works differently
// For now, assume assets alias works or move file. 
// Old: import demoVideo from "@/assets/Melvok.webm";
// If aliases work, fine. If not, might need to move to public.
// I'll keep the import for now, but Next.js usually likes static assets in public or standard imports.
// Video moved to public folder
const demoVideo = "/Melvok.webm";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<any>("hero");
  const [hoveredPlan, setHoveredPlan] = useState<any>(null);
  const [hoveredUseCase, setHoveredUseCase] = useState<any>(null);
  const [hoveredAI, setHoveredAI] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 5000); // 10 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = [
        "hero",
        "features",
        "flows",
        "analytics",
        "ai",
        "pricing",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Drag-and-Drop Flow Builder",
      description:
        "Create complex survey flows with an intuitive drag-and-drop interface. Design conditional logic, branching paths, and dynamic routing based on user responses.",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Rich Form Templates",
      description:
        "Access dozens of professionally designed form templates. Customize every aspect with 20+ question types including multiple choice, matrix, rating scales, file uploads, and more.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description:
        "Leverage artificial intelligence for smart question suggestions, sentiment analysis, automatic categorization, and predictive insights from your survey data.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Comprehensive data visualization with real-time dashboards, cross-tabulation, trend analysis, heat maps, and exportable reports. Understand your data deeply.",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Smart Sharing",
      description:
        "Share surveys via multiple channels - email, social media, QR codes, embedded widgets. Track distribution and manage access with granular permissions.",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Flexible Exports",
      description:
        "Export individual responses as PDF reports or bulk data in CSV, Excel, JSON formats. Integrate with your favorite tools via webhooks and API.",
    },
  ];

  const questionTypes = [
    "Single Choice",
    "Multiple Choice",
    "Text Input",
    "Long Text",
    "Number Input",
    "Email Validation",
    "Date Picker",
    "Time Picker",
    "Rating Scale",
    "Star Rating",
    "Slider",
    "Matrix Grid",
    "Ranking",
    "File Upload",
    "Image Choice",
    "Video Response",
    "Signature Capture",
    "Location Picker",
    "Phone Number",
    "Dropdown Select",
  ];

  const advancedFeatures = [
    {
      category: "Logic & Branching",
      items: [
        "Conditional logic and skip patterns",
        "Question piping and dynamic text",
        "Custom validation rules",
        "Multi-page forms with progress tracking",
        "Random question ordering",
        "Question randomization within groups",
      ],
    },
    {
      category: "Design & Customization",
      items: [
        "Fully customizable themes and branding",
        "Custom CSS and JavaScript support",
        "White-label solutions",
        "Mobile-responsive designs",
        "Accessibility compliance (WCAG 2.1)",
        "Multi-language support with auto-translation",
      ],
    },
    {
      category: "Data & Integration",
      items: [
        "Real-time response notifications",
        "Webhook integrations",
        "REST API access",
        "Database connections",
        "CRM integrations (Salesforce, HubSpot)",
        "Marketing tool connections (Mailchimp, ActiveCampaign)",
      ],
    },
    {
      category: "Security & Compliance",
      items: [
        "SSL encryption for all data",
        "GDPR compliance tools",
        "Password-protected surveys",
        "IP address restrictions",
        "Response validation and fraud detection",
        "SOC 2 Type II certified infrastructure",
      ],
    },
  ];

  const analyticsFeatures = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Dashboards",
      description:
        "Interactive charts, graphs, and visualizations that update in real-time as responses come in.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trend Analysis",
      description:
        "Track changes over time with historical comparisons and predictive forecasting.",
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Advanced Filtering",
      description:
        "Segment data by demographics, responses, dates, or custom criteria for deeper insights.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Cross-Tabulation",
      description:
        "Compare multiple variables simultaneously to discover hidden correlations and patterns.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Tables",
      description:
        "View raw response data in sortable, filterable tables with bulk actions and annotations.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Geographic Mapping",
      description:
        "Visualize responses on interactive maps with heat maps and regional breakdowns.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 3 active flows",
        "10 responses per month",
        "Basic analytics",
      ],
      notIncluded: [
        "AI features",
        "Advanced analytics",
        "Custom branding",
        "API access",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      description: "For growing teams and businesses",
      features: [
        "Unlimited flows",
        "Unlimited responses ",
        "Advanced analytics & reporting",
        "Custom branding",
        "Priority support",
        "90-day data retention",
        "Export to CSV/PDF",
        "Unlimited team members",
      ],
      notIncluded: ["AI features", "White-label", "Dedicated account manager"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per month",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Professional",
        "Unlimited responses",
        "AI-powered insights & predictions",
        "Advanced sentiment analysis",
        "White-label solution",
        "Custom integrations",
        "Dedicated account manager",
        "Unlimited data retention",
        "Role-based user management",
        "Unlimited team members",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const useCases = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Feedback",
      description:
        "Gather valuable insights from your customers to improve products and services.",
      stat: "95% satisfaction",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Employee Engagement",
      description:
        "Measure team satisfaction, collect feedback, and boost workplace culture.",
      stat: "2x engagement",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Market Research",
      description:
        "Conduct comprehensive market studies with sophisticated questionnaires.",
      stat: "10k+ responses",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Event Registration",
      description:
        "Streamline event sign-ups with automated confirmations and reminders.",
      stat: "Instant setup",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Lead Generation",
      description:
        "Capture qualified leads with smart forms that integrate with your CRM.",
      stat: "3x conversion",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance & Audits",
      description:
        "Create secure assessment forms for compliance tracking and auditing.",
      stat: "100% secure",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Video Background */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <div className="absolute inset-0 bg-grid-white/5" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
              <Badge variant="secondary" className="px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Survey Platform
              </Badge>

              {/* ✅ Primary H1 Heading for SEO */}
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Build Powerful Flowchart Surveys &
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Interactive Decision Trees
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The enterprise-grade visual form builder. Create complex logic flows
                and branching surveys without coding. Transform how you collect and
                understand data.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 py-6 group">
                    Start Building Free
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  onClick={() => router.push("/demo")}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 group"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Demo Video/Image Placeholder */}
            <div className="mt-16 max-w-6xl mx-auto mb-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
                <div className=" mb-6 aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <video
                    className="w-full h-full object-cover"
                    controls={false}
                    autoPlay
                    muted
                    loop
                  >
                    <source src={demoVideo} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {/* Floating Cards */}
                <div
                  className="absolute -right-4 top-1/4 hidden lg:block animate-float"
                  style={{ animationDelay: "0s" }}
                >
                  <Card className="w-48 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Response Received</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div
                  className="absolute -left-4 bottom-1/4 hidden lg:block animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Card className="w-48 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>85% Completion Rate</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Active Users", value: "50K+" },
                { label: "Surveys Created", value: "2M+" },
                { label: "Responses Collected", value: "500M+" },
                { label: "Countries Worldwide", value: "150+" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Everything You Need to Create
                <span className="block text-primary">Amazing Surveys</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features designed to help you collect better data, make
                smarter decisions, and drive real business results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <Card
                  key={i}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-10 flex flex-col items-center">
          <div className="max-w-3xl w-full px-4">
            <Card className="shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                  Third-Party Integrations
                </CardTitle>
              </CardHeader>

              <Separator />

              <CardContent className="space-y-6 mt-4">
                <p className="text-sm text-muted-foreground text-center">
                  Flow Survey seamlessly integrates with industry-leading tools to
                  enhance user experience and workflow efficiency.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Diagram Tool</Badge>
                    </div>
                    <h3 className="font-medium">Draw.io Integration</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and edit flowcharts or diagrams directly within
                      Flow Survey using Draw.io’s embedded editor.
                    </p>
                    <a
                      href="https://www.draw.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm mt-3 hover:underline"
                    >
                      Learn more <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="border rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Survey Platform</Badge>
                    </div>
                    <h3 className="font-medium">SurveyJS Integration</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Design and analyze interactive surveys using the SurveyJS
                      engine integrated into Flow Survey’s platform.
                    </p>
                    <a
                      href="https://surveyjs.io/documentation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm mt-3 hover:underline"
                    >
                      Learn more <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        {/* Question Types */}
        <section className="py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="outline" className="mb-4">
                Question Types
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                20+ Powerful Question Types
              </h2>
              <p className="text-xl text-muted-foreground">
                From simple text inputs to complex matrix grids, signature
                captures, and file uploads. We have every question type you'll
                ever need.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {questionTypes.map((type, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Grid */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="outline" className="mb-4">
                Advanced Capabilities
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-muted-foreground">
                Professional tools and integrations that scale with your
                business needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advancedFeatures.map((category, i) => (
                <Card key={i} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="outline" className="mb-4">
                Analytics
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Turn Data Into
                <span className="block text-primary">Actionable Insights</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive analytics dashboard with real-time reporting,
                advanced filtering, and beautiful visualizations. Export data in
                any format you need.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsFeatures.map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 bg-card">
                <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Individual PDFs</h3>
                <p className="text-muted-foreground">
                  Generate professional PDF reports for each response
                </p>
              </Card>
              <Card className="text-center p-8 bg-card">
                <Database className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Bulk CSV Exports</h3>
                <p className="text-muted-foreground">
                  Download all responses in CSV or Excel format
                </p>
              </Card>
              <Card className="text-center p-8 bg-card">
                <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">API Access</h3>
                <p className="text-muted-foreground">
                  Integrate data directly into your applications
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section id="ai" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:opacity-30" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in-up backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                AI Intelligence
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-foreground animate-fade-in-up animation-delay-200">
                Powered by Artificial Intelligence
              </h2>
              <p className="text-xl text-muted-foreground animate-fade-in-up animation-delay-400">
                Leverage cutting-edge AI to gain deeper insights, automate
                analysis, and make data-driven decisions faster than ever
                before.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {[
                {
                  icon: <Brain className="w-12 h-12" />,
                  title: "Smart Question Suggestions",
                  description:
                    "AI analyzes your survey goals and suggests optimal questions, question types, and flow structures to maximize response quality and completion rates.",
                  features: [
                    "Context-aware recommendations",
                    "Industry-specific templates",
                    "Best practice guidance",
                  ],
                },
                {
                  icon: <Sparkles className="w-12 h-12" />,
                  title: "Sentiment Analysis",
                  description:
                    "Automatically analyze open-ended responses to understand emotional tone, satisfaction levels, and key themes without manual review.",
                  features: [
                    "Emotion detection",
                    "Theme extraction",
                    "Satisfaction scoring",
                  ],
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredAI(index)}
                  onMouseLeave={() => setHoveredAI(null)}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div
                    className={`relative h-full bg-card rounded-3xl p-10 border-2 transition-all duration-500 overflow-hidden group ${hoveredAI === index
                      ? "border-primary/50 shadow-2xl -translate-y-2"
                      : "border-border shadow-xl"
                      }`}
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground mb-6 transform transition-all duration-500 ${hoveredAI === index ? "scale-110 rotate-6" : ""
                          }`}
                      >
                        {feature.icon}
                      </div>

                      <h3 className="text-3xl font-black mb-4 text-card-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        {feature.description}
                      </p>

                      <ul className="space-y-3">
                        {feature.features.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 group/item"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary flex items-center justify-center transform transition-transform duration-300 group-hover/item:scale-110">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-muted-foreground font-medium group-hover/item:text-foreground transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-8 translate-y-8" />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-in-up animation-delay-1000">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  stat: "10x",
                  label: "Faster Analysis",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  stat: "95%",
                  label: "Accuracy",
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  stat: "50K+",
                  label: "AI Insights",
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  stat: "24/7",
                  label: "Auto Processing",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl text-center group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black text-foreground mb-1">
                    {stat.stat}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Us Section */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in-up backdrop-blur-sm">
                <Mail className="w-4 h-4" />
                Get in Touch
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-foreground animate-fade-in-up animation-delay-200">
                Contact Us
              </h2>
              <p className="text-xl text-muted-foreground animate-fade-in-up animation-delay-400">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="animate-fade-in-up animation-delay-600">
                <Card className="p-8 border-2">
                  <GoogleReCaptchaProvider
                    reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    scriptProps={{
                      async: false,
                      defer: false,
                      appendTo: "head",
                      nonce: undefined,
                    }}
                  >
                    <ContactForm />
                  </GoogleReCaptchaProvider>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8 animate-fade-in-up animation-delay-800">
                <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email</h3>
                      <p className="text-muted-foreground mb-2">
                        Our friendly team is here to help.
                      </p>
                      <a
                        href="mailto:info@flowchartsurvey.online"
                        className="text-primary font-semibold hover:underline"
                      >
                        info@flowchartsurvey.online
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Phone</h3>
                      <p className="text-muted-foreground mb-2">
                        Mon-Fri from 8am to 5pm.
                      </p>
                      <a
                        href="tel:+919389618797"
                        className="text-primary font-semibold hover:underline"
                      >
                        +91 93896 18797
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Office</h3>
                      <p className="text-muted-foreground mb-2">
                        Come say hello at our office HQ.
                      </p>
                      <p className="text-primary font-semibold">
                        Dubai Silicon Oasis, DDP, Building A2
                        <br />
                        Dubai, United Arab Emirates
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

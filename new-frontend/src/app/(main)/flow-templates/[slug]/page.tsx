
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlowTemplate } from "@/types/flow-template";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Fetch function
async function getTemplate(slug: string): Promise<FlowTemplate | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flow-templates/${slug}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
}

interface PageProps {
    params: { slug: string };
}

// Generate Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const template = await getTemplate(slug);

    if (!template) return { title: "Template Not Found" };

    return {
        title: `${template.title} | Flow Survey Templates`,
        description: template.description,
        openGraph: {
            title: template.title,
            description: template.description,
            images: template.thumbnail_path ? [`${process.env.NEXT_PUBLIC_API_URL}/storage/${template.thumbnail_path}`] : [],
        },
    };
}

// Page Component
export default async function FlowTemplatePage({ params }: PageProps) {
    const { slug } = await params;
    const template = await getTemplate(slug);

    if (!template) {
        notFound();
    }

    const thumbnailUrl = template.thumbnail_path
        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${template.thumbnail_path}`
        : "/placeholder-image.jpg";

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/flow-templates">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Templates
                </Button>
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Thumbnail Section */}
                <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 border">
                    <img
                        src={thumbnailUrl}
                        alt={template.title}
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Array.isArray(template.tags) && template.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <p>{template.description}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Ready to use this template?</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                                Click below to preview and start customizing this flow for your needs.
                            </p>
                            {/* Note: "Use Template" logic usually requires client-side interaction (Redux dispatch, Navigation usually). 
                                Since this is a server component, we might need a client wrapper for the button or just a simple link that includes query param to open it in builder.
                                For now, simpler is generic button or we make a client component specifically for the 'Use' action.
                            */}
                            {/* <Button className="w-full md:w-auto">Use This Template</Button> */}
                            {/* User asked for sitemap/SEO. The listing page handles 'Use'. Ideally we redirect to builder with ?templateId=... 
                                Or we can ignore the 'Use' button here for now or link back to /flow-templates?use=id.
                                I'll leave a placeholder message or simple link.
                            */}
                            <Link href={`/flow-templates?use=${template.id}`}>
                                <Button className="w-full md:w-auto">
                                    Use Template
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

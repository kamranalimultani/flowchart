import React from "react";
import { FlowTemplate } from "@/types/flow-template";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FlowTemplateCardProps {
    template: FlowTemplate;
    isSuperAdmin: boolean;
    isLoggedIn: boolean;
    onEdit?: (template: FlowTemplate) => void;
    onDelete?: (id: number) => void;
    onUse?: (template: FlowTemplate) => void;
}

export function FlowTemplateCard({
    template,
    isSuperAdmin,
    isLoggedIn,
    onEdit,
    onDelete,
    onUse,
}: FlowTemplateCardProps) {
    const thumbnailUrl = template.thumbnail_path
        ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${template.thumbnail_path}`
        : "/placeholder-image.jpg"; // You might want to add a real placeholder

    const linkHref = `/flow-templates/${template.slug || template.id}`;

    return (
        <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-muted">
                <Link href={linkHref} className="w-full h-full block">
                    {/* Use direct img tag if issues with external next/image domains, or configure domains */}
                    <img
                        src={thumbnailUrl}
                        alt={template.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            </div>
            <CardHeader className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <Link href={linkHref} className="block w-full">
                        <CardTitle className="text-lg font-bold line-clamp-1 hover:text-primary transition-colors pr-2" title={template.title}>
                            {template.title}
                        </CardTitle>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(template.tags) && template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0.5 font-medium bg-secondary/50">
                            {tag}
                        </Badge>
                    ))}
                    {Array.isArray(template.tags) && template.tags.length > 3 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">+{template.tags.length - 3}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {template.description || "No description available."}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 mt-auto">
                {isLoggedIn && onUse && (
                    <Button onClick={() => onUse(template)} className="flex-1 w-auto min-w-[100px]" variant="default" size="sm">
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        Use
                    </Button>
                )}

                {isSuperAdmin && (
                    <div className="flex gap-2 ml-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit?.(template)}
                            className="h-9 w-9"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete?.(template.id)}
                            className="h-9 w-9"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

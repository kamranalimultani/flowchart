import React from "react";
import { FlowTemplate } from "@/types/flow-template";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Play } from "lucide-react";
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

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-48 overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                {/* Use direct img tag if issues with external next/image domains, or configure domains */}
                <img
                    src={thumbnailUrl}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl font-bold line-clamp-1" title={template.title}>
                        {template.title}
                    </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {Array.isArray(template.tags) && template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.description || "No description available."}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
                {isLoggedIn && onUse && (
                    <Button onClick={() => onUse(template)} className="w-full flex-1" variant="default">
                        <Play className="w-4 h-4 mr-2" />
                        Use Template
                    </Button>
                )}

                {isSuperAdmin && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit?.(template)}
                            className="h-10 w-10"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete?.(template.id)}
                            className="h-10 w-10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

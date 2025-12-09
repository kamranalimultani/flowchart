"use client";

import { useState } from "react";
import { Blog } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MarkdownEditor } from "./MarkdownEditor";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface BlogFormProps {
    initialData?: Partial<Blog>;
    onSubmit: (data: Partial<Blog>) => Promise<void>;
    loading?: boolean;
}

export function BlogForm({ initialData, onSubmit, loading }: BlogFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [image, setImage] = useState(initialData?.image || "");
    const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            title,
            content,
            excerpt,
            image,
            is_published: isPublished
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor value={content} onChange={setContent} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt / Summary</Label>
                    <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Short summary for preview cards"
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Banner Image URL</Label>
                    <Input
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                    />
                    {image && (
                        <div className="mt-2 h-32 w-full overflow-hidden rounded-md border">
                            <img src={image} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Blog" : "Create Blog"}
                </Button>
            </div>
        </form>
    );
}

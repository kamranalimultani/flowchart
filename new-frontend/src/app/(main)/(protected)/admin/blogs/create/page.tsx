"use client";

import { useState } from "react";
import { createBlog } from "@/services/blogService";
import { BlogForm } from "@/components/blog/BlogForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            await createBlog(data);
            toast.success("Blog created successfully!");
            router.push("/admin/blogs");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:bg-transparent p-0 hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <BlogForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}

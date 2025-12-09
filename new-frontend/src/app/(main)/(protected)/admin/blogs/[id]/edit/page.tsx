"use client";

import { useEffect, useState, use } from "react";
import { getAdminBlog, updateBlog } from "@/services/blogService";
import { BlogForm } from "@/components/blog/BlogForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blog } from "@/types/blog";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getAdminBlog(Number(id));
                setBlog(data);
            } catch (error: any) {
                console.error(error);
                toast.error("Failed to fetch blog");
                router.push("/admin/blogs");
            } finally {
                setFetching(false);
            }
        };

        fetchBlog();
    }, [id, router]);

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            await updateBlog(Number(id), data);
            toast.success("Blog updated successfully!");
            router.push("/admin/blogs");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Failed to update blog");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
    }

    if (!blog) return null;

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 pl-0 hover:bg-transparent p-0 hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <BlogForm initialData={blog} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}

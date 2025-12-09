"use client";

import { useEffect, useState } from "react";
import { getBlog } from "@/services/blogService";
import { BlogDetailResponse } from "@/types/blog";
import { Loader2, CalendarIcon, UserIcon, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [data, setData] = useState<BlogDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await getBlog(Array.isArray(slug) ? slug[0] : slug);
                setData(response);
            } catch (err) {
                console.error("Failed to fetch blog", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return <div className="flex justify-center py-40"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
                <Button onClick={() => router.push("/blogs")}>Back to Blogs</Button>
            </div>
        );
    }

    const { blog, related } = data;

    return (
        <article className="container mx-auto py-10 px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => router.push("/blogs")} className="mb-6 pl-0 hover:bg-transparent hover:text-primary p-0">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blogs
            </Button>

            {blog.image && (
                <div className="w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl mb-8 shadow-lg">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-6 border-b pb-6">
                <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {new Date(blog.created_at).toLocaleDateString()}
                </span>
                {blog.author && (
                    <span className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {blog.author.name}
                    </span>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight leading-tight">{blog.title}</h1>

            <div className="prose dark:prose-invert prose-lg max-w-none mb-16">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {blog.content}
                </ReactMarkdown>
            </div>

            {related && related.length > 0 && (
                <div className="border-t pt-16">
                    <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {related.map((relBlog) => (
                            <BlogCard key={relBlog.id} blog={relBlog} />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}

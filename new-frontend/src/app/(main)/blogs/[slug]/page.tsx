import { getBlog } from "@/services/blogService";
import { BlogDetailResponse } from "@/types/blog";
import { CalendarIcon, UserIcon, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    let data: BlogDetailResponse | null = null;

    try {
        data = await getBlog(slug);
    } catch (error) {
        console.error("Failed to fetch blog data", error);
    }

    if (!data) {
        notFound();
    }

    const { blog, related } = data;

    return (
        <article className="container mx-auto py-10 px-4 max-w-4xl">
            <Link href="/blogs">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary p-0">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blogs
                </Button>
            </Link>

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

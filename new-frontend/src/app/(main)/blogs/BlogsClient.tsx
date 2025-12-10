"use client";

import { useEffect, useState, Suspense } from "react";
import { getBlogs } from "@/services/blogService";
import { Blog, PaginatedResponse } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Plus } from "lucide-react";

function BlogsContent() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginatedResponse<Blog> | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.user);

    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(search);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await getBlogs(page, search);
                setBlogs(response.data);
                setPagination(response);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/blogs?page=1&search=${encodeURIComponent(searchTerm)}`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/blogs?page=${newPage}&search=${encodeURIComponent(search)}`);
    };

    return (
        <section className="container mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Blogs & News            </h1>

            {user && (user.role?.toLowerCase() === "superadmin" || user.role === "admin") && (
                <div className="flex justify-end mb-6">
                    <Button onClick={() => router.push("/admin/blogs/create")}>
                        <Plus className="mr-2 h-4 w-4" /> Add Blog
                    </Button>
                </div>
            )}

            <div className="flex justify-center mb-10">
                <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    {blogs.length === 0 && (
                        <p className="text-center text-muted-foreground py-20">No blogs found.</p>
                    )}

                    {pagination && pagination.last_page > 1 && (
                        <div className="flex justify-center mt-12 space-x-2">
                            <Button
                                variant="outline"
                                disabled={pagination.current_page === 1}
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm font-medium">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <Button
                                variant="outline"
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default function BlogsClientPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin" /></div>}>
            <BlogsContent />
        </Suspense>
    );
}

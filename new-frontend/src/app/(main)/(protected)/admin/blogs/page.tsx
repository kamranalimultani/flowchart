"use client";

import { useEffect, useState } from "react";
import { getAdminBlogs, deleteBlog } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await getAdminBlogs();
            setBlogs(response.data);
        } catch (error: any) {
            console.error("Failed to fetch blogs", error);
            if (error?.statusCode === 403) {
                toast.error("You are not authorized to view this page.");
                router.push("/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            try {
                await deleteBlog(id);
                toast.success("Blog deleted successfully");
                setBlogs(blogs.filter(b => b.id !== id));
            } catch (error) {
                toast.error("Failed to delete blog");
            }
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Blogs</h1>
                    <p className="text-muted-foreground">Create, edit, and manage blog posts.</p>
                </div>
                <Button onClick={() => router.push("/admin/blogs/create")}>
                    <Plus className="w-4 h-4 mr-2" /> Create New Blog
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : (
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No blogs found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell>{blog.author?.name || "Unknown"}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.is_published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                                                {blog.is_published ? "Published" : "Draft"}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDelete(blog.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

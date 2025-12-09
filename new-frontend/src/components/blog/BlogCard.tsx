import Link from "next/link";
import { Blog } from "@/types/blog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon } from "lucide-react";

interface BlogCardProps {
    blog: Blog;
    isAdmin?: boolean;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

export function BlogCard({ blog, isAdmin, onDelete, onEdit }: BlogCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
            {blog.image && (
                <div className="w-full h-48 overflow-hidden relative">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-4">
                    <span className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    {blog.author && (
                        <span className="flex items-center">
                            <UserIcon className="w-3 h-3 mr-1" />
                            {blog.author.name}
                        </span>
                    )}
                </div>
                <CardTitle className="line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`} className="hover:underline">
                        {blog.title}
                    </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 150) + "..."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">

            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Link href={`/blogs/${blog.slug}`}>
                    <Button variant="outline" size="sm">Read More</Button>
                </Link>

                {isAdmin && (
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit && onEdit(blog.id);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete && onDelete(blog.id);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Blog = {
    slug: string;
    updated_at: string;
};

async function getBlogs(): Promise<Blog[]> {
    try {
        // Build constraint: Use localhost directly if env is missing during build
        const url = `${API_URL}/api/blogs`;
        console.log(`Sitemap Fetching: ${url}`);

        const res = await fetch(url, {
            next: { revalidate: 60 },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Sitemap Fetch Failed: ${res.status} ${res.statusText}`);
            return [];
        }
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
    } catch (error) {
        console.error("Sitemap: Failed to fetch blogs. Ensure Backend is running.", error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getBlogs();

    const blogRoutes = blogs.map((blog) => ({
        url: `${BASE_URL}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/login',
        '/signup',
        '/policies',
        '/documentation',
        '/payment-success',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes, ...blogRoutes];
}

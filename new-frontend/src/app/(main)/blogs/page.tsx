import { Metadata } from 'next';
import BlogsClientPage from './BlogsClient';

export const metadata: Metadata = {
    title: 'Blogs & News - Flow Survey',
    description: 'Stay updated with the latest news, guides, and insights from Flow Survey.',
    openGraph: {
        title: 'Blogs & News - Flow Survey',
        description: 'Stay updated with the latest news, guides, and insights from Flow Survey.',
    },
};

export default function BlogsPage() {
    return <BlogsClientPage />;
}

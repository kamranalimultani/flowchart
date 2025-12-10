import { Metadata } from 'next';
import BlogsClientPage from './BlogsClient';

export const metadata: Metadata = {
    title: 'Blogs & News - Melvok',
    description: 'Stay updated with the latest news, guides, and insights from Melvok.',
    openGraph: {
        title: 'Blogs & News - Melvok',
        description: 'Stay updated with the latest news, guides, and insights from Melvok.',
    },
};

export default function BlogsPage() {
    return <BlogsClientPage />;
}

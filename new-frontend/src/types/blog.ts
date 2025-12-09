export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    user_id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    author?: {
        id: number;
        name: string;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    next_page_url?: string;
    prev_page_url?: string;
}

export interface BlogDetailResponse {
    blog: Blog;
    related: Blog[];
}

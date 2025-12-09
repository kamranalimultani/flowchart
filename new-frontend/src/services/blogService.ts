import { getRequest, postRequest, putRequest, deleteRequest } from "@/utils/apiUtils";
import { Blog, BlogDetailResponse, PaginatedResponse } from "@/types/blog";

export const getBlogs = async (page = 1, search = ""): Promise<PaginatedResponse<Blog>> => {
    let url = `/api/blogs?page=${page}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return getRequest<PaginatedResponse<Blog>>(url);
};

export const getBlog = async (slug: string): Promise<BlogDetailResponse> => {
    return getRequest<BlogDetailResponse>(`/api/blogs/${slug}`);
};

export const deleteBlog = async (id: number): Promise<void> => {
    return deleteRequest(`/api/blogs/${id}`, true);
};

export const createBlog = async (data: Partial<Blog>): Promise<Blog> => {
    return postRequest<Blog>("/api/blogs", data, true);
};

export const updateBlog = async (id: number, data: Partial<Blog>): Promise<Blog> => {
    return putRequest<Blog>(`/api/blogs/${id}`, data, true);
};

export const getAdminBlogs = async (page = 1, search = ""): Promise<PaginatedResponse<Blog>> => {
    let url = `/api/admin/blogs?page=${page}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return getRequest<PaginatedResponse<Blog>>(url, true);
};

export const getAdminBlog = async (id: number): Promise<Blog> => {
    return getRequest<Blog>(`/api/admin/blogs/${id}`, true);
};

import {
    getRequest,
    postRequest,
    deleteRequest,
} from "@/utils/apiUtils";
import { FlowTemplate } from "@/types/flow-template";

export const getFlowTemplates = async (
    page: number = 1,
    search: string = ""
): Promise<{ data: FlowTemplate[]; current_page: number; last_page: number; total: number }> => {
    const params = new URLSearchParams({
        page: page.toString(),
        search,
    });
    const response = await getRequest<{ success: boolean; data: { data: FlowTemplate[]; current_page: number; last_page: number; total: number } }>(
        `/api/flow-templates?${params.toString()}`
    );
    return response.data;
};

export const createFlowTemplate = async (formData: FormData): Promise<FlowTemplate> => {
    // Note: Use raw axios or apiUtils must handle FormData content-type automatically if data is FormData
    // Assuming postRequest handles it or we use custom call.
    // Given apiUtils implementation, axios handles FormData automatically if passed directly.
    const response = await postRequest<{ success: boolean; data: FlowTemplate }>(
        "/api/flow-templates",
        formData,
        true // useAuth
    );
    return response.data;
};

export const updateFlowTemplate = async (
    id: number,
    formData: FormData
): Promise<FlowTemplate> => {
    const response = await postRequest<{ success: boolean; data: FlowTemplate }>(
        `/api/flow-templates/${id}`,
        formData,
        true
    );
    return response.data;
};

export const deleteFlowTemplate = async (id: number): Promise<void> => {
    await deleteRequest(`/api/flow-templates/${id}`, true);
};

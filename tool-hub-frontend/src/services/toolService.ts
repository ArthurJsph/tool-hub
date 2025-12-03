import { Tool } from "@/types/tool";
import apiService from "./api";

export const toolService = {
    // Admin endpoints
    getAllTools: async (): Promise<Tool[]> => {
        return apiService.get<Tool[]>('/admin/tools');
    },

    createTool: async (tool: Omit<Tool, "id" | "createdAt" | "updatedAt">): Promise<Tool> => {
        return apiService.post<Tool>('/admin/tools', tool);
    },

    updateToolStatus: async (id: number, status: boolean): Promise<Tool> => {
        return apiService.put<Tool>(`/admin/tools/${id}/status`, { status });
    },

    deleteTool: async (id: number): Promise<void> => {
        return apiService.delete<void>(`/admin/tools/${id}`);
    },

    // Public endpoints
    getActiveTools: async (): Promise<Tool[]> => {
        return apiService.get<Tool[]>('/public/tools/active');
    },
};

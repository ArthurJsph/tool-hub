import apiService from './api'
import { ToolDTO, CreateToolRequest, UpdateToolRequest, ToolsPageResponse } from '@/types/tools'

const TOOLS_ADMIN_ENDPOINT = '/tools'

class ToolsAdminService {
  // Get all tools (paginated)
  async getTools(page: number = 0, size: number = 20): Promise<ToolsPageResponse> {
    const response = await apiService.get<ToolsPageResponse>(
      `${TOOLS_ADMIN_ENDPOINT}?page=${page}&size=${size}`
    )
    return response
  }

  // Get a single tool by ID
  async getToolById(id: string): Promise<ToolDTO> {
    const response = await apiService.get<ToolDTO>(`${TOOLS_ADMIN_ENDPOINT}/${id}`)
    return response
  }

  // Create a new tool
  async createTool(tool: CreateToolRequest): Promise<ToolDTO> {
    const response = await apiService.post<ToolDTO>(TOOLS_ADMIN_ENDPOINT, tool)
    return response
  }

  // Update an existing tool
  async updateTool(id: string, tool: UpdateToolRequest): Promise<ToolDTO> {
    const response = await apiService.put<ToolDTO>(`${TOOLS_ADMIN_ENDPOINT}/${id}`, tool)
    return response
  }

  // Delete a tool
  async deleteTool(id: string): Promise<void> {
    await apiService.delete(`${TOOLS_ADMIN_ENDPOINT}/${id}`)
  }

  // Toggle tool enabled status
  async toggleToolStatus(id: string, enabled: boolean): Promise<ToolDTO> {
    const response = await apiService.patch<ToolDTO>(`${TOOLS_ADMIN_ENDPOINT}/${id}/status`, { enabled })
    return response
  }

  // Reorder tools
  async reorderTools(toolIds: string[]): Promise<void> {
    await apiService.post(`${TOOLS_ADMIN_ENDPOINT}/reorder`, { toolIds })
  }
}

const toolsAdminServiceInstance = new ToolsAdminService()
export { toolsAdminServiceInstance as toolsAdminService }
export default toolsAdminServiceInstance

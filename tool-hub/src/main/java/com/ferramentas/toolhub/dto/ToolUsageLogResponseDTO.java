package com.ferramentas.toolhub.dto;

public record ToolUsageLogResponseDTO(
    String toolId,
    String userId,
    String usageTime,
    String usageDetails,
    String createdAt,
    String updatedAt
) {
}

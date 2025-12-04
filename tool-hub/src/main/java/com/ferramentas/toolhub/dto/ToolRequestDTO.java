package com.ferramentas.toolhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ToolRequestDTO(
        @NotBlank(message = "Name is required") String name,

        @NotBlank(message = "Description is required") String description,

        @NotBlank(message = "Path is required") String path,

        @NotBlank(message = "Icon is required") String icon,

        @NotNull(message = "Status is required") Boolean enabled,

        List<String> keywords,

        Integer order) {
}

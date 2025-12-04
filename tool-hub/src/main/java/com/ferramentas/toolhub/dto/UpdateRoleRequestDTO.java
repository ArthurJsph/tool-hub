package com.ferramentas.toolhub.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequestDTO(
        @NotBlank(message = "Role is required") String role) {
}

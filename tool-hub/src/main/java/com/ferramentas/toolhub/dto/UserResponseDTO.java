package com.ferramentas.toolhub.dto;

public record UserResponseDTO(
    String username,
    String email,
    String role,
    String createdAt,
    String updatedAt

) {
}

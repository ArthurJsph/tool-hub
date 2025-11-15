package com.ferramentas.toolhub.dto;

public record UpdateUserRequestDTO(
    String username,
    String email,
    String role,
    String passwordHash
) {
}


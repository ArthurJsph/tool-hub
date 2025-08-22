package com.ferramentas.toolhub.dto;

public record UserRequestDTO(
    String username,
    String email,
    String passwordHash
) {
}

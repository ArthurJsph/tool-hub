package com.ferramentas.toolhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequestDTO(
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") String username,

        @Email(message = "Invalid email format") String email,

        String role,

        @Size(min = 6, message = "Password must be at least 6 characters") String passwordHash) {
}

package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.UpdateRoleRequestDTO;
import com.ferramentas.toolhub.dto.UpdateUserRequestDTO;
import com.ferramentas.toolhub.dto.UserRequestDTO;
import com.ferramentas.toolhub.dto.UserResponseDTO;
import com.ferramentas.toolhub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final com.ferramentas.toolhub.service.ToolUsageLogService toolUsageLogService;

    public UserController(UserService userService,
            com.ferramentas.toolhub.service.ToolUsageLogService toolUsageLogService) {
        this.userService = userService;
        this.toolUsageLogService = toolUsageLogService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getProfile() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsernameAsDTO(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UpdateUserRequestDTO updateRequest) {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        // Ensure role is not updated via profile
        UpdateUserRequestDTO safeUpdate = new UpdateUserRequestDTO(
                updateRequest.username(),
                updateRequest.email(),
                updateRequest.passwordHash(),
                null // Force role to null
        );
        return userService.updateProfile(username, safeUpdate)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAllAsDTO();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        Optional<UserResponseDTO> user = userService.findByIdAsDTO(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO userRequestDTO) {
        Optional<com.ferramentas.toolhub.model.User> existingUser = userService
                .findByUsername(userRequestDTO.username());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        UserResponseDTO newUser = userService.saveFromDTO(userRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable UUID id,
            @RequestBody UserRequestDTO userRequestDTO) {
        Optional<UserResponseDTO> updatedUser = userService.updateFromDTO(id, userRequestDTO);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Atualiza apenas a role de um usuário
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponseDTO> updateUserRole(
            @PathVariable UUID id,
            @RequestBody UpdateRoleRequestDTO roleRequest) {
        Optional<UserResponseDTO> updatedUser = userService.updateRole(id, roleRequest);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Atualiza informações do usuário (permite atualização parcial)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> patchUser(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequestDTO updateRequest) {
        Optional<UserResponseDTO> updatedUser = userService.updateUser(id, updateRequest);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Lista usuários por role
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@PathVariable String role) {
        List<UserResponseDTO> users = userService.findByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Verifica se um usuário tem uma determinada role
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/has-role/{role}")
    public ResponseEntity<Boolean> checkUserRole(
            @PathVariable UUID id,
            @PathVariable String role) {
        boolean hasRole = userService.hasRole(id, role);
        return ResponseEntity.ok(hasRole);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        long count = userService.countActiveUsers();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/me/usage/today")
    public ResponseEntity<Long> getUsageToday() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        // Assuming CustomUserDetails is used and has the ID
        if (authentication.getPrincipal() instanceof com.ferramentas.toolhub.security.CustomUserDetails) {
            UUID userId = ((com.ferramentas.toolhub.security.CustomUserDetails) authentication.getPrincipal()).getId();
            long count = toolUsageLogService.countUsageToday(userId);
            return ResponseEntity.ok(count);
        }

        // Fallback if principal is not CustomUserDetails (should not happen with JWT)
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

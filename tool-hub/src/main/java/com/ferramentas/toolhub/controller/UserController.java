package com.ferramentas.toolhub.controller;
import com.ferramentas.toolhub.dto.UpdateRoleRequestDTO;
import com.ferramentas.toolhub.dto.UpdateUserRequestDTO;
import com.ferramentas.toolhub.dto.UserRequestDTO;
import com.ferramentas.toolhub.dto.UserResponseDTO;
import com.ferramentas.toolhub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAllAsDTO();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        Optional<UserResponseDTO> user = userService.findByIdAsDTO(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO userRequestDTO) {
        Optional<com.ferramentas.toolhub.model.User> existingUser = userService.findByUsername(userRequestDTO.username());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        UserResponseDTO newUser = userService.saveFromDTO(userRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable UUID id, @RequestBody UserRequestDTO userRequestDTO) {
        Optional<UserResponseDTO> updatedUser = userService.updateFromDTO(id, userRequestDTO);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Atualiza apenas a role de um usuário
     */
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
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@PathVariable String role) {
        List<UserResponseDTO> users = userService.findByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Verifica se um usuário tem uma determinada role
     */
    @GetMapping("/{id}/has-role/{role}")
    public ResponseEntity<Boolean> checkUserRole(
            @PathVariable UUID id,
            @PathVariable String role) {
        boolean hasRole = userService.hasRole(id, role);
        return ResponseEntity.ok(hasRole);
    }
}

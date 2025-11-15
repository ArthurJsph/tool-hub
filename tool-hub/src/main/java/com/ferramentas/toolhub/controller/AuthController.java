package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.LoginRequestDTO;
import com.ferramentas.toolhub.dto.UserResponseDTO;
import com.ferramentas.toolhub.model.User;
import com.ferramentas.toolhub.security.AuthService;
import com.ferramentas.toolhub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            String credential = loginRequest.username();
            String password = loginRequest.password();

            Optional<User> userOptional = userService.findByUsernameOrEmail(credential);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            User user = userOptional.get();

            String token = authService.loginUser(user.getUsername(), password);

            UserResponseDTO userResponse = new UserResponseDTO(
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt().toString(),
                user.getCreatedAt().toString()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

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
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDTO loginRequest,
            jakarta.servlet.http.HttpServletResponse response) {
        try {
            String credential = loginRequest.username();
            String password = loginRequest.password();

            Optional<User> userOptional = userService.findByUsernameOrEmail(credential);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            User user = userOptional.get();

            String token = authService.loginUser(user.getUsername(), password);

            // Create HttpOnly cookie
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Set to true in production (requires HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            response.addCookie(cookie);

            UserResponseDTO userResponse = new UserResponseDTO(
                    user.getId().toString(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt().toString(),
                    user.getCreatedAt().toString());

            Map<String, Object> responseBody = new HashMap<>();
            // token is no longer needed in body for web apps, but keeping it for
            // compatibility if needed
            // responseBody.put("token", token);
            responseBody.put("user", userResponse);

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(jakarta.servlet.http.HttpServletResponse response) {
        // Clear cookie regardless of authentication state
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Delete cookie
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @RequestBody com.ferramentas.toolhub.dto.UserRequestDTO userRequest) {
        try {
            UserResponseDTO newUser = userService.saveFromDTO(userRequest);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> request) {
        // Mock implementation for forgot password
        // In a real app, this would send an email
        String email = request.get("email");
        System.out.println("Forgot password requested for: " + email);
        return ResponseEntity.ok().build();
    }
}

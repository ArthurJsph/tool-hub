package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.LoginRequestDTO;
import com.ferramentas.toolhub.dto.UserResponseDTO;
import com.ferramentas.toolhub.model.User;
import com.ferramentas.toolhub.security.AuthService;
import com.ferramentas.toolhub.service.UserService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final com.ferramentas.toolhub.service.RefreshTokenService refreshTokenService;
    private final com.ferramentas.toolhub.security.JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService,
            com.ferramentas.toolhub.service.RefreshTokenService refreshTokenService,
            com.ferramentas.toolhub.security.JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtTokenProvider = jwtTokenProvider;
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

            // Create Access Token Cookie
            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false) // Set to true in production
                    .path("/")
                    .maxAge(900) // 15 minutes
                    .sameSite("Strict")
                    .build();

            // Create Refresh Token
            com.ferramentas.toolhub.model.RefreshToken refreshToken = refreshTokenService
                    .createRefreshToken(user.getId());

            // Create Refresh Token Cookie
            ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken.getToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/api/v1/auth/refresh")
                    .maxAge(604800) // 7 days
                    .sameSite("Strict")
                    .build();

            UserResponseDTO userResponse = new UserResponseDTO(
                    user.getId().toString(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt().toString(),
                    user.getCreatedAt().toString());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("user", userResponse);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("Refresh Token is missing");
        }

        return refreshTokenService.findByToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(com.ferramentas.toolhub.model.RefreshToken::getUser)
                .map(user -> {
                    // Generate new Access Token
                    // We need to convert User entity to UserDetails or CustomUserDetails
                    // Assuming CustomUserDetails constructor takes User entity or similar
                    com.ferramentas.toolhub.security.CustomUserDetails userDetails = new com.ferramentas.toolhub.security.CustomUserDetails(
                            user);
                    String token = jwtTokenProvider.generateToken(userDetails);

                    // Create Access Token Cookie
                    ResponseCookie cookie = ResponseCookie.from("token", token)
                            .httpOnly(true)
                            .secure(false)
                            .path("/")
                            .maxAge(900)
                            .sameSite("Strict")
                            .build();

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, cookie.toString())
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    // Re-implementing refresh properly below by injecting JwtTokenProvider

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/api/v1/auth/refresh")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @jakarta.validation.Valid @RequestBody com.ferramentas.toolhub.dto.UserRequestDTO userRequest) {
        System.out.println("Register request: " + userRequest); // Log request
        try {
            UserResponseDTO newUser = userService.saveFromDTO(userRequest);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            System.err.println("Error registering user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Forgot password requested for: " + email);
        return ResponseEntity.ok().build();
    }
}

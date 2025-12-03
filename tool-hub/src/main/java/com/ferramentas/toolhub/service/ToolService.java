package com.ferramentas.toolhub.service;

import com.ferramentas.toolhub.model.Tool;
import com.ferramentas.toolhub.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ToolService {

    @Autowired
    private ToolRepository toolRepository;

    public List<Tool> findAll() {
        return toolRepository.findAll();
    }

    public Optional<Tool> findById(Long id) {
        return toolRepository.findById(id);
    }

    public Tool save(Tool tool) {
        return toolRepository.save(tool);
    }

    public void deleteById(Long id) {
        toolRepository.deleteById(id);
    }

    public Tool updateStatus(Long id, boolean isActive) {
        Tool tool = toolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tool not found with id: " + id));
        tool.setActive(isActive);
        return toolRepository.save(tool);
    }

    public List<Tool> getActiveTools() {
        return toolRepository.findByActiveTrue();
    }

    // Tool Logic Methods

    public String generateStrongPassword(int length, boolean includeSymbols) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (includeSymbols) {
            chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        }
        StringBuilder sb = new StringBuilder();
        java.security.SecureRandom random = new java.security.SecureRandom();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public boolean validateJwt(String token, String algorithm) {
        // Basic structure check for now. In a real app, we would verify signature.
        if (token == null || token.split("\\.").length != 3) {
            return false;
        }
        return true;
    }

    public String generateUUID() {
        return java.util.UUID.randomUUID().toString();
    }

    public String encodeBase64(String input) {
        return java.util.Base64.getEncoder().encodeToString(input.getBytes());
    }

    public String decodeBase64(String input) {
        try {
            return new String(java.util.Base64.getDecoder().decode(input));
        } catch (IllegalArgumentException e) {
            return "Invalid Base64 input";
        }
    }

    public String generateHash(String input, String algorithm) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance(algorithm);
            byte[] encodedhash = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (int i = 0; i < encodedhash.length; i++) {
                String hex = Integer.toHexString(0xff & encodedhash[i]);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            return "Algorithm not supported";
        }
    }
}

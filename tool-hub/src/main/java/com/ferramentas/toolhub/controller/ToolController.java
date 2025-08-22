package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.service.ToolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tools")
public class ToolController {

    private final ToolService toolService;

    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    @GetMapping("/password")
    public ResponseEntity<String> generatePassword(
            @RequestParam(defaultValue = "16") int length,
            @RequestParam(defaultValue = "true") boolean includeSymbols) {
        String password = toolService.generateStrongPassword(length, includeSymbols);
        return ResponseEntity.ok(password);
    }

    @GetMapping("/jwt/validate")
    public ResponseEntity<String> validateJwt(
            @RequestParam String token,
            @RequestParam(defaultValue = "HS256") String algorithm) {
        boolean isValid = toolService.validateJwt(token, algorithm);
        if (isValid) {
            return ResponseEntity.ok("Token é válido!");
        } else {
            return ResponseEntity.ok("Token é inválido!");
        }
    }

    @GetMapping("/uuid")
    public ResponseEntity<String> generateUUID() {
        String uuid = toolService.generateUUID();
        return ResponseEntity.ok(uuid);
    }

    @PostMapping("/base64/encode")
    public ResponseEntity<String> encodeBase64(@RequestParam String input) {
        String encoded = toolService.encodeBase64(input);
        return ResponseEntity.ok(encoded);
    }

    @PostMapping("/base64/decode")
    public ResponseEntity<String> decodeBase64(@RequestParam String input) {
        String decoded = toolService.decodeBase64(input);
        return ResponseEntity.ok(decoded);
    }

    @PostMapping("/hash")
    public ResponseEntity<String> generateHash(
            @RequestParam String input,
            @RequestParam(defaultValue = "SHA256") String algorithm) {
        String hash = toolService.generateHash(input, algorithm);
        return ResponseEntity.ok(hash);
    }
}

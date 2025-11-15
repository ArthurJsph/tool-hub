package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.FakerRequest;
import com.ferramentas.toolhub.service.FakerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tools/faker")
public class FakerController {

    private final FakerService fakerService;

    @Autowired
    public FakerController(FakerService fakerService) {
        this.fakerService = fakerService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateFakeData(@RequestBody FakerRequest request) {
        try {
            Map<String, Object> result = fakerService.generateFakeData(
                request.getType(),
                request.getCount(),
                request.getLocale()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getAvailableTypes() {
        return ResponseEntity.ok(fakerService.getAvailableTypes());
    }
}


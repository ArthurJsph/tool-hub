package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.RegexRequest;
import com.ferramentas.toolhub.service.RegexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tools/regex")
public class RegexController {

    private final RegexService regexService;

    @Autowired
    public RegexController(RegexService regexService) {
        this.regexService = regexService;
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testRegex(@RequestBody RegexRequest request) {
        try {
            Map<String, Object> result = regexService.testRegex(request.getPattern(), request.getText());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/replace")
    public ResponseEntity<Map<String, Object>> replaceWithRegex(@RequestBody RegexRequest request) {
        try {
            Map<String, Object> result = regexService.replaceWithRegex(
                request.getPattern(),
                request.getText(),
                request.getReplacement()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/patterns")
    public ResponseEntity<Map<String, Object>> getPatterns() {
        return ResponseEntity.ok(regexService.generateRegexPatterns());
    }

    @PostMapping("/identify")
    public ResponseEntity<Map<String, Object>> identifyPattern(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            Map<String, Object> result = regexService.identifyPattern(text);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.JsonJwtParseRequest;
import com.ferramentas.toolhub.service.JsonJwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tools/json-jwt")
public class JsonJwtController {

    private final JsonJwtService jsonJwtService;

    @Autowired
    public JsonJwtController(JsonJwtService jsonJwtService) {
        this.jsonJwtService = jsonJwtService;
    }

    @PostMapping("/parse-jwt")
    public ResponseEntity<Map<String, Object>> parseJwt(@RequestBody JsonJwtParseRequest request) {
        try {
            Map<String, Object> decodedJwt = jsonJwtService.parseJwt(request.getData());
            return ResponseEntity.ok(decodedJwt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/parse-json")
    public ResponseEntity<Object> parseJson(@RequestBody JsonJwtParseRequest request) {
        try {
            Object parsedJson = jsonJwtService.parseJson(request.getData());
            return ResponseEntity.ok(parsedJson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/format-json")
    public ResponseEntity<Map<String, Object>> formatJson(@RequestBody Map<String, Object> request) {
        try {
            String json = (String) request.get("data");
            Boolean prettify = (Boolean) request.getOrDefault("prettify", true);
            Map<String, Object> result = jsonJwtService.formatJson(json, prettify);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.UrlParseRequest;
import com.ferramentas.toolhub.service.UrlParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tools/url-parser")
public class UrlParserController {

    private final UrlParserService urlParserService;

    @Autowired
    public UrlParserController(UrlParserService urlParserService) {
        this.urlParserService = urlParserService;
    }

    @PostMapping("/parse")
    public ResponseEntity<Map<String, Object>> parseUrl(@RequestBody UrlParseRequest request) {
        try {
            Map<String, Object> result = urlParserService.parseUrl(request.getUrl());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/build")
    public ResponseEntity<Map<String, Object>> buildUrl(@RequestBody Map<String, Object> components) {
        try {
            Map<String, Object> result = urlParserService.buildUrl(components);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


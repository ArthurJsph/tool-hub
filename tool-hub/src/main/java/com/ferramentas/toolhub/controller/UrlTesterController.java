package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.UrlTestRequest;
import com.ferramentas.toolhub.service.UrlTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tools/url-tester")
public class UrlTesterController {

    private final UrlTestService urlTestService;

    @Autowired
    public UrlTesterController(UrlTestService urlTestService) {
        this.urlTestService = urlTestService;
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testUrl(@RequestBody UrlTestRequest request) {
        try {
            Map<String, Object> result = urlTestService.testUrl(
                    request.getUrl(),
                    request.getMethod(),
                    request.getHeaders(),
                    request.getParameters(),
                    request.getBody(),
                    request.getCheckSecurity());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/methods")
    public ResponseEntity<Map<String, Object>> getHttpMethods() {
        return ResponseEntity.ok(urlTestService.getHttpMethods());
    }
}

package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.dto.SecurityCheckResponse;
import com.ferramentas.toolhub.service.SecurityCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tools/url-tester")
@CrossOrigin(origins = "*")
public class SecurityCheckController {

    @Autowired
    private SecurityCheckService securityCheckService;

    @PostMapping("/security")
    public ResponseEntity<SecurityCheckResponse> checkSecurity(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        SecurityCheckResponse response = securityCheckService.checkUrl(url);
        return ResponseEntity.ok(response);
    }
}

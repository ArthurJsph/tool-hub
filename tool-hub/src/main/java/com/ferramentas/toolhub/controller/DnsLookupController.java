package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.service.DnsLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tools/dns")
public class DnsLookupController {

    private final DnsLookupService dnsLookupService;

    public DnsLookupController(DnsLookupService dnsLookupService) {
        this.dnsLookupService = dnsLookupService;
    }

    @GetMapping("/lookup")
    public ResponseEntity<Map<String, Object>> lookup(@RequestParam String domain) {
        return ResponseEntity.ok(dnsLookupService.lookup(domain));
    }
}

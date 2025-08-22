package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.service.ToolUsageLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/logs")
public class ToolUsageLogController {

    private final ToolUsageLogService toolUsageLogService;

    @Autowired
    public ToolUsageLogController(ToolUsageLogService toolUsageLogService) {
        this.toolUsageLogService = toolUsageLogService;
    }

    @PostMapping
    public ResponseEntity<Void> logToolUsage(
            @RequestParam UUID userId,
            @RequestParam String toolName,
            @RequestParam String ipAddress) {

        toolUsageLogService.saveLog(userId, toolName, ipAddress);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}

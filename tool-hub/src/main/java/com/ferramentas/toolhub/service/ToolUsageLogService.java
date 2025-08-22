package com.ferramentas.toolhub.service;

import com.ferramentas.toolhub.model.ToolUsageLog;
import com.ferramentas.toolhub.repository.ToolUsageLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ToolUsageLogService {

    private final ToolUsageLogRepository toolUsageLogRepository;

    @Autowired
    public ToolUsageLogService(ToolUsageLogRepository toolUsageLogRepository) {
        this.toolUsageLogRepository = toolUsageLogRepository;
    }

    public void saveLog(UUID userId, String toolName, String ipAddress) {
        ToolUsageLog log = new ToolUsageLog();
        log.setUserId(userId);
        log.setToolName(toolName);
        log.setIpAddress(ipAddress);
        log.setUsageTimestamp(LocalDateTime.now());
        toolUsageLogRepository.save(log);
    }
}

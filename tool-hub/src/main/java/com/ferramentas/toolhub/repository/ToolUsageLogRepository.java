package com.ferramentas.toolhub.repository;

import com.ferramentas.toolhub.model.ToolUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ToolUsageLogRepository extends JpaRepository<ToolUsageLog, UUID> {
    long countByUserIdAndUsageTimestampBetween(UUID userId, java.time.LocalDateTime start, java.time.LocalDateTime end);
}

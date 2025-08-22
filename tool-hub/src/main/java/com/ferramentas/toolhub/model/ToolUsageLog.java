package com.ferramentas.toolhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tool_usage_logs")
public class ToolUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "tool_name")
    private String toolName;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "usage_timestamp")
    private LocalDateTime usageTimestamp;
}

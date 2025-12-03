package com.ferramentas.toolhub.repository;

import com.ferramentas.toolhub.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {
    Optional<Tool> findByKey(String key);

    List<Tool> findByActiveTrue();
}

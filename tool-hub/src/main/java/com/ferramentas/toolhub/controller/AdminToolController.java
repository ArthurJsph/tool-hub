package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.model.Tool;
import com.ferramentas.toolhub.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/tools")
@PreAuthorize("hasRole('ADMIN')")
public class AdminToolController {

    @Autowired
    private ToolService toolService;

    @GetMapping
    public List<Tool> getAllTools() {
        return toolService.findAll();
    }

    @PostMapping
    public Tool createTool(@RequestBody Tool tool) {
        return toolService.save(tool);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tool> getToolById(@PathVariable Long id) {
        return toolService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Tool> updateToolStatus(@PathVariable Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        if (!statusUpdate.containsKey("status")) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Tool updatedTool = toolService.updateStatus(id, statusUpdate.get("status"));
            return ResponseEntity.ok(updatedTool);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        toolService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

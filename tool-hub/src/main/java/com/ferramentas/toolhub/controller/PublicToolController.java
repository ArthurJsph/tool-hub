package com.ferramentas.toolhub.controller;

import com.ferramentas.toolhub.model.Tool;
import com.ferramentas.toolhub.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/tools")
public class PublicToolController {

    @Autowired
    private ToolService toolService;

    @GetMapping("/active")
    public List<Tool> getActiveTools() {
        return toolService.getActiveTools();
    }
}

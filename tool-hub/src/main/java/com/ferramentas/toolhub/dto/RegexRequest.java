package com.ferramentas.toolhub.dto;

import lombok.Data;

@Data
public class RegexRequest {
    private String pattern;
    private String text;
    private String type; // "test", "match", "replace", "generate"
    private String replacement; // para tipo "replace"
}


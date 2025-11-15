package com.ferramentas.toolhub.dto;

import lombok.Data;
import java.util.Map;

@Data
public class UrlTestRequest {
    private String url;
    private String method; // GET, POST, PUT, DELETE, etc.
    private Map<String, String> headers;
    private Map<String, String> parameters;
    private String body;
    private Boolean checkSecurity; // verificar HTTPS, certificado, etc.
}


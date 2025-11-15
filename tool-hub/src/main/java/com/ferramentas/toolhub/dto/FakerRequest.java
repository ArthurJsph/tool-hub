package com.ferramentas.toolhub.dto;

import lombok.Data;

@Data
public class FakerRequest {
    private String type; // "name", "email", "address", "phone", "date"
    private Integer count; // número de itens a gerar
    private String locale; // ex: "pt-BR", "en-US"
}


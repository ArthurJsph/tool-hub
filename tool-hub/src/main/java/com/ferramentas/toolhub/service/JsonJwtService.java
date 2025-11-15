package com.ferramentas.toolhub.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class JsonJwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> parseJwt(String jwt) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Remove "Bearer " se presente
            jwt = jwt.replace("Bearer ", "").trim();

            // Divide o JWT em suas partes
            String[] parts = jwt.split("\\.");

            if (parts.length != 3) {
                throw new IllegalArgumentException("JWT inválido. Deve conter 3 partes separadas por '.'");
            }

            // Decodifica o Header
            String header = new String(Base64.getUrlDecoder().decode(parts[0]));
            result.put("header", objectMapper.readValue(header, Map.class));

            // Decodifica o Payload
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            result.put("payload", objectMapper.readValue(payload, Map.class));

            // A assinatura é mantida em Base64
            result.put("signature", parts[2]);

            // Adiciona o JWT original
            result.put("raw", jwt);

            // Tenta validar se possível (sem chave secreta, apenas estrutura)
            result.put("valid", true);
            result.put("message", "JWT decodificado com sucesso. Nota: Validação de assinatura requer chave secreta.");

        } catch (SignatureException e) {
            result.put("valid", false);
            result.put("error", "Assinatura inválida: " + e.getMessage());
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Erro ao decodificar JWT: " + e.getMessage());
        }

        return result;
    }

    public Object parseJson(String json) {
        try {
            // Tenta parsear como objeto
            return objectMapper.readValue(json, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("JSON inválido: " + e.getMessage());
        }
    }

    public Map<String, Object> formatJson(String json, boolean prettify) {
        Map<String, Object> result = new HashMap<>();
        try {
            Object parsed = objectMapper.readValue(json, Object.class);

            if (prettify) {
                result.put("formatted", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(parsed));
            } else {
                result.put("formatted", objectMapper.writeValueAsString(parsed));
            }

            result.put("parsed", parsed);
            result.put("valid", true);
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Erro ao formatar JSON: " + e.getMessage());
        }
        return result;
    }
}


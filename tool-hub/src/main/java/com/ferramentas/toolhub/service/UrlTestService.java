package com.ferramentas.toolhub.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.*;

@Service
public class UrlTestService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> testUrl(String urlString, String method, Map<String, String> headers,
                                       Map<String, String> parameters, String body, Boolean checkSecurity) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Adiciona parâmetros à URL se necessário
            String finalUrl = buildUrlWithParameters(urlString, parameters);

            // Configura os headers
            HttpHeaders httpHeaders = new HttpHeaders();
            if (headers != null) {
                headers.forEach(httpHeaders::set);
            }

            // Configura o corpo da requisição
            HttpEntity<String> entity = new HttpEntity<>(body, httpHeaders);

            // Define o método HTTP
            HttpMethod httpMethod = HttpMethod.valueOf(method != null ? method.toUpperCase() : "GET");

            // Inicia a medição de tempo
            long startTime = System.currentTimeMillis();

            // Executa a requisição
            ResponseEntity<String> response;
            try {
                response = restTemplate.exchange(finalUrl, httpMethod, entity, String.class);
                long endTime = System.currentTimeMillis();

                // Informações da resposta
                result.put("success", true);
                result.put("statusCode", response.getStatusCode().value());
                result.put("statusText", response.getStatusCode().toString());
                result.put("headers", response.getHeaders());
                result.put("body", response.getBody());
                result.put("responseTime", (endTime - startTime) + "ms");

            } catch (Exception e) {
                long endTime = System.currentTimeMillis();
                result.put("success", false);
                result.put("error", e.getMessage());
                result.put("responseTime", (endTime - startTime) + "ms");
            }

            // Verifica segurança se solicitado
            if (checkSecurity != null && checkSecurity) {
                result.put("security", checkUrlSecurity(urlString));
            }

            // Informações da requisição
            Map<String, Object> requestInfo = new HashMap<>();
            requestInfo.put("url", finalUrl);
            requestInfo.put("method", method);
            requestInfo.put("headers", headers);
            requestInfo.put("parameters", parameters);
            requestInfo.put("hasBody", body != null && !body.isEmpty());
            result.put("request", requestInfo);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Erro ao testar URL: " + e.getMessage());
        }

        return result;
    }

    private String buildUrlWithParameters(String urlString, Map<String, String> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return urlString;
        }

        StringBuilder url = new StringBuilder(urlString);

        if (!urlString.contains("?")) {
            url.append("?");
        } else if (!urlString.endsWith("&")) {
            url.append("&");
        }

        List<String> params = new ArrayList<>();
        parameters.forEach((key, value) -> params.add(key + "=" + value));
        url.append(String.join("&", params));

        return url.toString();
    }

    public Map<String, Object> checkUrlSecurity(String urlString) {
        Map<String, Object> security = new HashMap<>();

        try {
            URL url = new URL(urlString);

            // Verifica HTTPS
            boolean isHttps = "https".equalsIgnoreCase(url.getProtocol());
            security.put("isHttps", isHttps);
            security.put("protocol", url.getProtocol());

            if (isHttps) {
                try {
                    // Verifica certificado SSL
                    HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
                    conn.setRequestMethod("HEAD");
                    conn.connect();

                    Certificate[] certs = conn.getServerCertificates();

                    if (certs != null && certs.length > 0 && certs[0] instanceof X509Certificate) {
                        X509Certificate cert = (X509Certificate) certs[0];

                        Map<String, Object> certInfo = new HashMap<>();
                        certInfo.put("subject", cert.getSubjectX500Principal().getName());
                        certInfo.put("issuer", cert.getIssuerX500Principal().getName());
                        certInfo.put("validFrom", cert.getNotBefore());
                        certInfo.put("validTo", cert.getNotAfter());
                        certInfo.put("isValid", true); // Se chegou aqui, é válido

                        security.put("certificate", certInfo);
                        security.put("hasCertificate", true);
                    }

                    conn.disconnect();

                } catch (Exception e) {
                    security.put("certificateError", e.getMessage());
                    security.put("hasCertificate", false);
                }
            }

            // Verifica porta
            int port = url.getPort();
            if (port == -1) {
                port = url.getDefaultPort();
            }
            security.put("port", port);
            security.put("isStandardPort", port == 80 || port == 443);

            // Recomendações de segurança
            List<String> recommendations = new ArrayList<>();
            if (!isHttps) {
                recommendations.add("Considere usar HTTPS para comunicação segura");
            }
            if (url.getUserInfo() != null) {
                recommendations.add("Evite incluir credenciais na URL");
            }

            security.put("recommendations", recommendations);
            security.put("securityScore", calculateSecurityScore(isHttps, port, url.getUserInfo()));

        } catch (Exception e) {
            security.put("error", "Erro ao verificar segurança: " + e.getMessage());
        }

        return security;
    }

    private int calculateSecurityScore(boolean isHttps, int port, String userInfo) {
        int score = 0;

        if (isHttps) score += 50;
        if (port == 443 || port == 80) score += 20;
        if (userInfo == null) score += 30;

        return score;
    }

    public Map<String, Object> getHttpMethods() {
        Map<String, Object> result = new HashMap<>();

        List<Map<String, String>> methods = new ArrayList<>();

        methods.add(Map.of("method", "GET", "description", "Recupera dados do servidor"));
        methods.add(Map.of("method", "POST", "description", "Envia dados para criar um recurso"));
        methods.add(Map.of("method", "PUT", "description", "Atualiza um recurso existente"));
        methods.add(Map.of("method", "PATCH", "description", "Atualiza parcialmente um recurso"));
        methods.add(Map.of("method", "DELETE", "description", "Remove um recurso"));
        methods.add(Map.of("method", "HEAD", "description", "Recupera apenas os headers"));
        methods.add(Map.of("method", "OPTIONS", "description", "Verifica métodos suportados"));

        result.put("methods", methods);
        return result;
    }
}


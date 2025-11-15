package com.ferramentas.toolhub.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class UrlParserService {

    public Map<String, Object> parseUrl(String urlString) {
        Map<String, Object> result = new HashMap<>();

        try {
            URI uri = new URI(urlString);

            // Componentes básicos
            result.put("original", urlString);
            result.put("protocol", uri.getScheme());
            result.put("host", uri.getHost());
            result.put("port", uri.getPort() != -1 ? uri.getPort() : getDefaultPort(uri.getScheme()));
            result.put("path", uri.getPath());
            result.put("query", uri.getQuery());
            result.put("fragment", uri.getFragment());

            // Informações adicionais
            result.put("authority", uri.getAuthority());
            result.put("userInfo", uri.getUserInfo());

            // Parse dos parâmetros da query
            if (uri.getQuery() != null && !uri.getQuery().isEmpty()) {
                result.put("parameters", parseQueryParameters(uri.getQuery()));
            } else {
                result.put("parameters", new HashMap<>());
            }

            // Informações de segurança
            Map<String, Object> security = new HashMap<>();
            security.put("isSecure", "https".equalsIgnoreCase(uri.getScheme()));
            security.put("hasUserInfo", uri.getUserInfo() != null);
            result.put("security", security);

            // URL reconstruída
            result.put("reconstructed", reconstructUrl(uri));

            result.put("valid", true);

        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Erro ao parsear URL: " + e.getMessage());
        }

        return result;
    }

    private Map<String, List<String>> parseQueryParameters(String query) {
        Map<String, List<String>> parameters = new LinkedHashMap<>();

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            String key;
            String value;

            if (idx > 0) {
                key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
            } else {
                key = URLDecoder.decode(pair, StandardCharsets.UTF_8);
                value = "";
            }

            parameters.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }

        return parameters;
    }

    private int getDefaultPort(String scheme) {
        if (scheme == null) return -1;
        return switch (scheme.toLowerCase()) {
            case "http" -> 80;
            case "https" -> 443;
            case "ftp" -> 21;
            case "ssh" -> 22;
            default -> -1;
        };
    }

    private String reconstructUrl(URI uri) {
        StringBuilder sb = new StringBuilder();

        if (uri.getScheme() != null) {
            sb.append(uri.getScheme()).append("://");
        }

        if (uri.getAuthority() != null) {
            sb.append(uri.getAuthority());
        }

        if (uri.getPath() != null) {
            sb.append(uri.getPath());
        }

        if (uri.getQuery() != null) {
            sb.append("?").append(uri.getQuery());
        }

        if (uri.getFragment() != null) {
            sb.append("#").append(uri.getFragment());
        }

        return sb.toString();
    }

    public Map<String, Object> buildUrl(Map<String, Object> components) {
        Map<String, Object> result = new HashMap<>();

        try {
            StringBuilder url = new StringBuilder();

            // Protocolo
            if (components.containsKey("protocol")) {
                url.append(components.get("protocol")).append("://");
            }

            // Host
            if (components.containsKey("host")) {
                url.append(components.get("host"));
            }

            // Porta (se não for a padrão)
            if (components.containsKey("port")) {
                int port = Integer.parseInt(components.get("port").toString());
                String protocol = components.getOrDefault("protocol", "http").toString();
                if (port != getDefaultPort(protocol)) {
                    url.append(":").append(port);
                }
            }

            // Path
            if (components.containsKey("path")) {
                String path = components.get("path").toString();
                if (!path.startsWith("/")) {
                    url.append("/");
                }
                url.append(path);
            }

            // Query parameters
            if (components.containsKey("parameters")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> params = (Map<String, Object>) components.get("parameters");
                if (!params.isEmpty()) {
                    url.append("?");
                    url.append(buildQueryString(params));
                }
            }

            // Fragment
            if (components.containsKey("fragment")) {
                url.append("#").append(components.get("fragment"));
            }

            result.put("url", url.toString());
            result.put("success", true);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Erro ao construir URL: " + e.getMessage());
        }

        return result;
    }

    private String buildQueryString(Map<String, Object> parameters) {
        List<String> pairs = new ArrayList<>();

        for (Map.Entry<String, Object> entry : parameters.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value instanceof List) {
                for (Object v : (List<?>) value) {
                    pairs.add(key + "=" + v);
                }
            } else {
                pairs.add(key + "=" + value);
            }
        }

        return String.join("&", pairs);
    }
}


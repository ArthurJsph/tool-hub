package com.ferramentas.toolhub.service;

import com.ferramentas.toolhub.dto.SecurityCheckResponse;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SecurityCheckService {

    private final HttpClient httpClient;

    public SecurityCheckService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public SecurityCheckResponse checkUrl(String urlString) {
        SecurityCheckResponse response = new SecurityCheckResponse();
        response.setUrl(urlString);
        List<String> recommendations = new ArrayList<>();
        int score = 100;

        try {
            if (!urlString.startsWith("http")) {
                urlString = "https://" + urlString;
            }

            URI uri = URI.create(urlString);
            boolean isHttps = "https".equalsIgnoreCase(uri.getScheme());
            response.setHttps(isHttps);

            if (!isHttps) {
                score -= 20;
                recommendations.add("Use HTTPS instead of HTTP for secure communication.");
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<Void> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.discarding());

            response.setStatusCode(httpResponse.statusCode());
            response.setHeaders(httpResponse.headers().map());

            // Check Security Headers
            Map<String, List<String>> headers = httpResponse.headers().map();

            if (!hasHeader(headers, "Strict-Transport-Security")) {
                score -= 10;
                recommendations.add("Missing 'Strict-Transport-Security' header.");
            }

            if (!hasHeader(headers, "X-Content-Type-Options")) {
                score -= 10;
                recommendations.add("Missing 'X-Content-Type-Options' header.");
            }

            if (!hasHeader(headers, "X-Frame-Options")) {
                score -= 10;
                recommendations.add("Missing 'X-Frame-Options' header.");
            }

            if (!hasHeader(headers, "Content-Security-Policy")) {
                score -= 10;
                recommendations.add("Missing 'Content-Security-Policy' header.");
            }

            if (!hasHeader(headers, "X-XSS-Protection")) {
                // This header is deprecated in modern browsers but still often checked
                // score -= 5;
                // recommendations.add("Missing 'X-XSS-Protection' header.");
            }

            // Check Server header (information disclosure)
            if (hasHeader(headers, "Server")) {
                score -= 5;
                recommendations.add("Server header is present. Consider hiding server version information.");
            }

            if (hasHeader(headers, "X-Powered-By")) {
                score -= 5;
                recommendations.add("X-Powered-By header is present. Consider hiding technology stack information.");
            }

        } catch (Exception e) {
            score = 0;
            recommendations.add("Failed to connect to URL: " + e.getMessage());
            response.setStatusCode(0);
        }

        response.setSecurityScore(Math.max(0, score));
        response.setRecommendations(recommendations);
        return response;
    }

    private boolean hasHeader(Map<String, List<String>> headers, String headerName) {
        return headers.keySet().stream()
                .anyMatch(key -> key.equalsIgnoreCase(headerName));
    }
}

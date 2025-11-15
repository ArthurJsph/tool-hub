package com.ferramentas.toolhub.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.*;

@Service
public class RegexService {

    public Map<String, Object> testRegex(String pattern, String text) {
        Map<String, Object> result = new HashMap<>();

        try {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(text);

            List<Map<String, Object>> matches = new ArrayList<>();
            int matchCount = 0;

            while (m.find()) {
                matchCount++;
                Map<String, Object> match = new HashMap<>();
                match.put("match", m.group());
                match.put("start", m.start());
                match.put("end", m.end());

                // Grupos capturados
                List<String> groups = new ArrayList<>();
                for (int i = 1; i <= m.groupCount(); i++) {
                    groups.add(m.group(i));
                }
                if (!groups.isEmpty()) {
                    match.put("groups", groups);
                }

                matches.add(match);
            }

            result.put("pattern", pattern);
            result.put("text", text);
            result.put("matches", matches);
            result.put("matchCount", matchCount);
            result.put("hasMatch", matchCount > 0);
            result.put("success", true);

        } catch (PatternSyntaxException e) {
            result.put("success", false);
            result.put("error", "Padrão regex inválido: " + e.getMessage());
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Erro ao testar regex: " + e.getMessage());
        }

        return result;
    }

    public Map<String, Object> replaceWithRegex(String pattern, String text, String replacement) {
        Map<String, Object> result = new HashMap<>();

        try {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(text);

            String replaced = m.replaceAll(replacement);
            int replacementCount = 0;

            // Conta quantas substituições foram feitas
            Matcher counterMatcher = p.matcher(text);
            while (counterMatcher.find()) {
                replacementCount++;
            }

            result.put("pattern", pattern);
            result.put("original", text);
            result.put("replacement", replacement);
            result.put("result", replaced);
            result.put("replacementCount", replacementCount);
            result.put("success", true);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Erro ao substituir com regex: " + e.getMessage());
        }

        return result;
    }

    public Map<String, Object> generateRegexPatterns() {
        Map<String, Object> result = new HashMap<>();

        Map<String, String> patterns = new LinkedHashMap<>();

        // Padrões comuns
        patterns.put("email", "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        patterns.put("url", "^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$");
        patterns.put("ipv4", "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
        patterns.put("phone_br", "^\\(?[1-9]{2}\\)? ?(?:[2-8]|9[1-9])[0-9]{3}\\-?[0-9]{4}$");
        patterns.put("cpf", "^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}$");
        patterns.put("cnpj", "^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}$");
        patterns.put("cep", "^\\d{5}\\-\\d{3}$");
        patterns.put("date_br", "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$");
        patterns.put("date_iso", "^\\d{4}\\-(0[1-9]|1[0-2])\\-(0[1-9]|[12][0-9]|3[01])$");
        patterns.put("time", "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$");
        patterns.put("hex_color", "^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
        patterns.put("credit_card", "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$");
        patterns.put("username", "^[a-zA-Z0-9_]{3,16}$");
        patterns.put("strong_password", "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
        patterns.put("uuid", "^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}$");
        patterns.put("base64", "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");
        patterns.put("jwt", "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$");

        result.put("patterns", patterns);
        result.put("count", patterns.size());

        return result;
    }

    public Map<String, Object> identifyPattern(String text) {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> patterns = (Map<String, String>) generateRegexPatterns().get("patterns");

        List<String> matches = new ArrayList<>();

        for (Map.Entry<String, String> entry : patterns.entrySet()) {
            try {
                Pattern p = Pattern.compile(entry.getValue());
                Matcher m = p.matcher(text);

                if (m.matches()) {
                    matches.add(entry.getKey());
                }
            } catch (Exception ignored) {
                // Ignora erros de padrões específicos
            }
        }

        result.put("text", text);
        result.put("identifiedPatterns", matches);
        result.put("hasMatch", !matches.isEmpty());

        return result;
    }
}


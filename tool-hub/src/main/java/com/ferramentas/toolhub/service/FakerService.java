package com.ferramentas.toolhub.service;

import com.github.javafaker.Faker;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class FakerService {

    public Map<String, Object> generateFakeData(String type, Integer count, String locale) {
        Map<String, Object> result = new HashMap<>();
        List<Object> data = new ArrayList<>();

        // Define o locale, padrão pt-BR
        Locale localeObj = locale != null ? Locale.forLanguageTag(locale) : new Locale("pt", "BR");
        Faker faker = new Faker(localeObj);

        int itemCount = count != null && count > 0 ? count : 1;

        try {
            for (int i = 0; i < itemCount; i++) {
                switch (type.toLowerCase()) {
                    case "name":
                        data.add(Map.of(
                            "fullName", faker.name().fullName(),
                            "firstName", faker.name().firstName(),
                            "lastName", faker.name().lastName(),
                            "username", faker.name().username()
                        ));
                        break;

                    case "email":
                        data.add(Map.of(
                            "email", faker.internet().emailAddress(),
                            "safeEmail", faker.internet().safeEmailAddress(),
                            "domain", faker.internet().domainName()
                        ));
                        break;

                    case "address":
                        data.add(Map.of(
                            "fullAddress", faker.address().fullAddress(),
                            "streetAddress", faker.address().streetAddress(),
                            "city", faker.address().city(),
                            "state", faker.address().state(),
                            "zipCode", faker.address().zipCode(),
                            "country", faker.address().country()
                        ));
                        break;

                    case "phone":
                        data.add(Map.of(
                            "phoneNumber", faker.phoneNumber().phoneNumber(),
                            "cellPhone", faker.phoneNumber().cellPhone()
                        ));
                        break;

                    case "date":
                        Date pastDate = faker.date().past(365, TimeUnit.DAYS);
                        Date futureDate = faker.date().future(365, TimeUnit.DAYS);
                        data.add(Map.of(
                            "past", pastDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                            "future", futureDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                            "birthday", faker.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                        ));
                        break;

                    case "company":
                        data.add(Map.of(
                            "name", faker.company().name(),
                            "industry", faker.company().industry(),
                            "catchPhrase", faker.company().catchPhrase(),
                            "url", faker.company().url()
                        ));
                        break;

                    case "person":
                        data.add(Map.of(
                            "name", faker.name().fullName(),
                            "email", faker.internet().emailAddress(),
                            "phone", faker.phoneNumber().phoneNumber(),
                            "address", faker.address().fullAddress(),
                            "company", faker.company().name(),
                            "jobTitle", faker.job().title()
                        ));
                        break;

                    case "internet":
                        data.add(Map.of(
                            "email", faker.internet().emailAddress(),
                            "url", faker.internet().url(),
                            "domain", faker.internet().domainName(),
                            "ipv4", faker.internet().ipV4Address(),
                            "ipv6", faker.internet().ipV6Address(),
                            "macAddress", faker.internet().macAddress()
                        ));
                        break;

                    default:
                        throw new IllegalArgumentException("Tipo inválido: " + type +
                            ". Tipos suportados: name, email, address, phone, date, company, person, internet");
                }
            }

            result.put("success", true);
            result.put("type", type);
            result.put("count", itemCount);
            result.put("locale", locale != null ? locale : "pt-BR");
            result.put("data", data);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }

    public Map<String, Object> getAvailableTypes() {
        Map<String, Object> result = new HashMap<>();
        result.put("types", Arrays.asList(
            "name", "email", "address", "phone", "date", "company", "person", "internet"
        ));
        result.put("locales", Arrays.asList(
            "pt-BR", "en-US", "es-ES", "fr-FR", "de-DE", "it-IT"
        ));
        return result;
    }
}


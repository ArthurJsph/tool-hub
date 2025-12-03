package com.ferramentas.toolhub.config;

import com.ferramentas.toolhub.model.Tool;
import com.ferramentas.toolhub.model.User;
import com.ferramentas.toolhub.repository.ToolRepository;
import com.ferramentas.toolhub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(ToolRepository toolRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Tools
            if (toolRepository.count() == 0) {
                toolRepository.saveAll(Arrays.asList(
                        createTool("password-generator", "Gerador de Senhas",
                                "Gere senhas fortes e seguras com opções personalizáveis.", "Key",
                                "/dashboard/tools/password-generator"),
                        createTool("base64-encoder", "Codificador Base64",
                                "Codifique e decodifique textos em formato Base64.", "Binary",
                                "/dashboard/tools/base64-encoder"),
                        createTool("hash-generator", "Gerador de Hash", "Crie hashes MD5, SHA-1, SHA-256 e outros.",
                                "Hash", "/dashboard/tools/hash-generator"),
                        createTool("uuid-generator", "Gerador de UUID",
                                "Gere identificadores únicos universais (UUIDs) versão 4.", "FileJson",
                                "/dashboard/tools/uuid-generator"),
                        createTool("lorem-ipsum", "Lorem Ipsum", "Gere textos de preenchimento Lorem Ipsum.",
                                "FileText", "/dashboard/tools/lorem-ipsum"),
                        createTool("json-formatter", "Formatador JSON",
                                "Formate e valide JSON minificado ou desorganizado.", "FileJson",
                                "/dashboard/tools/json-formatter"),
                        createTool("url-encoder", "Encoder/Decoder URL",
                                "Codifique e decodifique URLs para uso seguro.", "Link",
                                "/dashboard/tools/url-encoder"),
                        createTool("text-diff", "Comparador de Texto", "Compare dois textos e veja as diferenças.",
                                "FileText", "/dashboard/tools/text-diff"),
                        createTool("qrcode-generator", "Gerador de QR Code", "Crie QR Codes para links, textos e mais.",
                                "QrCode", "/dashboard/tools/qrcode-generator"),
                        createTool("dns-lookup", "DNS Lookup", "Verifique registros DNS de um domínio.", "Globe",
                                "/dashboard/tools/dns-lookup")));
                System.out.println("Tools seeded successfully!");
            }

            // Seed Admin User
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setId(UUID.randomUUID());
                admin.setUsername("admin");
                admin.setEmail("admin@toolhub.com");
                admin.setPasswordHash(passwordEncoder.encode("password")); // Hash the password properly
                admin.setRole("ADMIN");
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("Admin user seeded successfully!");
            }
        };
    }

    private Tool createTool(String key, String title, String description, String icon, String href) {
        Tool tool = new Tool();
        tool.setKey(key);
        tool.setTitle(title);
        tool.setDescription(description);
        tool.setIcon(icon);
        tool.setHref(href);
        tool.setActive(true);
        return tool;
    }
}

package com.ferramentas.toolhub.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;

@Service
public class ToolService {

    private final BCryptPasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

    @Transactional
    public String generateStrongPassword(int length, boolean includeSymbols) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (includeSymbols) {
            chars += "!@#$%^&*()_+";
        }

        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    @Transactional
    public boolean validateJwt(String token, String algorithm) {
        try {
            SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.forName(algorithm);
            Key key = Keys.secretKeyFor(signatureAlgorithm);
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Ocorreu um erro na validação
            return false;
        }
    }

    @Transactional
    public String generateUUID() {
        return UUID.randomUUID().toString();
    }

    // Codificador Base64
    public String encodeBase64(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input não pode ser vazio");
        }
        return Base64.getEncoder().encodeToString(input.getBytes());
    }

    @Transactional
    public String decodeBase64(String encoded) {
        if (encoded == null || encoded.isEmpty()) {
            throw new IllegalArgumentException("Input não pode ser vazio");
        }
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encoded);
            return new String(decodedBytes);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Base64 inválido: " + e.getMessage());
        }
    }

    @Transactional
    public String generateHash(String input, String algorithm) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input não pode ser vazio");
        }

        try {
            switch (algorithm.toUpperCase()) {
                case "MD5":
                    return hashWithMessageDigest(input, "MD5");
                case "SHA1":
                case "SHA-1":
                    return hashWithMessageDigest(input, "SHA-1");
                case "SHA256":
                case "SHA-256":
                    return hashWithMessageDigest(input, "SHA-256");
                case "SHA512":
                case "SHA-512":
                    return hashWithMessageDigest(input, "SHA-512");
                case "BCRYPT":
                    return bcryptEncoder.encode(input);
                default:
                    throw new IllegalArgumentException("Algoritmo não suportado: " + algorithm + ". Algoritmos suportados: MD5, SHA1, SHA256, SHA512, BCRYPT");
            }
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalArgumentException("Erro ao processar algoritmo: " + algorithm);
        }
    }

    private String hashWithMessageDigest(String input, String algorithm) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance(algorithm);
        byte[] hashBytes = digest.digest(input.getBytes());

        // Converter bytes para hexadecimal
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}

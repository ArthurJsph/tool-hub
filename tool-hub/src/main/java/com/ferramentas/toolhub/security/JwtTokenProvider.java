package com.ferramentas.toolhub.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${JWT_SECRET}")
    private String secret;

    @Value("${JWT_EXPIRATION:900000}") // Default 15 minutes
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // Adicionar roles
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        // Adicionar ID se disponível
        if (userDetails instanceof CustomUserDetails) {
            claims.put("id", ((CustomUserDetails) userDetails).getId());
        }

        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public java.util.List<org.springframework.security.core.GrantedAuthority> extractAuthorities(String token) {
        Claims claims = extractAllClaims(token);
        java.util.List<String> roles = claims.get("roles", java.util.List.class);
        if (roles == null)
            return java.util.Collections.emptyList();

        return roles.stream()
                .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
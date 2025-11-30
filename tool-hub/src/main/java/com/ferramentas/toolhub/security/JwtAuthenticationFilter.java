package com.ferramentas.toolhub.security;

import com.ferramentas.toolhub.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                username = jwtTokenProvider.extractUsername(jwt);
            } else {
                // Try to get token from cookie
                jakarta.servlet.http.Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (jakarta.servlet.http.Cookie cookie : cookies) {
                        if ("token".equals(cookie.getName())) {
                            jwt = cookie.getValue();
                            username = jwtTokenProvider.extractUsername(jwt);
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Token invalid or expired, ignore and let request proceed anonymously
            // Logger could be used here
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Optimization: Don't load user from DB if token is valid. Trust the token.
            if (jwtTokenProvider.validateToken(jwt)) {
                java.util.List<org.springframework.security.core.GrantedAuthority> authorities = jwtTokenProvider
                        .extractAuthorities(jwt);

                // Create UserDetails-like object or just use username
                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(username)
                        .password("") // Password not needed
                        .authorities(authorities)
                        .build();

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}

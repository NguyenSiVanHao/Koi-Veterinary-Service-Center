package com.koicenter.koicenterbackend.configuration;

import com.koicenter.koicenterbackend.util.JWTUtilHelper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class CustomJwtFilter extends OncePerRequestFilter {

    @Autowired
    JWTUtilHelper jwtUtilsHelper;
    @Value("${myapp.api-key}")
    private String privateKey;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(getTokenFromHeader(request) != null && jwtUtilsHelper.isTokenLoggedOut(getTokenFromHeader(request))) {
            if(jwtUtilsHelper.verifyToken(getTokenFromHeader(request))){
                String role = jwtUtilsHelper.getRoleFromToken(getTokenFromHeader(request));
                String username = jwtUtilsHelper.getUsernameFromToken(getTokenFromHeader(request));  // Lấy username từ token

                String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();

                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(roleWithPrefix));

                // Tạo UsernamePasswordAuthenticationToken với username và authorities
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContext securityContext = SecurityContextHolder.getContext();
                securityContext.setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }


    private String getTokenFromHeader(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return token;
    }


}

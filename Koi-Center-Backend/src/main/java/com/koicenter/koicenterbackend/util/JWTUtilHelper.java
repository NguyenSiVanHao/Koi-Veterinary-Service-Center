package com.koicenter.koicenterbackend.util;


import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.enums.Role;
import com.koicenter.koicenterbackend.repository.LoggedOutTokenRepository;
import com.koicenter.koicenterbackend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
public class JWTUtilHelper {
    @Autowired
    UserRepository userRepository;


    @Autowired
    LoggedOutTokenRepository loggedOutTokenRepository;

    @Value("${myapp.api-key}")
    private String privateKey;


    public String generateToken(String data){
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        User user = userRepository.findByUsername(data);

        String jws = Jwts.builder().subject(data)    
                .claim("role", user.getRole())
                .claim("user_id", user.getUserId())
                .issuer("KoiCenter.com")
                .issuedAt(new Date())
                .claim("jti", UUID.randomUUID().toString())
                .expiration(new Date(
                        Instant.now().plus(3, ChronoUnit.DAYS).toEpochMilli()
                ))
                .signWith(key).compact();
        return jws;
    }



    public boolean verifyToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenLoggedOut(String token) {
        return loggedOutTokenRepository.findByToken(token) == null;
    }



    public String generateTokenGmail(User data) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));

        String jws = Jwts.builder().subject(data.getUsername())
                .claim("user_id", data.getUserId())
                .claim("role", Role.CUSTOMER)
                .issuer("KoiCenter.com")
                .issuedAt(new Date())
                .claim("jti", UUID.randomUUID().toString())
                .expiration(new Date(
                        Instant.now().plus(3, ChronoUnit.DAYS).toEpochMilli()
                ))
                .signWith(key).compact();
        return jws;
    }

    public String generateTokenForgetPass(String email) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(20)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getRoleFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }
    public LocalDateTime getExpFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        Long expTimestamp = claims.get("exp", Long.class);
        return  LocalDateTime.ofInstant(Instant.ofEpochSecond(expTimestamp), ZoneId.systemDefault());
    }
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject(); // Lấy "subject" từ payload của token
    }

}

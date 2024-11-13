package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Contact;
import com.koicenter.koicenterbackend.model.entity.LoggedOutToken;
import com.koicenter.koicenterbackend.model.request.Contact.ContactRequest;
import com.koicenter.koicenterbackend.repository.ContactRepository;
import com.koicenter.koicenterbackend.repository.LoggedOutTokenRepository;
import com.koicenter.koicenterbackend.util.JWTUtilHelper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

//@Service
@Slf4j
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenScheduler {
    JWTUtilHelper jwtUtilHelper;
    LoggedOutTokenRepository loggedOutTokenRepository;


    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây
    public void checkToken() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<LoggedOutToken> tokens = loggedOutTokenRepository.findAll();
        tokens.forEach(loggedOutToken -> {
            String token = loggedOutToken.getToken();
            try {
                LocalDateTime tokenExpirationTime = jwtUtilHelper.getExpFromToken(token);
                if (currentTime.isAfter(tokenExpirationTime)) {
                    loggedOutTokenRepository.delete(loggedOutToken);
                }
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                loggedOutTokenRepository.delete(loggedOutToken);
            } catch (Exception e) {
            }
        });
        log.info("Scheduled task completed at: " + LocalDateTime.now());
    }
}


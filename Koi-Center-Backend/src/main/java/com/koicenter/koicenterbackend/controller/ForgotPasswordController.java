package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.request.authentication.UpdateForgotPasswordRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.service.OtpService;
import com.koicenter.koicenterbackend.service.UserService;
import com.koicenter.koicenterbackend.util.JWTUtilHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/forgotPassword")
@Slf4j
public class ForgotPasswordController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtilHelper jwtUtilHelper;

    @PostMapping("/sendMail")
    public ResponseEntity<ResponseObject> forgotPassword(@RequestParam String email) {
        try {
            otpService.generateOtp(email);
            return ResponseObject.APIRepsonse(200, "OTP has been sent to your mail.", HttpStatus.OK, "");
        }catch (AppException e) {
            return ResponseObject.APIRepsonse(404, "Email do not exist", HttpStatus.NOT_FOUND, null);
        }catch (Exception e) {
            log.error("Error fgpw: {}", e.getMessage(), e);
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<ResponseObject> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValidOtp = otpService.verifyOtp(email, otp);
        if (isValidOtp) {
            String token = jwtUtilHelper.generateTokenForgetPass(email);
            return ResponseObject.APIRepsonse(200, "OTP match. Reset your password.", HttpStatus.OK, token);
        } else {
            return ResponseObject.APIRepsonse(404, "OTP invalid or expired", HttpStatus.NOT_FOUND, null);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseObject> resetPassword( @RequestParam String token, @RequestBody UpdateForgotPasswordRequest updateForgotPasswordRequest) {
        if (!jwtUtilHelper.verifyToken(token)) {
            return ResponseObject.APIRepsonse(401, "Invalid or expired token.", HttpStatus.UNAUTHORIZED, null);
        }
        boolean isPasswordReset = userService.updateForgotPassword(updateForgotPasswordRequest);
        if (isPasswordReset) {
            return ResponseObject.APIRepsonse(200, "Password reset successful.", HttpStatus.OK, "");
        } else {
            return ResponseObject.APIRepsonse(500, "Password reset failed.", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}

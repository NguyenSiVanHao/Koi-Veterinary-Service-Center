package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.request.authentication.RegisterRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/staffs")
public class StaffController {
    @Autowired
    UserService userService;

    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createStaff(@RequestBody RegisterRequest newUser) {
        try {
            if (userService.getUserByUsername(newUser.getUsername()) || userService.getUserByEmail(newUser.getEmail())) {
                return ResponseObject.APIRepsonse(409, "Username or email already exists", HttpStatus.CONFLICT, "");
            }
            boolean isCreated = userService.createStaff(newUser);
            if (isCreated) {
                return ResponseObject.APIRepsonse(200, "Register successfully!", HttpStatus.CREATED, "");
            }else {
                return ResponseObject.APIRepsonse(409, "Register failed", HttpStatus.CONFLICT, "");
            }
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "");
        }
    }
}

package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.Role;
import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.request.authentication.RegisterRequest;

import com.koicenter.koicenterbackend.model.request.authentication.UpdatePasswordRequest;
import com.koicenter.koicenterbackend.model.request.user.UpdateUserRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.user.UserResponse;
import com.koicenter.koicenterbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ResponseObject> register(@RequestBody RegisterRequest newUser) {
        try {
            if (userService.getUserByUsername(newUser.getUsername()) || userService.getUserByEmail(newUser.getEmail())) {
                return ResponseObject.APIRepsonse(409, "Username or email already exists", HttpStatus.CONFLICT, "");
            }else {
                userService.createCustomer(newUser);
            }
            userService.createCustomer(newUser);
            return ResponseObject.APIRepsonse(200, "Register successfully!", HttpStatus.CREATED, "");
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "");
        }
    }

    @PostMapping("/myInfo")
    public ResponseEntity<ResponseObject> getMyInfo(HttpServletRequest request) {
        UserResponse myInfo = userService.getMyInfo(request);
        if (myInfo != null) {
            return ResponseObject.APIRepsonse(200, "User info retrieved successfully!", HttpStatus.OK, myInfo);
        } else {
            return ResponseObject.APIRepsonse(404, "User does not exist!", HttpStatus.NOT_FOUND, "");
        }
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @GetMapping("/get")
    public ResponseEntity<ResponseObject> getUserByRole(@RequestParam String role) {
        List<UserResponse> userList = userService.getListUserByRole(role);
        return ResponseObject.APIRepsonse(200, "List", HttpStatus.OK, userList);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("")
    public ResponseEntity<ResponseObject> deleteUser(@RequestParam String userId) {
        boolean isDeleted = userService.deleteUser(userId);
        if (isDeleted) {
            return ResponseObject.APIRepsonse(200, "User deleted successfully!", HttpStatus.OK, null);
        } else {
            return ResponseObject.APIRepsonse(404, "User does not exist!", HttpStatus.NOT_FOUND, null);
        }
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<ResponseObject> updatePassword(@RequestBody UpdatePasswordRequest passwordRequest) {
        boolean isPasswordUpdated = userService.updatePassword(passwordRequest);
        if (isPasswordUpdated) {
            return ResponseObject.APIRepsonse(200, "Password updated successfully", HttpStatus.OK, "");
        } else if (Objects.equals(passwordRequest.getCurrentPassword(), passwordRequest.getNewPassword())) {
            return ResponseObject.APIRepsonse(404, "New password must be different from the current password", HttpStatus.BAD_REQUEST, "");
        } else {
            return ResponseObject.APIRepsonse(404, "Your current password is incorrect", HttpStatus.BAD_REQUEST, "");
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER','STAFF', 'CUSTOMER')")
    @PutMapping("/update")
    public ResponseEntity<ResponseObject> update(@RequestBody UpdateUserRequest updateUserRequest){
        boolean isUpdated = userService.updateUser(updateUserRequest);
        if(isUpdated){
            return ResponseObject.APIRepsonse(200, "User updated successfully!", HttpStatus.OK, null);
        }else {
            return ResponseObject.APIRepsonse(500, "Update fail!", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}

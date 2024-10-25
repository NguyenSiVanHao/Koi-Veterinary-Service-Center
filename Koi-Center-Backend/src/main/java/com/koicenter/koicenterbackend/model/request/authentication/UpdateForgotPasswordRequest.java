package com.koicenter.koicenterbackend.model.request.authentication;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateForgotPasswordRequest {
    String email;
    String newPassword;
}

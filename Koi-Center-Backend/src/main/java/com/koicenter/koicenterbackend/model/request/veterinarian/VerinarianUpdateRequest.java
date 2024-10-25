package com.koicenter.koicenterbackend.model.request.veterinarian;

import com.koicenter.koicenterbackend.model.request.user.UserRequest;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerinarianUpdateRequest {
    String status;
    String description;
    String google_meet;
    String phone;
    String image;
    List<String> Service ;
}

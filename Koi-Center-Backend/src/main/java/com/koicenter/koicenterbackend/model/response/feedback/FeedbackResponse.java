package com.koicenter.koicenterbackend.model.response.feedback;

import com.koicenter.koicenterbackend.model.response.user.UserResponse;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    String feedbackId;
    int star;
    String description;
    String  appointmentId;
    float averageStar ;
    int number ;
    UserResponse userResponse ;
}

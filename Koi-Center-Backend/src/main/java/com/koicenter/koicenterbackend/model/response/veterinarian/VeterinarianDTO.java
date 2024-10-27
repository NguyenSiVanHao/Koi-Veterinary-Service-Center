package com.koicenter.koicenterbackend.model.response.veterinarian;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.koicenter.koicenterbackend.model.entity.Service;
import com.koicenter.koicenterbackend.model.request.service.ServiceDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VeterinarianDTO {
    String vetId;
    String description;
    String googleMeet;
    String image;
    String phone;
    String veterinarianStatus;
    String status;
    List<String> listOfServices;
}

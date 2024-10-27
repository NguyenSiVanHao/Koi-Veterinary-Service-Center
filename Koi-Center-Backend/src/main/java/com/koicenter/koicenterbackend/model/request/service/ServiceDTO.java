package com.koicenter.koicenterbackend.model.request.service;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceDTO {
    String serviceId;
    String serviceName;
    String description;
    Float basePrice;
    float pondPrice;
    float koiPrice;
    String serviceFor;
    String image;
    Boolean status;
}

package com.koicenter.koicenterbackend.model.response.invoice;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.Year;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCount {
    String serviceName;
    String serviceId;
    int count ;
}

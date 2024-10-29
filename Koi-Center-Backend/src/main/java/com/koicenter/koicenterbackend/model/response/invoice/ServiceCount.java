package com.koicenter.koicenterbackend.model.response.invoice;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Data
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceCount {
    String serviceName;
    String serviceId;
    long count ;

}

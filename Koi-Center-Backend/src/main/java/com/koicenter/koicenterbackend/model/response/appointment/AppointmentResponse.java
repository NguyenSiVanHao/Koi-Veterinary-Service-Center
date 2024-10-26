package com.koicenter.koicenterbackend.model.response.appointment;

import com.koicenter.koicenterbackend.model.enums.AppointmentStatus;
import com.koicenter.koicenterbackend.model.enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AppointmentResponse {
     String appointmentId;
     LocalDate appointmentDate;
     ZonedDateTime createdAt;
     float depositedMoney;
     LocalTime endTime;
     String location;
     String result;
     LocalTime startTime;
     AppointmentStatus status;
     AppointmentType type;
     String customerId;
     String customerName;
     String serviceId;
     String serviceName;
     String vetId;
     String vetName;
     float distance ;
     float totalHomeVisitFee ;
     float homeVisitPrice ;
     int quantity ;
     float totalKoiPondFee ;
     float balanceDue ;
     String code ;
     String invoiceId ;
     String phone;
}

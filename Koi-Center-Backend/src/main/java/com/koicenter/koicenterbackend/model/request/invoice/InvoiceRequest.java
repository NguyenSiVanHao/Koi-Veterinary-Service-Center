package com.koicenter.koicenterbackend.model.request.invoice;

import com.koicenter.koicenterbackend.model.entity.Appointment;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class InvoiceRequest {
    String invoiceId;
    float unitPrice;
    float totalPrice;
    LocalDateTime createAt;
    String  appointmentId;
    int quantity ;
    PaymentStatus status;
    InvoiceType type ;
    float distance ;
    float deliveryPrice ;
}

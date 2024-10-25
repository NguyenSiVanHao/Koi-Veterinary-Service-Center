package com.koicenter.koicenterbackend.model.entity;

import com.koicenter.koicenterbackend.model.enums.AppointmentType;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "invoice_id")

    String invoiceId;
    @Column(name = "total_price")
    float totalPrice;
    @Enumerated(EnumType.STRING)
    PaymentStatus status;
    @Enumerated(EnumType.STRING)
    InvoiceType type;
    @Column(name = "create_at")
    LocalDateTime createAt;
    @Column(name = "unit_price")
    float unitPrice;
    int quantity ;
    float distance ;
    float deliveryPrice ;
    int code ;
    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    Appointment appointment;
}

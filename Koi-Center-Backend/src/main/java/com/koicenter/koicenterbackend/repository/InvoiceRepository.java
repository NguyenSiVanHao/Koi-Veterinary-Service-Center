package com.koicenter.koicenterbackend.repository;

import com.koicenter.koicenterbackend.model.entity.Invoice;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findByAppointment_AppointmentId(String appointmentId);
    Invoice findByAppointment_AppointmentIdAndType(String appointmentId, InvoiceType type);
}

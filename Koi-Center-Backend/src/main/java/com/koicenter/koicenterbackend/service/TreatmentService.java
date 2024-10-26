package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.PondMapper;
import com.koicenter.koicenterbackend.mapper.PondTreatmentMapper;
import com.koicenter.koicenterbackend.mapper.appointment.AppointmentMapper;
import com.koicenter.koicenterbackend.mapper.koi.KoiMapper;
import com.koicenter.koicenterbackend.mapper.koi.KoiTreatmentMapper;
import com.koicenter.koicenterbackend.model.entity.*;
import com.koicenter.koicenterbackend.model.enums.AppointmentStatus;
import com.koicenter.koicenterbackend.model.enums.AppointmentType;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.request.koi.KoiTreatmentRequest;
import com.koicenter.koicenterbackend.model.request.pond.PondTreatmentRequest;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiTreatmentResponse;
import com.koicenter.koicenterbackend.model.response.pond.PondTreatmentResponse;
import com.koicenter.koicenterbackend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TreatmentService {
    KoiTreatmentRepository koiTreatmentRepository;
    PondTreatmentRepository pondTreatmentRepository;
    PondRepository pondRepository;
    AppointmentRepository appointmentRepository;
    PondTreatmentMapper pondTreatmentMapper;
    KoiTreatmentMapper koiTreatmentMapper;
    PondMapper pondMapper;
    AppointmentMapper appointmentMapper;
    PondTreatmentService pondTreatmentService;
    AppointmentService appointmentService;
    KoiRepository koiRepository;
    KoiTreatmentService koiTreatmentService;
    PrescriptionRepository prescriptionRepository;
    ServicesRepository servicesRepository;
    KoiMapper koiMapper ;
    DeliveryRepository deliveryRepository ;
    private final InvoiceRepository invoiceRepository;

    public <T> List<T> createAppointments(List<String> selected, AppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.createAppointment(appointmentRequest);
        log.info("AppointmentID " + appointmentResponse.getAppointmentId());

        List<T> treatmentResponseList = new ArrayList<>();
        if (selected.isEmpty()) {
            treatmentResponseList.add((T) appointmentResponse);
        } else {
            for (String select : selected) {
                if (pondRepository.findById(select).isPresent()) {
                    PondTreatmentRequest pondTreatmentRequest = new PondTreatmentRequest();
                    pondTreatmentRequest.setPondId(select);
                    pondTreatmentRequest.setAppointmentId(appointmentResponse.getAppointmentId());
                    pondTreatmentRequest.setHealthIssue("");
                    pondTreatmentRequest.setTreatment("");
                    treatmentResponseList.add((T) pondTreatmentService.createPondTreatment(pondTreatmentRequest));
                } else if (koiRepository.findById(select).isPresent()) {
                    KoiTreatmentRequest koiTreatmentRequest = new KoiTreatmentRequest();
                    koiTreatmentRequest.setKoiId(select);
                    koiTreatmentRequest.setAppointmentId(appointmentResponse.getAppointmentId());
                    koiTreatmentRequest.setHealthIssue("");
                    koiTreatmentRequest.setTreatment("");
                    treatmentResponseList.add((T) koiTreatmentService.createKoiTreatment(koiTreatmentRequest));
                }

            }
        }
        return treatmentResponseList;
    }

    public PondTreatmentResponse updatePondTreatment(PondTreatmentRequest pondTreatmentRequest) {

        PondTreatment pondTreatment = pondTreatmentRepository.findById(pondTreatmentRequest.getPondTreatmentId()).orElseThrow(() -> new AppException(
                        ErrorCode.PONDTREATMENT_ID_NOT_FOUND.getCode(),
                        ErrorCode.PONDTREATMENT_ID_NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND));

        if (pondTreatmentRequest.getPrescription_id() != null) {
            Prescription prescription = prescriptionRepository.findById(pondTreatmentRequest.getPrescription_id()).orElseThrow(() -> new AppException(
                    ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getCode(),
                    ErrorCode.PRESCRIPTION_MEDICINE_ID_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND));
            pondTreatment.setPrescription(prescription);
        } else {
            pondTreatment.setPrescription(null);
        }
        if (pondTreatmentRequest.getHealthIssue() != null) {
            pondTreatment.setHealthIssue(pondTreatmentRequest.getHealthIssue());
        }
        if (pondTreatmentRequest.getTreatment() != null) {
            pondTreatment.setTreatment(pondTreatmentRequest.getTreatment());
        }
        pondTreatmentRepository.save(pondTreatment);
        PondTreatmentResponse pondTreatmentResponse = new PondTreatmentResponse();
        pondTreatmentResponse = pondTreatmentMapper.toPondTreatmentResponse(pondTreatment);
        return pondTreatmentResponse;
    }

    public KoiTreatmentResponse updateKoiTreatment(KoiTreatmentRequest koiTreatmentRequest) {

        KoiTreatment koiTreatment = koiTreatmentRepository.findById(koiTreatmentRequest.getKoiTreatmentId()).orElseThrow(
                () -> new AppException(
                        ErrorCode.KOITREATMENT_ID_NOT_FOUND.getCode(),
                        ErrorCode.KOITREATMENT_ID_NOT_FOUND.getMessage(),
                        HttpStatus.NOT_FOUND)
        );
        if (koiTreatmentRequest.getPrescription_id() != null) {
            Prescription prescription = prescriptionRepository.findById(koiTreatmentRequest.getPrescription_id()).orElseThrow(() -> new AppException(
                    ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getCode(),
                    ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND
            ));
            koiTreatment.setPrescription(prescription);
        } else {
            koiTreatment.setPrescription(null);
        }
        if (koiTreatmentRequest.getHealthIssue() != null) {
            koiTreatment.setHealthIssue(koiTreatmentRequest.getHealthIssue());
        }
        if (koiTreatmentRequest.getTreatment() != null) {
            koiTreatment.setTreatment(koiTreatmentRequest.getTreatment());
        }
        KoiTreatmentResponse koiTreatmentResponse = new KoiTreatmentResponse();
        koiTreatmentResponse = koiTreatmentMapper.toKoiTreatmentResponse(koiTreatmentRepository.save(koiTreatment));
//        koiTreatmentResponse.prescription
        return koiTreatmentResponse;
    }

    public <T> T searchTreamentByKoiIdOrPondId(String id) {
        KoiTreatment koiTreatment = koiTreatmentRepository.findKoiTreatmentByKoiTreatmentId(id);
        PondTreatment pondTreatment = pondTreatmentRepository.findPondTreatmentByPondTreatmentId(id);
        if (pondTreatment != null) {
            PondTreatmentResponse pondTreatmentResponse = new PondTreatmentResponse();
            Pond pond = pondRepository.findById(pondTreatment.getPond().getPondId()).orElseThrow(() -> new AppException(
                    ErrorCode.POND_ID_NOT_FOUND.getCode(),
                    ErrorCode.POND_ID_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND
            ));
            pondTreatmentResponse.setPondId(pondTreatment.getPond().getPondId());
            pondTreatmentResponse.setPondTreatmentId(id);
            pondTreatmentResponse.setPond(pondMapper.toPondResponse(pond));
            pondTreatmentResponse.setAppointmentId(pondTreatment.getAppointment().getAppointmentId());
            pondTreatmentResponse.setHealthIssue(pondTreatment.getHealthIssue());
            pondTreatmentResponse.setTreatment(pondTreatment.getTreatment());
            return (T) pondTreatmentResponse;
        } else if (koiTreatment != null) {
            KoiTreatmentResponse koiTreatmentResponse = new KoiTreatmentResponse();
            Koi koi = koiRepository.findById(koiTreatment.getKoi().getKoiId()).orElseThrow(() -> new AppException(
                    ErrorCode.KOI_ID_NOT_FOUND.getCode(),
                    ErrorCode.KOI_ID_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND
            ));
            koiTreatmentResponse.setKoiId(koiTreatment.getKoi().getKoiId());
            koiTreatmentResponse.setKoiTreatmentId(id);
            koiTreatmentResponse.setKoi(koiMapper.toKoiResponse(koi));
            koiTreatmentResponse.setAppointmentId(koiTreatment.getAppointment().getAppointmentId());
            koiTreatmentResponse.setHealthIssue(koiTreatment.getHealthIssue());
            koiTreatmentResponse.setTreatment(koiTreatment.getTreatment());
            return (T)koiTreatmentResponse;
        }
        return null;
    }
    public <T> T getSecondPayment ( String appointmentId){
        Appointment appointment = appointmentRepository.findAppointmentById(appointmentId);
        List<KoiTreatment> koiTreatments = koiTreatmentRepository.findKoiTreatmentsByAppointment_AppointmentId(appointment.getAppointmentId());
        List<PondTreatment> pondTreatments = pondTreatmentRepository.findPondTreatmentsByAppointment_AppointmentId(appointment.getAppointmentId());
        List<Delivery> deliverys= deliveryRepository.findAll() ;
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentIdAndType(appointmentId, InvoiceType.First);
        float locationPrice = 0 ; // km
        int quantity  = 0 ;
        float price = 0 ;
        float totalQuantity = 0 ;
        for (Delivery delivery : deliverys) {
        if (delivery.getFromPlace()<=  appointment.getDistance() && appointment.getDistance()<=delivery.getToPlace()) {
            price = delivery.getPrice();
            log.info("deliveryPrice" + price);
            }
        }
        if(!koiTreatments.isEmpty()){
            for(KoiTreatment koiTreatment : koiTreatments){
                quantity ++ ;
            }
            totalQuantity = appointment.getService().getKoiPrice() * quantity  ;
            locationPrice = price * appointment.getDistance() ;
            log.info("Location Price = "+ locationPrice + "Price = "+ price+ "Distance"+ appointment.getDistance() );
            AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
            appointmentResponse.setQuantity(quantity); // so luong ca pond
            appointmentResponse.setTotalHomeVisitFee(locationPrice); // tong (gia phi di chuyen )
            appointmentResponse.setHomeVisitPrice(price); // gia tien theo khoang cach
            appointmentResponse.setTotalKoiPondFee(totalQuantity); // tien ca tien pond * quantity
            appointmentResponse.setBalanceDue(totalQuantity+locationPrice); // tien con lai
            appointmentResponse.setInvoiceId(invoice.getInvoiceId());
            return(T)appointmentResponse;
        }else if (!pondTreatments.isEmpty()){
            for(PondTreatment pondTreatment : pondTreatments){
                quantity ++ ;
            }
            totalQuantity = appointment.getService().getPondPrice() * quantity  ;
            locationPrice = price * appointment.getDistance() ;
            log.info("Location Price = "+ locationPrice + "Price = "+ price+ "Distance"+ appointment.getDistance() );
            AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
            appointmentResponse.setQuantity(quantity); // so luong ca pond
            appointmentResponse.setTotalHomeVisitFee(locationPrice); // tong (gia phi di chuyen )
            appointmentResponse.setHomeVisitPrice(price); // gia tien theo khoang cach
            appointmentResponse.setTotalKoiPondFee(totalQuantity); // tien ca tien pond * quantity
            appointmentResponse.setBalanceDue(totalQuantity+locationPrice); // tien con lai
            appointmentResponse.setInvoiceId(invoice.getInvoiceId());


            return(T)appointmentResponse;
        }else if (appointment.getType().equals(AppointmentType.ONLINE)||pondTreatments.isEmpty()&&koiTreatments.isEmpty()){
            locationPrice = price * appointment.getDistance() ;
            log.info("Location Price = "+ locationPrice + "Price = "+ price+ "Distance"+ appointment.getDistance() );
            AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
            appointmentResponse.setQuantity(quantity); // so luong ca pond
            appointmentResponse.setTotalHomeVisitFee(locationPrice); // tong (gia phi di chuyen )
           appointmentResponse.setBalanceDue(totalQuantity+locationPrice); // tien con lai
            appointmentResponse.setInvoiceId(invoice.getInvoiceId());


            return(T)appointmentResponse;
        }
        return null ;
    }

}

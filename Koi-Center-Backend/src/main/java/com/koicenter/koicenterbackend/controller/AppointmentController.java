package com.koicenter.koicenterbackend.controller;


import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.request.treament.TreamentRequest;
import com.koicenter.koicenterbackend.model.response.PageResponse;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.koi.KoiTreatmentResponse;
import com.koicenter.koicenterbackend.model.response.pond.PondTreatmentResponse;
import com.koicenter.koicenterbackend.service.AppointmentService;
import com.koicenter.koicenterbackend.service.KoiTreatmentService;
import com.koicenter.koicenterbackend.service.PondTreatmentService;
import com.koicenter.koicenterbackend.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    PondTreatmentService pondTreatmentService;
    @Autowired
    KoiTreatmentService koiTreatmentService;
    // Get All appointment
    @Autowired
    AppointmentService appointmentService;

    @Autowired
     TreatmentService treatmentService;
    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllAppointments(@RequestParam String status,@RequestParam int offSet , @RequestParam int pageSize,@RequestParam String search) {
        PageResponse<AppointmentResponse> listAppointment = appointmentService.getAllAppointments(status, offSet, pageSize,search);
        return ResponseObject.APIRepsonse(200, "", HttpStatus.OK, listAppointment);
    }


    // api get Appointment detail
    @GetMapping("/{appointmentId}")
    public ResponseEntity<ResponseObject> getAppointmentDetailById(@PathVariable String appointmentId) {
        AppointmentResponse listAppointment = appointmentService.getAppointmentByAppointmentId(appointmentId);
        if (listAppointment != null) {
            return ResponseObject.APIRepsonse(200, "Appointment found", HttpStatus.OK, listAppointment);
        } else {
            return ResponseObject.APIRepsonse(404, "Appointment not found", HttpStatus.NOT_FOUND, null);
        }
    }

    //     UPDATE
    @PutMapping("/update")
    public ResponseEntity<ResponseObject> updateAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        AppointmentResponse appointmentResponse = appointmentService.updateAppointment(appointmentRequest);
        if (appointmentResponse != null) {
            return ResponseObject.APIRepsonse(200, "UPDATE APPOINTMENT SUCCESSFULLY", HttpStatus.OK, appointmentResponse);
        } else {
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST, "");
        }
    }
    //tạo nhiều cá,pond and appointment
    @PostMapping("")
    public ResponseEntity<ResponseObject> createAppointment( @RequestBody TreamentRequest treamentRequest) {
        List<?> list =  treatmentService.createAppointments(treamentRequest.getSelected(),treamentRequest.getAppointmentRequest());
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(201, "Treament Created successfully! ", HttpStatus.CREATED, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST,"");
        }
    }
    @GetMapping("/{appointmentId}/ponds/")
    public ResponseEntity<ResponseObject> getPondByAppointmentId(@PathVariable String appointmentId) {
        List<PondTreatmentResponse> list =  pondTreatmentService.getPondByAppointmentId(appointmentId);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Pond found successfully By Appointment ID ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Appointment not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @GetMapping("/{appointmentId}/kois/")
    public ResponseEntity<ResponseObject> getKoiByAppointmentId(@PathVariable String appointmentId) {
        List<KoiTreatmentResponse> list =  koiTreatmentService.getKoiByAppointmentId(appointmentId);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Pond found successfully By Appointment ID ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Appointment not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @GetMapping("/userName/{userName}")
    public ResponseEntity<ResponseObject> getAppointmentByUserName(@PathVariable String userName) {
        List<AppointmentResponse> list =  appointmentService.getAppointmentByUserName(userName);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "UserName found successfully By Appointment ID ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "UserName not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @GetMapping("/by-vetId/{vetId}")
    public ResponseEntity<ResponseObject> getAppointmentByVetId(@PathVariable String vetId, @RequestParam LocalDate date) {
        List<AppointmentResponse> list =  appointmentService.getAppointmentByVetId(vetId,date);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Appointment found successfully By Appointment ID ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Appoitment  not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @PutMapping("/cancel/{appointmentId}")
    public ResponseEntity<ResponseObject> updateAppointmentBecomeCancel(@PathVariable String appointmentId) {
        AppointmentResponse appointmentResponse = appointmentService.updateAppointmentBecomeCannel(appointmentId);
        if (appointmentResponse != null) {
            return ResponseObject.APIRepsonse(200, "UPDATE APPOINTMENT SUCCESSFULLY", HttpStatus.OK, appointmentResponse);
        } else {
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST, "");
        }
    }
    @PutMapping("/refund/{appointmentId}")
    public ResponseEntity<ResponseObject> updateAppointmentBecomeRefund(@PathVariable String appointmentId) {
        AppointmentResponse appointmentResponse = appointmentService.updateAppointmentBecomeRefund(appointmentId);
        if (appointmentResponse != null) {
            return ResponseObject.APIRepsonse(200, "REFUND APPOINTMENT SUCCESSFULLY", HttpStatus.OK, appointmentResponse);
        } else {
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST, "");
        }
    }
}

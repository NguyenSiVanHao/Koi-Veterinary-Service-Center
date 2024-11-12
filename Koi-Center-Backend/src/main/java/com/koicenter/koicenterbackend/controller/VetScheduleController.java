package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.entity.Veterinarian;
import com.koicenter.koicenterbackend.model.enums.AppointmentType;
import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VetScheduleRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.schedual.DayResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VetScheduleResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianResponse;
import com.koicenter.koicenterbackend.service.VetScheduleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vetSchedules")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class VetScheduleController {
    VetScheduleService vetScheduleService;
    @GetMapping("")
    public ResponseEntity<ResponseObject> getScheduleForBooking(@RequestParam String type, @RequestParam String vetId) {
        String types = type.toLowerCase();
        if (types.contains("HOME".toLowerCase()) || type.toLowerCase().contains("CENTER".toLowerCase()) || type.toLowerCase().contains("ONLINE".toLowerCase())) {
            VetScheduleRequest vetScheduleRequest = VetScheduleRequest.builder()
                    .vet_id(vetId)
                    .appointmentType(AppointmentType.valueOf(type)).build();
            log.info("Toi o day ban o dau ");
            return ResponseObject.APIRepsonse(200, "Get Schedule ID Successfully", HttpStatus.OK, vetScheduleService.getScheduleForBooking(vetScheduleRequest));
        } else {
            return ResponseObject.APIRepsonse(404, "Not Found this Type in Appointment_Type", HttpStatus.NOT_FOUND, " ");
        }
    }
    @GetMapping("/getVeterinariansByDateTime")
    public ResponseEntity<ResponseObject> getVeterinariansByDateTime(@RequestParam String type , @RequestParam LocalTime startTime, @RequestParam LocalTime endTime, @RequestParam LocalDate date , @RequestParam String serviceId) {
        VetScheduleRequest vetScheduleRequest = VetScheduleRequest.builder()
                .appointmentType(AppointmentType.valueOf(type))
                .startTime(startTime)
                .endTime(endTime)
                .serviceId(serviceId)
                .date(date)
                .build();
        List<VeterinarianResponse> list = vetScheduleService.getVeterinariansByDateTime(vetScheduleRequest);
        if (!list.isEmpty()) {
            return ResponseObject.APIRepsonse(200, "Veterinarians found successfully By Date Time ", HttpStatus.OK, list);
        } else {
            return ResponseObject.APIRepsonse(404, "Veterinarians not found", HttpStatus.NOT_FOUND, "");
        }
    }


    @GetMapping("/vetschedules")
    public ResponseEntity<ResponseObject> getVetSchedules(@RequestParam String vetId, @RequestParam String serviceId) {
        List<DayResponse> list = vetScheduleService.getVetSchedules(vetId, serviceId);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule found successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Veterinarians schedule not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createVetSchedule(@RequestBody VetScheduleRequest vetScheduleRequest) {
        List<VetScheduleResponse> list = vetScheduleService.createVetScheduleByDate(vetScheduleRequest.getDates(), vetScheduleRequest.getVet_id());
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule CREATE successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(400, "Can't create Veterinarians Schedule Create ", HttpStatus.BAD_REQUEST,"");
        }
    }
    @PostMapping("")
    public ResponseEntity<ResponseObject> createSlot(@RequestBody VetScheduleRequest vetScheduleRequest) {
       VetScheduleResponse list = vetScheduleService.createSlot(vetScheduleRequest);
        if( list != null ){
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule CREATE successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(400, "Can't create Veterinarians Schedule Create ", HttpStatus.BAD_REQUEST,"");
        }
    }
    @PutMapping("/update")
    public ResponseEntity<ResponseObject> updateVetScheduleOfVeterinarian(@RequestBody VetScheduleRequest vetScheduleRequest) {
        vetScheduleRequest.setAppointmentType(AppointmentType.ONLINE);
        List<VetScheduleResponse> list = vetScheduleService.slotDateTime(vetScheduleRequest,"add");
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Update Veterinarians schedule  successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(400, "Can't UPDATE Veterinarians Schedule Create ", HttpStatus.BAD_REQUEST,"");
        }
    }
    @PutMapping("/{scheduleId}/schedules/update")
    public ResponseEntity<ResponseObject> updateDateTime(@PathVariable String scheduleId, @RequestParam int count) {
        if(scheduleId!=null && count!=0 ){
            vetScheduleService.updateDateTime(scheduleId, count);
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule found successfully ", HttpStatus.OK, null);
        }else{
            return ResponseObject.APIRepsonse(404, "Veterinarians schedule not found By VetID and Date ", HttpStatus.NOT_FOUND,"");
        }
    }
    @GetMapping("/{vetId}/schedules/by-date")
    public ResponseEntity<ResponseObject> getScheduleByVetIDandDate(@PathVariable String vetId, @RequestParam LocalDate date) {
        List<VetScheduleResponse> list = vetScheduleService.getScheduleByVetIDandDate(vetId, date);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule found successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Veterinarians schedule not found By VetID and Date ", HttpStatus.NOT_FOUND,"");
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @GetMapping("/{vetId}/schedules")
    public ResponseEntity<ResponseObject> getScheduleByVetId(@PathVariable String vetId) {
        List<VetScheduleResponse> list = vetScheduleService.getScheduleByVetId(vetId);
        if(!list.isEmpty()){
            return ResponseObject.APIRepsonse(200, "Veterinarians schedule found successfully ", HttpStatus.OK, list);
        }else{
            return ResponseObject.APIRepsonse(404, "Veterinarians schedule not found By VetID and Date ", HttpStatus.NOT_FOUND,"");
        }
    }



}
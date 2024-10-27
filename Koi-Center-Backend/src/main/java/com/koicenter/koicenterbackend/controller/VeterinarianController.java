package com.koicenter.koicenterbackend.controller;
import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.request.veterinarian.UpdateVetDescriptionRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VerinarianUpdateRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VeterinarianRequest;
import com.koicenter.koicenterbackend.model.response.PageResponse;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VetDescriptionResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianResponse;
import com.koicenter.koicenterbackend.service.AppointmentService;
import com.koicenter.koicenterbackend.service.VeterinarianService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/v1/veterinarians")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class VeterinarianController {
    VeterinarianService veterinarianService;
    AppointmentService appointmentService;
    @GetMapping("/{vetId}")
    public ResponseEntity<ResponseObject> getVeterinarianById (@PathVariable String vetId){
        VeterinarianResponse veterinarianResponse = veterinarianService.getVeterinarianById(vetId);
        if(veterinarianResponse != null ){
            return ResponseObject.APIRepsonse(200,"Get ID Veterinarian Succesfully ", HttpStatus.OK,veterinarianResponse);
        }else{
            return ResponseObject.APIRepsonse(404, "Veterinarians not found", HttpStatus.NOT_FOUND,"");
        }
    }
    @GetMapping()
    public ResponseEntity<ResponseObject> getAllVeterinarian() {
        List<VeterinarianResponse> listVet = veterinarianService.getAllVet();
        return ResponseObject.APIRepsonse(200, "List of veterinarians retrieved successfully", HttpStatus.OK, listVet);

    }
    @PostMapping()
    public ResponseEntity<ResponseObject> createVeterinarian(@RequestBody VeterinarianRequest veterinarianRequest){
        if(veterinarianRequest != null ){
            veterinarianService.createVeterinarian(veterinarianRequest);
            return ResponseObject.APIRepsonse(200, "CREATE VETERINARIAN SUCCESSFULLY", HttpStatus.OK, " " );
        }else{
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST,"");
        }
    }
    @GetMapping("/getByServiceId")
    public ResponseEntity<ResponseObject> getVeterinarianByServiceId(@RequestParam String serviceId) {
     List<VeterinarianResponse> list =  veterinarianService.getVeterinariansByServiceId(serviceId);
      if(!list.isEmpty()){
          return ResponseObject.APIRepsonse(200, "Veterinarians found successfully", HttpStatus.OK, list);
      }else{
          return ResponseObject.APIRepsonse(404, "Veterinarians not found", HttpStatus.NOT_FOUND,"");
      }
    }
    @GetMapping("/{vetId}/appointments")
    public ResponseEntity<ResponseObject> getAllAppointmentByVetId(@PathVariable String vetId, @RequestParam String status,@RequestParam int offSet , @RequestParam int pageSize,@RequestParam String search) {
        PageResponse<AppointmentResponse> listAppointment = appointmentService.getAllAppointmentByVetId(vetId, status,offSet,pageSize,search);
        if (listAppointment != null && !listAppointment.getContent().isEmpty()) {
            return ResponseObject.APIRepsonse(200, "Success", HttpStatus.OK, listAppointment);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject(404, "No appointments found", null));
        }
    }
    @PutMapping("/{vetId}")
    public ResponseEntity<ResponseObject> updateVeterinarian(@PathVariable String vetId,@RequestBody VerinarianUpdateRequest request) {

        if (request != null) {
            try {
                VeterinarianResponse response = veterinarianService.updateVeterinarian(vetId, request);
                return ResponseObject.APIRepsonse(200, "Update Vet Successfully", HttpStatus.OK, response);
            } catch (AppException e) {
                return ResponseObject.APIRepsonse(404, "Veterinarian not found: " + e.getMessage(), HttpStatus.NOT_FOUND, "");
            } catch (Exception e) {
                return ResponseObject.APIRepsonse(500, "An error occurred while updating veterinarian", HttpStatus.INTERNAL_SERVER_ERROR, "");
            }
        } else {
            return ResponseObject.APIRepsonse(400, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST, "");
        }
    }
    @PutMapping("/description/{vetId}")
    public ResponseEntity<ResponseObject> updateVeterinarianDescription(@PathVariable String vetId,@RequestBody UpdateVetDescriptionRequest request) {

        if (request != null) {
            try {
                VetDescriptionResponse response = veterinarianService.updateVetDescription(vetId, request);
                return ResponseObject.APIRepsonse(200, "Update Vet Description Successfully", HttpStatus.OK, response);
            } catch (AppException e) {
                return ResponseObject.APIRepsonse(404, "Veterinarian not found: " + e.getMessage(), HttpStatus.NOT_FOUND, "");
            } catch (Exception e) {
                return ResponseObject.APIRepsonse(500, "An error occurred while updating veterinarian", HttpStatus.INTERNAL_SERVER_ERROR, "");
            }
        } else {
            return ResponseObject.APIRepsonse(400, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST, "");
        }
    }
}

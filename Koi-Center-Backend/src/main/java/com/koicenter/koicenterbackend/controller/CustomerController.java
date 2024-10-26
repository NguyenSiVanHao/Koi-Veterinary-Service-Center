package com.koicenter.koicenterbackend.controller;


import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Koi;
import com.koicenter.koicenterbackend.model.entity.Pond;
import com.koicenter.koicenterbackend.model.request.user.UpdateUserRequest;
import com.koicenter.koicenterbackend.model.response.PageResponse;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import com.koicenter.koicenterbackend.model.response.pond.PondResponse;
import com.koicenter.koicenterbackend.service.AppointmentService;
import com.koicenter.koicenterbackend.service.CustomerService;
import com.koicenter.koicenterbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private UserService userService;
    @Autowired
    private AppointmentService appointmentService;
    @GetMapping("/{customerId}/kois")
    public ResponseEntity<ResponseObject> getKoisByCustomerId(@PathVariable("customerId") String customerId) {
        try {
            List<KoiResponse> kois = customerService.getKoiByCustomerId(customerId);
            if (kois.isEmpty()) {
                return ResponseObject.APIRepsonse(404, "Customer do not have any koi", HttpStatus.NOT_FOUND, null);
            } else{
                return ResponseObject.APIRepsonse(200, "Found kois successfully", HttpStatus.OK, kois);
            }
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }
    @GetMapping("/{customerId}/ponds")
    public ResponseEntity<ResponseObject> getPondsByCustomerId(@PathVariable("customerId") String customerId) {
        try {
            List<PondResponse> ponds = customerService.getPondsByCustomerId(customerId);
            if (ponds.isEmpty()) {
                return ResponseObject.APIRepsonse(404, "Customer do not have any pond", HttpStatus.NOT_FOUND, null);
            } else{
                return ResponseObject.APIRepsonse(200, "Found ponds successfully", HttpStatus.OK, ponds);}
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }
    // Get appointment by customerId
    @GetMapping("/{customerId}/appointments")
    public ResponseEntity<ResponseObject> getAppointmentById(@PathVariable("customerId") String customerId, @RequestParam String status,@RequestParam int offSet , @RequestParam int pageSize,@RequestParam String search) {
        PageResponse<AppointmentResponse> listAppointment = appointmentService.getAllAppointmentsByCustomerId(customerId, status,offSet,pageSize,search);
        if (listAppointment != null && !listAppointment.getContent().isEmpty()) {
            return ResponseEntity.ok(new ResponseObject(200, "Success", listAppointment));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseObject(404, "No appointments in status " + status, null));
        }
    }
    @PutMapping("")
    public ResponseEntity<ResponseObject> update(@RequestBody UpdateUserRequest updateUserRequest){
        boolean isUpdated = userService.updateCustomer(updateUserRequest);
        if(isUpdated){
            return ResponseObject.APIRepsonse(200, "User updated successfully!", HttpStatus.OK, null);
        }else {
            return ResponseObject.APIRepsonse(404, "User does not exist!", HttpStatus.NOT_FOUND, null);
        }
    }
}

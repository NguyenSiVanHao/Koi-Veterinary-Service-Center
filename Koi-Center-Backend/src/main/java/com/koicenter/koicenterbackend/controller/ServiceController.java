package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Service;
import com.koicenter.koicenterbackend.model.request.service.ServiceRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.service.ServiceResponse;
import com.koicenter.koicenterbackend.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceController {
    @Autowired
    private ServiceService serviceService;

    @GetMapping("") //service_for khac ONLINE
    public ResponseEntity<ResponseObject> getAllServicesNotOnline() {
        List<ServiceResponse> services = serviceService.getAllService();
        return ResponseObject.APIRepsonse(200, "Get service list success", HttpStatus.OK, services);
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ResponseObject> getServiceById(@PathVariable("serviceId") String serviceId) {
        try{
            ServiceResponse service = serviceService.getServiceById(serviceId);
            return ResponseObject.APIRepsonse(200, "Get service success", HttpStatus.OK, service);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }


    @GetMapping("/appointmentType/{serviceFor}")//Appoinment type de lay ra tung servicefor
    public ResponseEntity<ResponseObject> getServiceFor(@PathVariable String serviceFor) {
        if (serviceFor.toLowerCase().equals("CENTER".toLowerCase()) || serviceFor.toLowerCase().equals("HOME".toLowerCase()) || serviceFor.toLowerCase().equals("ONLINE".toLowerCase())) {
            return ResponseObject.APIRepsonse(200, "GET Appointment_Type Successfully", HttpStatus.OK, serviceService.getServiceFor(serviceFor));
        } else {
            return ResponseObject.APIRepsonse(404, "Appointment_Type Not Found ", HttpStatus.NOT_FOUND, "");

        }
    }

    /**
     * create new service by staff
     */
    @PreAuthorize("hasAnyRole('MANAGER')")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createService(@RequestBody ServiceRequest serviceRequest) {
        boolean isCreated = serviceService.createService(serviceRequest);
        if (isCreated) {
            return ResponseObject.APIRepsonse(200, "Create new service successfully", HttpStatus.OK, null);
        } else {
            return ResponseObject.APIRepsonse(409, "Service name already exists", HttpStatus.CONFLICT, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER')")
    @PutMapping("/{serviceId}")
    public ResponseEntity<ResponseObject> updateService(@RequestBody ServiceRequest serviceRequest, @PathVariable("serviceId") String serviceId) {
        boolean isUpdated = serviceService.updateService(serviceRequest, serviceId);
        if (isUpdated) {
            return ResponseObject.APIRepsonse(200, "Update service successfully", HttpStatus.OK, null);
        } else {
            return ResponseObject.APIRepsonse(400, "Failed to update service", HttpStatus.BAD_REQUEST, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER')")
    @DeleteMapping("/delete")
    public ResponseEntity<ResponseObject> deleteService(@RequestParam String serviceId) {
        boolean isDeleted = serviceService.deleteService(serviceId);
        if (isDeleted) {
            return ResponseObject.APIRepsonse(200, "Service deleted successfully", HttpStatus.OK, null);
        } else {
            return ResponseObject.APIRepsonse(404, "Service not found", HttpStatus.NOT_FOUND, null);
        }
    }

}

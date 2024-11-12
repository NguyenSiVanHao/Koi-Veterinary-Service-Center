package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Medicine;
import com.koicenter.koicenterbackend.model.request.prescription.MedicineRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import com.koicenter.koicenterbackend.model.response.medicine.MedicineResponse;
import com.koicenter.koicenterbackend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping()
    public ResponseEntity<ResponseObject> getAllMedicines() {
        try {
            List<MedicineResponse> medicines = medicineService.getAllMedicines();
            return ResponseObject.APIRepsonse(200, "Retrieved all medicines successfully", HttpStatus.OK, medicines);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{medicineId}")
    public ResponseEntity<ResponseObject> getMedicineById(@PathVariable("medicineId") String medicineId) {
        try {
            MedicineResponse medicineResponse = medicineService.getMedicineById(medicineId);
            return ResponseObject.APIRepsonse(200, "Found medicine successfully", HttpStatus.OK, medicineResponse);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @PostMapping()
    public ResponseEntity<ResponseObject> createMedicine(@RequestBody MedicineRequest medicineRequest){
        try{
        MedicineResponse medicine = medicineService.createMedicine(medicineRequest);
        return ResponseObject.APIRepsonse(200,"Create medicine success",HttpStatus.OK,medicine);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @PutMapping("/{medicineId}")
    public ResponseEntity<ResponseObject> updateMedicine(@PathVariable("medicineId") String medicineId, @RequestBody MedicineRequest medicineRequest) {
        try {
            MedicineResponse updatedMedicine = medicineService.updateMedicine(medicineId, medicineRequest);
            return ResponseObject.APIRepsonse(200, "Updated medicine successfully", HttpStatus.OK, updatedMedicine);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, "Medicine Id do not exist", e.getHttpStatus(), null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @DeleteMapping("/{medicineId}")
    public ResponseEntity<ResponseObject> deleteMedicine(@PathVariable("medicineId") String medicineId) {
        try {
            medicineService.deleteMedicine(medicineId);
            return ResponseObject.APIRepsonse(200, "Deleted medicine successfully", HttpStatus.OK, null);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}

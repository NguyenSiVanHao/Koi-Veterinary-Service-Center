package com.koicenter.koicenterbackend.controller;


import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Koi;
import com.koicenter.koicenterbackend.model.request.koi.KoiRequest;
import com.koicenter.koicenterbackend.model.request.koi.KoiUpdateRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import com.koicenter.koicenterbackend.service.CustomerService;
import com.koicenter.koicenterbackend.service.KoiService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kois")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class    KoiController {

    @Autowired
    private KoiService koiService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllPond() {
        try {
            List<Koi> koi = koiService.getAllKoi();
            return ResponseObject.APIRepsonse(200, "Get koi list success", HttpStatus.OK, koi);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{koiId}")
    public ResponseEntity<ResponseObject> getPondById(@PathVariable("koiId") String koiId) {
        try {
            KoiResponse koi = koiService.getKoiById(koiId);
            return ResponseObject.APIRepsonse(200, "Found koi successfully", HttpStatus.OK, koi);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }

    @PutMapping("/{koiId}")
    public ResponseEntity<ResponseObject> updatePond(@PathVariable("koiId") String koiId, @Valid @RequestBody KoiUpdateRequest request) {
        try {
            KoiResponse updatedKoi = koiService.updateKoi(koiId, request);
            return ResponseObject.APIRepsonse(200, "Update success", HttpStatus.OK, updatedKoi);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        }
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> createKoi (@RequestBody KoiRequest koiRequest){
        if(koiRequest != null ){
            return ResponseObject.APIRepsonse(200, "KOI create successfully!", HttpStatus.CREATED,  koiService.createKoi(koiRequest));
        }else{
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST,"");
        }
    }


    @DeleteMapping("/{koiId}")
    public ResponseEntity<ResponseObject> deleteKoi(@PathVariable("koiId") String koiId) {
        try {
            koiService.deleteKoi(koiId);
            return ResponseObject.APIRepsonse(200, "Deleted koi successfully", HttpStatus.OK, null);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}

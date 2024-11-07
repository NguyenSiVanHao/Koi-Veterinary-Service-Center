package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Faq;
import com.koicenter.koicenterbackend.model.request.Faq.FaqRequest;
import com.koicenter.koicenterbackend.model.request.delivery.DeliveryRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.delivery.DeliveryResponse;
import com.koicenter.koicenterbackend.service.FaqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/faqs")
public class FaqController {
    @Autowired
    private FaqService faqService;

    @PostMapping
    public ResponseEntity<ResponseObject> createFaq(@RequestBody FaqRequest faq) {
        if(faq != null ){

            return ResponseObject.APIRepsonse(200, "Faq create successfully!", HttpStatus.CREATED,  faqService.createFaq(faq));
        }else{
            return ResponseObject.APIRepsonse(404, "Bad Request: Invalid data", HttpStatus.BAD_REQUEST,"");
        }
    }

    @GetMapping()
    public ResponseEntity<ResponseObject> getAllFaqs() {
        try {
            List<Faq> faqs = faqService.getAllFaqs();
            return ResponseObject.APIRepsonse(200, "Retrieved all faqs successfully", HttpStatus.OK, faqs);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @PutMapping("/{faqId}")
    public ResponseEntity<ResponseObject> updateFaq(@PathVariable("faqId") String faqId, @RequestBody FaqRequest faqRequest) {
        try {
            Faq updatedFaq = faqService.updateFaq(faqId, faqRequest);
            return ResponseObject.APIRepsonse(200, "Updated faq successfully", HttpStatus.OK, updatedFaq);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, "Faq ID do not exist", e.getHttpStatus(), null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{faqId}")
    public ResponseEntity<ResponseObject> getFaqById(@PathVariable("faqId") String faqId) {
        try {
            Optional<Faq> faq = faqService.getFaqById(faqId);
            return ResponseObject.APIRepsonse(200, "Found faq successfully", HttpStatus.OK, faq);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, "Faq do not exist", HttpStatus.NOT_FOUND, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @DeleteMapping("/{faqId}")
    public ResponseEntity<ResponseObject> deleteFaq(@PathVariable("faqId") String faqId) {
        try {
            faqService.deleteFaq(faqId);
            return ResponseObject.APIRepsonse(200, "Deleted faq successfully", HttpStatus.OK, null);
        } catch (AppException e) {
            return ResponseObject.APIRepsonse(404, e.getMessage(), HttpStatus.NOT_FOUND, null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}

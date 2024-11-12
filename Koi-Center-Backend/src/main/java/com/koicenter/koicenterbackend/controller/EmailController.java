package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.request.email.EmailRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.service.SendEmalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mail")
public class EmailController {

    @Autowired
    SendEmalService sendEmalService;

    @PostMapping("/sendEmail")
    public ResponseEntity<ResponseObject> sendEmail(@RequestBody EmailRequest emailRequest) {
       boolean isSent =  sendEmalService.sendMailSender(emailRequest.getRecipient(), emailRequest.getBody(), emailRequest.getSubject());
        if (isSent) {
            return ResponseObject.APIRepsonse(200, "Email has been successfully sent. Please check your mail.", HttpStatus.OK, "");
        } else {
            return ResponseObject.APIRepsonse(400, "Failed to send email.", HttpStatus.BAD_REQUEST, "");
        }
    }
}

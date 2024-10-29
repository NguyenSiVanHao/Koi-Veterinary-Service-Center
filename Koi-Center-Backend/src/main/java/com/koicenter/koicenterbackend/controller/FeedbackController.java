package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.entity.News;
import com.koicenter.koicenterbackend.model.request.feedback.FeedbackRequest;
import com.koicenter.koicenterbackend.model.request.news.NewsRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.feedback.FeedbackResponse;
import com.koicenter.koicenterbackend.service.FeedbackService;
import com.koicenter.koicenterbackend.service.NewsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class FeedbackController {


    FeedbackService feedbackService;

    @PostMapping("/{appointmentId}")
    public ResponseEntity<ResponseObject> createFeedBackByAppointmentId(@PathVariable String appointmentId,@RequestBody FeedbackRequest feedbackRequest) {
       FeedbackResponse feedbackResponse = feedbackService.createFeebackByAppointmentId(appointmentId,feedbackRequest);
        if(feedbackResponse == null ){
            return ResponseObject.APIRepsonse(401, "CAN NOT PROVIDE FEEDBACK", HttpStatus.BAD_REQUEST, null);
        }
        return ResponseObject.APIRepsonse(201, "CREATE FEEBACK successfully", HttpStatus.CREATED, feedbackResponse);
    }
    @GetMapping("/{serviceId}/total")
    public ResponseEntity<ResponseObject> getTotalRatingByServiceId(@PathVariable String serviceId) {
        FeedbackResponse feedbackResponse = feedbackService.getTotalRatingByServiceId(serviceId);
        if(feedbackResponse == null ){
            return ResponseObject.APIRepsonse(404, "Found can not FEEDBACK BY SERVICE", HttpStatus.NOT_FOUND, null);
        }
        return ResponseObject.APIRepsonse(200, "Found Sum  FEEBACK successfully", HttpStatus.OK, feedbackResponse);
    }
    @GetMapping("/{serviceId}")
    public ResponseEntity<ResponseObject> getFeedbackListByServiceId(@PathVariable String serviceId) {
        List<FeedbackResponse> feedbackResponse = feedbackService.getFeedbackListByServiceId(serviceId);
        return ResponseObject.APIRepsonse(200, " FEEBACK successfully", HttpStatus.OK, feedbackResponse);
    }


}

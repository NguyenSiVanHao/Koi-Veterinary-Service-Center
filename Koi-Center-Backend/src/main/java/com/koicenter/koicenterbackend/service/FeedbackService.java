package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.UserMapper;
import com.koicenter.koicenterbackend.mapper.feedback.FeedbackMapper;
import com.koicenter.koicenterbackend.model.entity.Appointment;
import com.koicenter.koicenterbackend.model.entity.Feedback;
import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.entity.Veterinarian;
import com.koicenter.koicenterbackend.model.enums.Role;
import com.koicenter.koicenterbackend.model.enums.VeterinarianStatus;
import com.koicenter.koicenterbackend.model.request.feedback.FeedbackRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VeterinarianRequest;
import com.koicenter.koicenterbackend.model.response.feedback.FeedbackResponse;
import com.koicenter.koicenterbackend.model.response.user.UserResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianResponse;
import com.koicenter.koicenterbackend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {
    FeedbackMapper feedbackMapper ;
    FeedbackRepository feedbackRepository ;
    AppointmentRepository appointmentRepository ;
    ServicesRepository servicesRepository ;
    UserRepository userRepository ;
    UserMapper userMapper;
    public FeedbackResponse createFeebackByAppointmentId(String appointmentId , FeedbackRequest feedbackRequest) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND));
        if (feedbackRequest.getStar()>=0 && feedbackRequest.getStar()<=5) {
            Feedback feedback = feedbackMapper.toFeedback(feedbackRequest);
            feedback.setAppointment(appointment);
            feedbackRepository.save(feedback);
            return feedbackMapper.toFeedbackResponse(feedback);
        }else {
            throw new AppException(
                    ErrorCode.STAR_NOT_EXISTS.getCode(),
                    ErrorCode.STAR_NOT_EXISTS.getMessage(),
                    HttpStatus.BAD_REQUEST);
        }
    }
    public FeedbackResponse getTotalRatingByServiceId(String serviceId) {
        com.koicenter.koicenterbackend.model.entity.Service service = servicesRepository.findById(serviceId).orElseThrow(() -> new AppException(
                ErrorCode.SERVICE_NOT_EXITS.getCode(),
                ErrorCode.SERVICE_NOT_EXITS.getMessage(),
                HttpStatus.NOT_FOUND ));
        int count = 0 ;
        float sumStar = 0 ;
        List<Appointment> appointments = appointmentRepository. findAllByService_ServiceId(service.getServiceId());
        if (!appointments.isEmpty()) {

            for (Appointment appointment : appointments) {
                log.info(appointment.getAppointmentId());
                Feedback feedback = feedbackRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
                if (feedback != null && appointment.getCustomer().getUser().isStatus()) {
                    sumStar += feedback.getStar();
                    count++;
                }
            }
        }else {
            throw new AppException(
                    ErrorCode.APPOINTMENT_NOT_FOUND.getCode(),
                    ErrorCode.APPOINTMENT_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND);
        }
        float averageStar = (count > 0) ? (float) sumStar / count : 0;
        FeedbackResponse feedbackResponse = FeedbackResponse.builder()
                .averageStar(averageStar)
                .number(count)
                .build();

    return feedbackResponse ;
    }
    public List<FeedbackResponse> getFeedbackListByServiceId(String serviceId) {
        com.koicenter.koicenterbackend.model.entity.Service service = servicesRepository.findById(serviceId).orElseThrow(() -> new AppException(
                ErrorCode.SERVICE_NOT_EXITS.getCode(),
                ErrorCode.SERVICE_NOT_EXITS.getMessage(),
                HttpStatus.NOT_FOUND ));
        List<FeedbackResponse> feedbackResponses = new ArrayList<>();
        List<Appointment> appointments = appointmentRepository. findAllByService_ServiceId(service.getServiceId());
        if (!appointments.isEmpty()) {
            for (Appointment appointment : appointments) {
                                    log.info("feedback ID : "+ appointment.getAppointmentId());

                UserResponse userResponse = new UserResponse();
                User user = userRepository.findById(appointment.getCustomer().getUser().getUserId()).orElseThrow(() -> new AppException(
                        ErrorCode.USER_ID_NOT_EXITS.getCode(),
                        ErrorCode.USER_ID_NOT_EXITS.getMessage(),
                        HttpStatus.NOT_FOUND
                ));
                if(user.isStatus()) {
                    Feedback feedback = feedbackRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
//                    log.info("feedback ID : "+ feedback.getFeedbackId());
                    if (feedback !=null ) {
                        FeedbackResponse feedbackResponse = feedbackMapper.toFeedbackResponse(feedback);
                        feedbackResponse.setUserResponse(userMapper.toUserResponse(user));
                        feedbackResponses.add(feedbackResponse);
                    }
                }else{
                    throw new AppException(
                            ErrorCode.USER_FALSE.getCode(),
                            ErrorCode.USER_FALSE.getMessage(),
                            HttpStatus.NOT_FOUND);
                }
            }
        }else {
            throw new AppException(
                    ErrorCode.APPOINTMENT_NOT_FOUND.getCode(),
                    ErrorCode.APPOINTMENT_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND);
        }
        return feedbackResponses ;
    }

}



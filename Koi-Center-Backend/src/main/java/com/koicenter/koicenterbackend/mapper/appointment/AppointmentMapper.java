package com.koicenter.koicenterbackend.mapper.appointment;

import com.koicenter.koicenterbackend.model.entity.Appointment;
import com.koicenter.koicenterbackend.model.entity.Koi;
import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping( target = "customer",ignore = true)
    @Mapping( target = "veterinarian",ignore = true)
    @Mapping(target = "service" , ignore = true)
//    @Mapping(target = "depositedMoney", ignore = true)
    @Mapping(target = "result", ignore = true)
    @Mapping(target = "code",ignore = true)
  Appointment toAppointment(AppointmentRequest appointmentRequest);


    @Mapping(source = "appointment.customer.customerId" , target = "customerId")
    @Mapping(source = "appointment.customer.user.fullName" ,target = "customerName")
    @Mapping(source = "appointment.service.serviceId",target = "serviceId")
    @Mapping(source = "appointment.service.serviceName",target = "serviceName")
    @Mapping(source = "appointment.code" , target = "code")
    AppointmentResponse toAppointmentResponse(Appointment appointment);


}

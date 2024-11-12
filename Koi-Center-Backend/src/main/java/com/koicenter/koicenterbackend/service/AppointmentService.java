package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.appointment.AppointmentMapper;
import com.koicenter.koicenterbackend.model.entity.*;
import com.koicenter.koicenterbackend.model.enums.AppointmentStatus;
import com.koicenter.koicenterbackend.model.enums.AppointmentType;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VetScheduleRequest;
import com.koicenter.koicenterbackend.model.response.PageResponse;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VetScheduleResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianResponse;
import com.koicenter.koicenterbackend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.Async;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;
    CustomerRepository customerRepository;
    ServicesRepository servicesRepository;
    VeterinarianRepository veterinarianRepository;
    AppointmentMapper appointmentMapper;
    VetScheduleService vetScheduleService;
    UserRepository userRepository;
    InvoiceRepository invoiceRepository;

    public PageResponse<AppointmentResponse> getAllAppointmentsByCustomerId(String customerId, String status, int offset, int pageSize,String search) {
        List<Appointment> appointments = appointmentRepository.findByCustomer_CustomerIdOrderByCreatedAtDesc(customerId);
        List<AppointmentResponse> appointmentResponses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            if (appointment.getStatus().name().equals(status) || status.equals("ALL")) {
                AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                if(appointment.getVeterinarian()!=null) {
                    response.setVetId(appointment.getVeterinarian().getVetId());
                    response.setVetName(appointment.getVeterinarian().getUser().getFullName());
                }
                appointmentResponses.add(response);
            }
        }
        appointmentResponses = filterBySearch(appointmentResponses,search,AppointmentResponse::getServiceName);
        return paginateAppointments(appointmentResponses,offset,pageSize);
    }
    public AppointmentResponse getAppointmentByAppointmentId(String appointmentId) {
        AppointmentResponse appointmentResponses;
        Appointment appointment = appointmentRepository.findAppointmentById(appointmentId);

        AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
        if (appointment.getVeterinarian() != null) {
            response.setPhone(appointment.getCustomer().getPhone());
            response.setVetId(appointment.getVeterinarian().getVetId());
            response.setVetName(appointment.getVeterinarian().getUser().getFullName());
        }
        return response;
    }
    public PageResponse<AppointmentResponse> getAllAppointmentByVetId(String vetId, String status,int offset, int pageSize,String search) {
        List<Appointment> appointments = appointmentRepository.findByVeterinarian_VetIdOrderByCreatedAtDesc(vetId);
        List<AppointmentResponse> appointmentResponses = new ArrayList<>();

        if (appointments == null) { // Thêm kiểm tra null
            throw new AppException(ErrorCode.SERVICE_NOT_EXITS.getCode(), "No appointments found", HttpStatus.NOT_FOUND);
        }

        for (Appointment appointment : appointments) {
            if (appointment.getStatus().name().equals(status) || status.equals("ALL")) {
                AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                appointmentResponses.add(response);
            }
        }
        appointmentResponses=filterBySearch(appointmentResponses,search,AppointmentResponse::getCustomerName);
        return paginateAppointments(appointmentResponses,offset,pageSize);
    }

    //CREATE APPOINTMENT
    public AppointmentResponse createAppointment(AppointmentRequest appointmentRequest) {
        Customer customer = customerRepository.findByCustomerId(appointmentRequest.getCustomerId());
        Veterinarian veterinarian = null;
        if (!appointmentRequest.getVetId().equalsIgnoreCase("SKIP")) {
            veterinarian = veterinarianRepository.findByVetId(appointmentRequest.getVetId());
            VetScheduleRequest vetScheduleRequest = VetScheduleRequest.builder()
                    .vet_id(appointmentRequest.getVetId())
                    .endTime(appointmentRequest.getEndTime())
                    .startTime(appointmentRequest.getStartTime())
                    .date(appointmentRequest.getAppointmentDate())
                    .appointmentType(appointmentRequest.getType())
                    .build();
            vetScheduleService.slotDateTime(vetScheduleRequest, "add");
        }
        com.koicenter.koicenterbackend.model.entity.Service service = servicesRepository.findByServiceId(appointmentRequest.getServiceId());
        log.info("service ID " + service.getServiceId());
        Appointment appointment = new Appointment();
        appointment = appointmentMapper.toAppointment(appointmentRequest);
        if (appointmentRequest.getResult() == null) {
            appointment.setResult(null);
        } else {
            appointment.setResult(appointmentRequest.getResult());
        }
        appointment.setCustomer(customer);
        appointment.setVeterinarian(veterinarian);
        appointment.setService(service);
        appointment.setCode(getCode(appointmentRequest.getType()));
        appointmentRepository.save(appointment);
        AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
        appointmentResponse.setCustomerId(appointment.getCustomer().getCustomerId());
        appointmentResponse.setServiceId(appointment.getService().getServiceId());
        log.info("appoimtID" + appointmentResponse.getAppointmentId());
        if (appointment.getVeterinarian() != null) {
            appointmentResponse.setVetId(appointment.getVeterinarian().getVetId());
        } else {
            appointmentResponse.setVetId("SKIP");
        }
        return appointmentResponse;
    }

    public AppointmentResponse updateAppointment(AppointmentRequest appointmentRequest) {
        Appointment appointment = appointmentRepository.findAppointmentById(appointmentRequest.getAppointmentId());
        if (appointment != null) {
            LocalDate date = appointmentRequest.getAppointmentDate();
            LocalTime startTime = appointmentRequest.getStartTime();
            LocalTime endTime = appointmentRequest.getEndTime();
            String vetId = appointmentRequest.getVetId();
            Customer customer = customerRepository.findByCustomerId(appointmentRequest.getCustomerId());
            Veterinarian veterinarian = null;
            if (appointmentRequest.getVetId() != null) {
                veterinarian = veterinarianRepository.findByVetId(appointmentRequest.getVetId());
                log.info("vetId " + veterinarian.getVetId());
            }

            com.koicenter.koicenterbackend.model.entity.Service service = servicesRepository.findByServiceId(appointmentRequest.getServiceId());

            if (appointment.getAppointmentDate().equals(date) && appointment.getStartTime().equals(startTime) && appointment.getEndTime().equals(endTime) && appointment.getVeterinarian() == null || !appointment.getAppointmentDate().equals(date) && appointment.getVeterinarian() == null || !appointment.getStartTime().equals(startTime) && appointment.getVeterinarian() == null || !appointment.getEndTime().equals(endTime) && appointment.getVeterinarian() == null) {
                log.info("If 1 ");
                VetScheduleRequest vetScheduleRequest1 = VetScheduleRequest.builder()
                        .vet_id(appointmentRequest.getVetId())
                        .startTime(appointmentRequest.getStartTime())
                        .endTime(appointmentRequest.getEndTime())
                        .date(appointmentRequest.getAppointmentDate())
                        .appointmentType(appointmentRequest.getType())
                        .build();
                List<VetScheduleResponse> vetScheduleResponse = vetScheduleService.slotDateTime(vetScheduleRequest1, "add");
            } else if (appointment.getAppointmentDate().equals(date) && appointment.getStartTime().equals(startTime) && appointment.getEndTime().equals(endTime) && appointment.getVeterinarian().getVetId().equals(vetId)) {
                //NEU KHONG DOI THOI GIAN , KHONG DOI BAC SI
                log.info("If2 ");
            } else if (appointmentRequest.getType().equals(AppointmentStatus.CANCEL) || !appointment.getAppointmentDate().equals(date) && appointmentRequest.getVetId() == null || !appointment.getStartTime().equals(startTime) && appointmentRequest.getVetId() == null || !appointment.getEndTime().equals(endTime) && appointmentRequest.getVetId() == null) {
                log.info("If3 ");
                if (appointment.getVeterinarian() != null) {
                    VetScheduleRequest vetScheduleRequest = VetScheduleRequest.builder()
                            .vet_id(appointment.getVeterinarian().getVetId())
                            .endTime(appointment.getEndTime())
                            .startTime(appointment.getStartTime())
                            .date(appointment.getAppointmentDate())
                            .appointmentType(appointment.getType())
                            .build();
                    List<VetScheduleResponse> vetScheduleResponse = vetScheduleService.slotDateTime(vetScheduleRequest, "less");
                }
            } else if (!appointment.getAppointmentDate().equals(date) || !appointment.getStartTime().equals(startTime) || !appointment.getEndTime().equals(endTime) || !appointment.getVeterinarian().getVetId().equals(vetId)) {
                log.info("if 4 ");
                VetScheduleRequest vetScheduleRequest = VetScheduleRequest.builder()
                        .vet_id(appointment.getVeterinarian().getVetId())
                        .endTime(appointment.getEndTime())
                        .startTime(appointment.getStartTime())
                        .date(appointment.getAppointmentDate())
                        .appointmentType(appointment.getType())
                        .build();
                List<VetScheduleResponse> vetScheduleResponse = vetScheduleService.slotDateTime(vetScheduleRequest, "less");
                VetScheduleRequest vetScheduleRequest1 = VetScheduleRequest.builder()
                        .vet_id(appointmentRequest.getVetId())
                        .startTime(appointmentRequest.getStartTime())
                        .endTime(appointmentRequest.getEndTime())
                        .date(appointmentRequest.getAppointmentDate())
                        .appointmentType(appointmentRequest.getType())
                        .build();
                vetScheduleService.slotDateTime(vetScheduleRequest1, "add");
            }

            appointment = appointmentMapper.toAppointment(appointmentRequest);
            if (appointmentRequest.getVetId() != null) {
                appointment.setVeterinarian(veterinarian);
            }
            if (appointmentRequest.getResult() != null) {
                appointment.setResult(appointmentRequest.getResult());
            }
            if (appointmentRequest.getCode() != null) {
                appointment.setCode(appointmentRequest.getCode());
            }
            if (appointmentRequest.getCreatedAt() != null) {
                appointment.setCreatedAt(appointmentRequest.getCreatedAt());
            }
            appointment.setCustomer(customer);
            appointment.setService(service);

            appointmentRepository.save(appointment);
//appointment.getCode()

            AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
            appointmentResponse.setCustomerId(appointment.getCustomer().getCustomerId());

            if (appointmentRequest.getVetId() != null) {
                appointmentResponse.setVetId(appointmentRequest.getVetId());
            }
            appointmentResponse.setServiceId(appointment.getService().getServiceId());
            return appointmentResponse;
        } else {
            throw new AppException(
                    ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                    ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND);
        }
    }

    public PageResponse<AppointmentResponse> getAllAppointments(String status, int offset, int pageSize,String search) {
        List<Appointment> appointments = new ArrayList<>();
        List<AppointmentResponse>appointmentResponses = new ArrayList<>();
        if (status.equalsIgnoreCase("ALL")) {
            appointments = appointmentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else {//PageRequest.of()
            appointments = appointmentRepository.findByStatusOrderByCreatedAtDesc(AppointmentStatus.valueOf(status));
        }
        for (Appointment appointment : appointments) {
            if (appointment.getStatus().name().equals(status) || status.equals("ALL")) {
                AppointmentResponse response = appointmentMapper.toAppointmentResponse(appointment);
                if (appointment.getVeterinarian() != null) {
                    response.setVetId(appointment.getVeterinarian().getVetId());
                    response.setVetName(appointment.getVeterinarian().getUser().getFullName());
                }
                appointmentResponses.add(response);
            }
        }
        appointmentResponses = filterBySearch(appointmentResponses,search,AppointmentResponse::getCustomerName);
        return paginateAppointments(appointmentResponses,offset,pageSize);
    }
    private String getCode(AppointmentType appointmentType) {
        List<Appointment> appointments = appointmentRepository.findAll();
        int count = 1;
        String aphabet = "";
        if (appointmentType.equals(AppointmentType.HOME))
            aphabet = "H";
        else if (appointmentType.equals(AppointmentType.CENTER))
            aphabet = "C";
        else
            aphabet = "O";

        for (Appointment appointment : appointments) {
            count++;
        }
        return aphabet + count;
    }

    public List<AppointmentResponse> getAppointmentByUserName(String full_name) {
        List<Appointment> appointments = new ArrayList<>();
        if (full_name != null) {
            User user = userRepository.findByFullName(full_name);
            if (user != null) {
                Customer customer = customerRepository.findByUser_UserId(user.getUserId());
                if (customer != null) {
                    appointments = appointmentRepository.findAllByCustomerId(customer.getCustomerId());
                } else {
                    throw new AppException(ErrorCode.CUSTOMER_NOT_FOUND.getCode(), ErrorCode.CUSTOMER_NOT_FOUND.getMessage(), HttpStatus.NOT_FOUND);
                }
            } else {
                throw new AppException(ErrorCode.USER_NOT_EXISTS.getCode(), ErrorCode.USER_NOT_EXISTS.getMessage(), HttpStatus.NOT_FOUND);
            }
        } else {
            appointments = appointmentRepository.findAll();
        }


        List<AppointmentResponse> appointmentResponses = new ArrayList<>();
        for (Appointment appointment : appointments) {
            appointmentResponses.add(appointmentMapper.toAppointmentResponse(appointment));
        }
        return appointmentResponses;
    }

    public List<AppointmentResponse> getAppointmentByVetId(String vetId, LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByVeterinarian_VetIdAndAppointmentDate(vetId, date);
        List<AppointmentResponse> appointmentResponses = new ArrayList<>();
        if (appointments != null) {
            for (Appointment appointment : appointments) {
                appointmentResponses.add(appointmentMapper.toAppointmentResponse(appointment));
            }
        } else {
            throw new AppException(ErrorCode.APPOINTMENT_NOT_FOUND.getCode(),
                    ErrorCode.APPOINTMENT_NOT_FOUND.getMessage(),
                    HttpStatus.NOT_FOUND);
        }
        return appointmentResponses;
    }

    public AppointmentResponse updateAppointmentBecomeCannel(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow((() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND)));
        appointment.setStatus(AppointmentStatus.CANCEL);
        appointmentRepository.save(appointment);
        Veterinarian veterinarian = veterinarianRepository.findById(appointment.getVeterinarian().getVetId()).orElseThrow((() -> new AppException(
                ErrorCode.VETSCHEDULE_NOT_FOUND.getCode(),
                ErrorCode.VETSCHEDULE_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND
        )));
        if (veterinarian != null) {
            VetScheduleRequest vetScheduleRequest1 = VetScheduleRequest.builder()
                    .vet_id(appointment.getVeterinarian().getVetId())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .date(appointment.getAppointmentDate())
                    .appointmentType(appointment.getType())
                    .build();
            vetScheduleService.slotDateTime(vetScheduleRequest1, "less");
        }
        AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
        return appointmentResponse;
    }

    public AppointmentResponse updateAppointmentBecomeRefund(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow((() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND)));
        appointment.setStatus(AppointmentStatus.REFUND);
        appointmentRepository.save(appointment);
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentIdAndType(appointmentId, InvoiceType.First);
        invoice.setStatus(PaymentStatus.Refund);
        invoiceRepository.save(invoice);
        AppointmentResponse appointmentResponse = appointmentMapper.toAppointmentResponse(appointment);
        return appointmentResponse;
    }
    private List<AppointmentResponse> filterBySearch(List<AppointmentResponse> appointments, String search , Function<AppointmentResponse,String> getNameFunction){
        List<AppointmentResponse> appointmentResponses = new ArrayList<>();

        if(search == null || search.trim().isEmpty()){
            return appointments ;
        }else {
            for ( AppointmentResponse appointmentResponse : appointments ) {
                if(appointmentResponse.getCode().toUpperCase().equals(search.toUpperCase())){
                    return List.of(appointmentResponse);
                } else if ( StringUtils.stripAccents(getNameFunction.apply(appointmentResponse).toLowerCase()).contains(StringUtils.stripAccents(search.toLowerCase()))) {
                    appointmentResponses.add(appointmentResponse);
                }
            }
        }
        return appointmentResponses ;
    }
    private PageResponse<AppointmentResponse> paginateAppointments (List<AppointmentResponse> appointmentResponses,int offSet ,int pageSize){
        Pageable pageable = PageRequest.of(offSet-1, pageSize).withSort(Sort.by(Sort.Direction.DESC, "createdAt"));
        int totalItems  = appointmentResponses.size();
        int totalElements = pageSize;
        int totalPages = (totalItems + pageSize - 1) / pageSize;
        Integer start = (int) pageable.getOffset();
        int end = Math.min(start + pageSize, totalItems);
        if (start > totalItems) {
            return new PageResponse<>(new ArrayList<>(), (int) Math.ceil((double) appointmentResponses.size() / pageSize), offSet, 0, pageSize);
        }
        appointmentResponses = appointmentResponses.subList(start, end);
        return new PageResponse<>(appointmentResponses,totalPages,offSet,totalItems,totalElements);
    }

    @Scheduled(fixedRate = 300000)
    private void checkAppointments() {
        LocalDate day = LocalDate.now();
        List<Appointment> appointmentsList = appointmentRepository.findByAppointmentDate(day);
        LocalTime endTime = LocalTime.now();
        for (Appointment appointment : appointmentsList){
            if (endTime.isAfter(appointment.getEndTime()) && appointment.getStatus().equals(AppointmentStatus.BOOKING_COMPLETE)) {
                appointment.setStatus(AppointmentStatus.CANCEL);
                appointmentRepository.save(appointment);
            }
        }
    }
}



package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.invoice.InvoiceMapper;
import com.koicenter.koicenterbackend.model.entity.*;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import com.koicenter.koicenterbackend.model.request.invoice.InvoiceRequest;
import com.koicenter.koicenterbackend.model.response.invoice.CheckOutResponse;
import com.koicenter.koicenterbackend.model.response.invoice.DashboardResponse;
import com.koicenter.koicenterbackend.model.response.invoice.InvoiceResponse;
import com.koicenter.koicenterbackend.model.response.invoice.ServiceCount;
import com.koicenter.koicenterbackend.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.loader.ast.spi.Loadable;
import org.hibernate.validator.internal.constraintvalidators.bv.time.futureorpresent.FutureOrPresentValidatorForYearMonth;
import org.springdoc.core.customizers.SpecPropertiesCustomizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceService {
    InvoiceRepository invoiceRepository;
    AppointmentRepository appointmentRepository;
    KoiTreatmentRepository koiTreatmentRepository;
    PondTreatmentRepository pondTreatmentRepository;
    private final CreateOrderMoMo createOrderMoMo;
    private final InvoiceMapper invoiceMapper;
    DeliveryRepository deliveryRepository;

    public List<InvoiceResponse> getInvoiceByAppointmentId(String appointmentId) {
        List<Invoice> invoices = invoiceRepository.findByAppointment_AppointmentId(appointmentId);
        List<InvoiceResponse> invoiceResponses = new ArrayList<>();
        for (Invoice invoice : invoices) {
            invoiceResponses.add(InvoiceResponse.builder()
                    .totalPrice(invoice.getTotalPrice())
                    .status(invoice.getStatus())
                    .createAt(invoice.getCreateAt())
                    .invoiceId(invoice.getInvoiceId())
                    .type(invoice.getType())
                    .unitPrice(invoice.getUnitPrice())
                    .build());

        }
        return invoiceResponses;
    }
    public InvoiceResponse updateInvoice(String invoiceId, InvoiceRequest invoiceRequest) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new AppException(
                ErrorCode.INVOICE_ID_NOT_FOUND.getCode(),
                ErrorCode.INVOICE_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND));
        Appointment appointment = appointmentRepository.findById(invoiceRequest.getAppointmentId()).orElseThrow(() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage()
                , HttpStatus.NOT_FOUND));
        if (invoiceRequest.getCreateAt() != null) {
            invoice.setCreateAt(invoiceRequest.getCreateAt());
        }
        invoice.setTotalPrice(invoiceRequest.getTotalPrice());
        invoice.setStatus(invoiceRequest.getStatus());
        invoice.setAppointment(appointment);
        invoice.setType(invoiceRequest.getType());
        invoice.setUnitPrice(invoiceRequest.getUnitPrice());
        invoiceRepository.save(invoice);
        return InvoiceResponse.builder()
                .type(invoice.getType())
                .totalPrice(invoice.getTotalPrice())
                .status(invoice.getStatus())
                .createAt(invoice.getCreateAt())
                .invoiceId(invoice.getInvoiceId())
                .unitPrice(invoice.getUnitPrice())
                .build();
    }
    public List<DashboardResponse> getDashBoard(LocalDate starTime, LocalDate endTime, String time) {
        int countAppointment = 0;
        int countKoi = 0;
        int countPond = 0;
        Double totalPrice = 0.0;
        validationTimeRange(starTime,endTime,time);
        List<DashboardResponse> dashboardResponses = new ArrayList<>();
        if (time.toLowerCase().equals("month")) {
                for (LocalDate month = starTime; !month.isAfter(endTime); month = month.plusMonths(1)) {
                    int year = month.getYear();
                    countAppointment = appointmentRepository.countAppointmentsByMonth(month.getMonthValue(), year);
                    countKoi = appointmentRepository.countKoiTreatmentByMonth(month.getMonthValue(), year);
                    countPond = appointmentRepository.countPondTreatmentByMonth(month.getMonthValue(), year);
                    totalPrice = appointmentRepository.sumTotalPriceByMonth(month.getMonthValue(), year);
                    if (totalPrice == null) {
                        totalPrice = 0.0;
                    }
                    DashboardResponse dashboardResponse = DashboardResponse.builder()
                            .totalAppointment(countAppointment)
                            .totalKoi(countKoi)
                            .totalPond(countPond)
                            .totalRevenue(totalPrice)
                            .date(month)
                            .year(Year.of(month.getYear()))
                            .build();
                    dashboardResponses.add(dashboardResponse);
                }
        }
        if (time.toLowerCase().equals("year")) {
                for (LocalDate year = starTime; !year.isAfter(endTime); year = year.plusYears(1)) {
                    //int year = starTime ; year <= endTime ;year++
                    countAppointment = appointmentRepository.countAppointmentsByYear(year.getYear());
                    countKoi = appointmentRepository.countKoiTreatmentByYear(year.getYear());
                    countPond = appointmentRepository.countPondTreatmentByYear(year.getYear());
                    totalPrice = appointmentRepository.sumTotalPriceByYear(year.getYear());
                    if (totalPrice == null) {
                        totalPrice = 0.0;
                    }
                    DashboardResponse dashboardResponse = DashboardResponse.builder()
                            .totalAppointment(countAppointment)
                            .totalKoi(countKoi)
                            .totalPond(countPond)
                            .totalRevenue(totalPrice)
                            .date(year)
                            .year(Year.of(year.getYear()))
                            .build();
                    dashboardResponses.add(dashboardResponse);
                }

        }
        if (time.toLowerCase().equals("day")) {
            for (LocalDate date = starTime; !date.isAfter(endTime); date = date.plusDays(1)) {
                countAppointment = appointmentRepository.countAppointmentsByDate(date.toString());
                countKoi = appointmentRepository.countKoiTreatmentByDate(date.toString());
                countPond = appointmentRepository.countPondTreatmentByDate(date.toString());
                totalPrice = appointmentRepository.sumTotalPriceByDate(date.toString());
//                    ServiceCount serviceCount = appointmentRepository.countAppointmentOfService(date.toString());
                if (totalPrice == null) {
                    totalPrice = 0.0;
                }
                DashboardResponse dashboardResponse = DashboardResponse.builder()
                        .totalAppointment(countAppointment)
                        .totalKoi(countKoi)
                        .totalPond(countPond)
                        .totalRevenue(totalPrice)
                        .date(date)
                        .build();
                dashboardResponses.add(dashboardResponse);
            }
        }
        return dashboardResponses;
    }
    @Transactional
    public InvoiceResponse createInvoiceV2(InvoiceRequest invoiceRequest) {
        Appointment appointment = appointmentRepository.findById(invoiceRequest.getAppointmentId()).orElseThrow(() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND));
        int quantityKoi = koiTreatmentRepository.countKoiTreatmentByAppointment_AppointmentId(appointment.getAppointmentId());
        int quantityPond = pondTreatmentRepository.countPondTreatmentByAppointment_AppointmentId(appointment.getAppointmentId());
        Invoice invoice = Invoice.builder()
                .appointment(appointment)
                .createAt(invoiceRequest.getCreateAt())
                .type(InvoiceType.Second)
                .quantity(quantityKoi + quantityPond)
                .unitPrice(invoiceRequest.getUnitPrice())
                .status(PaymentStatus.Completed)
                .totalPrice(invoiceRequest.getTotalPrice())
                .code(getCode() + 1)
                .distance(invoiceRequest.getDistance())
                .deliveryPrice(invoiceRequest.getDeliveryPrice())
                .build();
        invoiceRepository.save(invoice);
        InvoiceResponse invoiceResponse = invoiceMapper.toInvoiceResponse(invoice);
        return invoiceResponse;
    }
    public InvoiceResponse getAppointmentIdAndType(String appointmentId, InvoiceType type) {
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentIdAndType(appointmentId, type);
        InvoiceResponse invoiceResponse = invoiceMapper.toInvoiceResponse(invoice);
        return invoiceResponse;
    }
    public int getCode() {
        List<Invoice> invoices = invoiceRepository.findAll();
        return invoices.size();
    }
    public InvoiceResponse getInvoiceById(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new AppException(
                ErrorCode.INVOICE_ID_NOT_FOUND.getCode(),
                ErrorCode.INVOICE_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND));
        InvoiceResponse invoiceResponse = invoiceMapper.toInvoiceResponse(invoice);
        return invoiceResponse;
    }

    public CheckOutResponse checkOutAppointment(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new AppException(
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getCode(),
                ErrorCode.APPOINTMENT_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND));
        int quantityKoi = koiTreatmentRepository.countKoiTreatmentByAppointment_AppointmentId(appointment.getAppointmentId());
        int quantityPond = pondTreatmentRepository.countPondTreatmentByAppointment_AppointmentId(appointment.getAppointmentId());
        List<Delivery> deliveries = deliveryRepository.findAll();
        float deliveryPrice = 0;
        for (Delivery delivery : deliveries) {
            if (appointment.getDistance() >= delivery.getFromPlace() && appointment.getDistance() <= delivery.getToPlace()) {
                deliveryPrice = delivery.getPrice();
            }
        }
        Invoice invoices = Invoice.builder()
                .appointment(appointment)
                .type(InvoiceType.Second)
                .quantity(quantityKoi + quantityPond)
                .code(getCode() + 1)
                .distance(appointment.getDistance())
                .deliveryPrice(deliveryPrice)
                .build();
        InvoiceResponse invoiceResponse = invoiceMapper.toInvoiceResponse(invoices);
        Invoice invoice = invoiceRepository.findByAppointment_AppointmentIdAndType(appointmentId, InvoiceType.First);
        CheckOutResponse checkOutResponse = CheckOutResponse.builder()
                .depositeMoney(invoice.getTotalPrice())
                .invoice(invoiceResponse)
                .build();
        return checkOutResponse;
    }
    public List<ServiceCount> getServiceCount(LocalDate starTime, LocalDate endTime, String time) {
        List<ServiceCount> serviceCounts = new ArrayList<>();
        validationTimeRange(starTime,endTime,time);
        if (time.toLowerCase().equals("month")) {
            for (LocalDate start = starTime; !start.isAfter(endTime); start = start.plusMonths(1)) {
                List<Object[]> services = appointmentRepository.countServiceOfAppointmentMonnth(start.getMonthValue(), start.getYear());
               serviceCounts = calculaterServiceCount(serviceCounts,services);
            }
        }else if (time.toLowerCase().equals("year")) {
            for (LocalDate startYear = starTime ; !startYear.isAfter(endTime); startYear = startYear.plusYears(1)) {
                List<Object[]> services = appointmentRepository.countServiceOfAppointmentYear(startYear.getYear());
                serviceCounts = calculaterServiceCount(serviceCounts,services);
            }
        } else if (time.toLowerCase().equals("day")) {
            for (LocalDate startDay = starTime ; !startDay.isAfter(endTime); startDay = startDay.plusDays(1)) {
                List<Object[]> services = appointmentRepository.countServiceOfAppointmentDay(startDay.toString());
                serviceCounts = calculaterServiceCount(serviceCounts,services);
            }
        }
        return serviceCounts;
    }
    public List<ServiceCount> calculaterServiceCount (List<ServiceCount> serviceCounts , List<Object[]> services){
        for (Object[] service : services) {
            ServiceCount serviceCount = ServiceCount.builder()
                    .serviceName(service[1].toString())
                    .count((long) service[0])
                    .serviceId(service[2].toString())
                    .build();
            boolean isAdd = false;
            for (ServiceCount serviceCount1 : serviceCounts) {
                if (serviceCount1.getServiceId().equals(serviceCount.getServiceId())) {
                    serviceCount1.setCount(serviceCount1.getCount() + serviceCount.getCount());
                    isAdd = true;
                    break;
                }
            }
            if (!isAdd) {
                serviceCounts.add(serviceCount);
            }
        }
        return  serviceCounts ;
    }
    public void validationTimeRange(LocalDate starTime, LocalDate endTime,String time) {
        long monthsBetween = ChronoUnit.MONTHS.between(starTime, endTime);
        long yearsBetween = ChronoUnit.YEARS.between(starTime, endTime);
        long daysBetween = ChronoUnit.DAYS.between(starTime, endTime);
        if(time.toLowerCase().equals("month") && monthsBetween>12){
         throw new AppException(
                 ErrorCode.MONTH_NOT_EXEED.getCode(),
                 ErrorCode.MONTH_NOT_EXEED.getMessage(),
                 HttpStatus.BAD_REQUEST);
        } else if (time.toLowerCase().equals("year") && yearsBetween>3) {
            throw new AppException(
                    ErrorCode.YEAR_NOT_EXCEED.getCode(),
                    ErrorCode.YEAR_NOT_EXCEED.getMessage(),
                    HttpStatus.BAD_REQUEST);
        } else if (time.toLowerCase().equals("day") && daysBetween>30) {
            throw new AppException(
                    ErrorCode.DAY_NOT_EXCEED.getCode(),
                    ErrorCode.DAY_NOT_EXCEED.getMessage(),
                    HttpStatus.BAD_REQUEST);
        }
    }
}

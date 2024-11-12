package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.configuration.CustomEnviroment;
import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.model.entity.Appointment;
import com.koicenter.koicenterbackend.model.entity.Customer;
import com.koicenter.koicenterbackend.model.entity.Invoice;
import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import com.koicenter.koicenterbackend.model.momo.PaymentResponse;
import com.koicenter.koicenterbackend.model.momo.RequestType;
import com.koicenter.koicenterbackend.model.request.appointment.AppointmentRequest;
import com.koicenter.koicenterbackend.model.request.treament.TreamentRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.model.response.appointment.AppointmentResponse;
import com.koicenter.koicenterbackend.model.response.koi.KoiTreatmentResponse;
import com.koicenter.koicenterbackend.model.response.pond.PondTreatmentResponse;
import com.koicenter.koicenterbackend.model.response.user.UserResponse;
import com.koicenter.koicenterbackend.repository.AppointmentRepository;
import com.koicenter.koicenterbackend.repository.CustomerRepository;
import com.koicenter.koicenterbackend.repository.InvoiceRepository;
import com.koicenter.koicenterbackend.repository.UserRepository;
import com.koicenter.koicenterbackend.service.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    InvoiceService invoiceService;
    @Autowired
    TreatmentService treatmentService;
    private static TreamentRequest treamentRequestTemp;
    private static Float amountTemp;
    private static final String urlRating = "http://localhost:3000/rating";
    @Autowired
    AppointmentService  appointmentService;
    @Autowired
    private UserRepository userRepository;
    @Value("${myapp.api-key}")
    private String privateKey;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    SendEmalService sendEmalService;

    @PostMapping("/vn-pay")
    public ResponseEntity<ResponseObject> pay(HttpServletRequest request, @RequestBody TreamentRequest treamentRequest) {
        try {
            String paymentUrl = paymentService.createVnPayPayment(request);
            treamentRequestTemp = treamentRequest;
            String amount = request.getParameter("amount");
            if (amount == null || amount.isEmpty()) {
                return ResponseObject.APIRepsonse(400, "Amount is required", HttpStatus.BAD_REQUEST, null);
            }
            amountTemp = Float.parseFloat(amount);
            System.out.println("Redirect:  " + paymentUrl);
            return ResponseObject.APIRepsonse(200, "Redirecting to VN Pay", HttpStatus.OK, paymentUrl);
        } catch (NumberFormatException e) {
            return ResponseObject.APIRepsonse(400, "Invalid amount format", HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
    @GetMapping("/vn-pay-callback")
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        try {
            String status = request.getParameter("vnp_ResponseCode");
            if ("00".equals(status)) {
                TreamentRequest treatmentRequest = treamentRequestTemp;

                if (treatmentRequest == null) {
                    return ResponseObject.APIRepsonse(400, "Treatment request not found", HttpStatus.BAD_REQUEST, null);
                }
                if(treatmentRequest.getSelected().isEmpty()){
                    AppointmentResponse appointmentResponse = appointmentService.createAppointment(treatmentRequest.getAppointmentRequest());
                    if (appointmentResponse == null) {
                        return ResponseObject.APIRepsonse(404, "No appointments created", HttpStatus.NOT_FOUND, null);
                    }
                    insertToInvoice(appointmentResponse.getAppointmentId(), amountTemp);
                    Customer customer = customerRepository.findByCustomerId(appointmentResponse.getCustomerId());
                    User user = userRepository.findByUserId(customer.getUser().getUserId());
                    String emailContent = buildEmailContent(appointmentResponse, amountTemp);
                    sendEmalService.sendMailSender(user.getEmail(), emailContent, "🧑‍⚕️💉❤️ Confirmation of Your Koi Service Appointment");
                }else{
                    List<Object> appointmentResponse = treatmentService.createAppointments(treatmentRequest.getSelected(), treatmentRequest.getAppointmentRequest());
                    if (appointmentResponse.isEmpty()) {
                        return ResponseObject.APIRepsonse(404, "No appointments created", HttpStatus.NOT_FOUND, null);
                    }
                    Object firstObject = appointmentResponse.get(0);
                    String appointmentId = null;
                    if (firstObject instanceof PondTreatmentResponse firstAppointment) {
                        appointmentId = firstAppointment.getAppointmentId();
                    } else if (firstObject instanceof KoiTreatmentResponse firstAppointment) {
                        appointmentId = firstAppointment.getAppointmentId();
                    }
                    if (appointmentId != null) {
                        insertToInvoice(appointmentId, amountTemp);
                        Customer customer = customerRepository.findByCustomerId(treatmentRequest.getAppointmentRequest().getCustomerId());
                        User user = userRepository.findByUserId(customer.getUser().getUserId());
                        AppointmentResponse appointment = AppointmentResponse.builder()
                                .appointmentDate(treatmentRequest.getAppointmentRequest().getAppointmentDate())
                                .customerName(treatmentRequest.getAppointmentRequest().getCustomerName())
                                .serviceName(treatmentRequest.getAppointmentRequest().getServiceName())
                                .build();
                        String emailContent = buildEmailContent(appointment, amountTemp);
                        sendEmalService.sendMailSender(user.getEmail(), emailContent, "🧑‍⚕️💉❤️ Confirmation of Your Koi Service Appointment");
                    }
                }
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000/booking/paymentsuccess")).build();
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).location(URI.create("http://localhost:3000/booking/paymentfailed")).build();
            }
            } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    private String buildEmailContent(AppointmentResponse appointmentResponse, Float amount) {
        String customerName = appointmentResponse.getCustomerName() != null ? appointmentResponse.getCustomerName() : "Customer";
        String serviceName = appointmentResponse.getServiceName() != null ? appointmentResponse.getServiceName() : "Koi Service";
        String appointmentDate = appointmentResponse.getAppointmentDate() != null ? appointmentResponse.getAppointmentDate().toString() : "N/A";
        String amountPaid = amount != null ? String.format("%.2f", amount) : "N/A";


        return "Dear " + customerName + ",\n\n" +
                "We are pleased to inform you that your payment for the koi center service has been SUCCESSFULLY processed. Below are the details of your recent booking:\n\n" +
                "Service Details:\n" +
                "Service Name: " + serviceName + "\n" +
                "Date of Service: " + appointmentDate + "\n" +
                "Total Amount Paid: " + amountPaid + " VND\n\n" +
                "We truly appreciate your trust in our services and are committed to ensuring the best care for your koi. Our team will be ready to assist you at the scheduled time to provide a smooth and professional experience.\n\n" +
                "Should you have any questions or need to modify your appointment, please do not hesitate to contact us at 0345999999 or via email at koicenter.swp@gmail.com.\n\n" +
                "Once again, thank you for choosing KOI MED CENTER. We look forward to serving you and ensuring the health and happiness of your koi.\n\n" +
                "We would love to hear your feedback on our services." +
                "Warm regards,\n" +
                "KOI MED CENTER\n" +
                "0345999999\n" +
                "koicenter.swp@gmail.com";

    }


    private void insertToInvoice(String appointmentId, Float ammout) {
        Invoice newInvoice = Invoice.builder()
                .status(PaymentStatus.Completed)
                .totalPrice(ammout)
                .createAt(LocalDateTime.now())
                .appointment(appointmentRepository.findAppointmentById(appointmentId))
                .type(InvoiceType.First)
                .quantity(1)
                .code(invoiceService.getCode()+1)
                .deliveryPrice(0)
                .distance(0)
                .unitPrice(ammout)
                .build();
        invoiceRepository.save(newInvoice);
    }


    @PostMapping("/momo-pay")
    public ResponseEntity<ResponseObject> payWithMoMo(HttpServletRequest request, @RequestBody TreamentRequest treamentRequest) {
        try {
            String amount = request.getParameter("amount");
            if (amount == null) {
                return ResponseObject.APIRepsonse(400, "Amount is required", HttpStatus.BAD_REQUEST, null);
            }
            amountTemp = Float.parseFloat(amount);
            treamentRequestTemp = treamentRequest;
            float amountTemp = treamentRequest.getAppointmentRequest().getDepositedMoney();
            String amountStr = String.valueOf((int) amountTemp);
            if (amountTemp <= 0) {
                return ResponseObject.APIRepsonse(400, "Amount is required", HttpStatus.BAD_REQUEST, null);
            }

            CustomEnviroment customEnviroment = CustomEnviroment.selectEnv("dev");
            String orderId = "order-" + System.currentTimeMillis();
            String requestId = "request-" + System.currentTimeMillis();
            String orderInfo = "Pay for MoMo orders for orders";
            String redirectUrl  = "http://localhost:3000/booking/paymentsuccess";
            String ipnUrl  = "https://96b9-118-69-182-144.ngrok-free.app/api/v1/payment/momo-pay-callback"; //off ngrok thì phải đổi link mới!!!
            String extraData = "";

            PaymentResponse response = CreateOrderMoMo.process(customEnviroment,
                    orderId,
                    requestId,
                    String.valueOf(amount),
                    orderInfo,
                    redirectUrl ,
                    ipnUrl ,
                    extraData,
                    RequestType.PAY_WITH_ATM,
                    true);

            if (response != null) {
                return ResponseObject.APIRepsonse(200, "Redirecting to MoMo", HttpStatus.OK, response.getPayUrl());
            }

            return ResponseObject.APIRepsonse(400, "Error creating MoMo order.", HttpStatus.BAD_REQUEST, null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseObject.APIRepsonse(500, "Request processing error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }




    @PostMapping("/momo-pay-callback")
    public ResponseEntity<ResponseObject> momoPayCallback(@RequestBody Map<String, Object> payload) {
        try {


            String message = (String) payload.get("message");
            Integer resultCode = (Integer) payload.get("resultCode");
            log.info("Received MoMo callback with message: {}, resultCode: {}", message, resultCode);

            if (resultCode == 0) {
                TreamentRequest treatmentRequest = treamentRequestTemp;
                if (treatmentRequest == null) {
                    return ResponseObject.APIRepsonse(400, "Treatment request not found", HttpStatus.BAD_REQUEST, null);
                }
                if(treatmentRequest.getSelected().isEmpty()){
                    AppointmentResponse appointmentResponse = appointmentService.createAppointment(treatmentRequest.getAppointmentRequest());
                    if (appointmentResponse == null) {
                        return ResponseObject.APIRepsonse(404, "No appointments created", HttpStatus.NOT_FOUND, null);
                    }
                    insertToInvoice(appointmentResponse.getAppointmentId(), amountTemp);
                    Customer customer = customerRepository.findByCustomerId(appointmentResponse.getCustomerId());
                    User user = userRepository.findByUserId(customer.getUser().getUserId());
                    String emailContent = buildEmailContent(appointmentResponse, amountTemp);
                    sendEmalService.sendMailSender(user.getEmail(), emailContent, "🧑‍⚕️💉❤️ Confirmation of Your Koi Service Appointment");
                }else{
                    List<Object> appointmentResponse = treatmentService.createAppointments(treatmentRequest.getSelected(), treatmentRequest.getAppointmentRequest());
                    if (appointmentResponse.isEmpty()) {
                        return ResponseObject.APIRepsonse(404, "No appointments created", HttpStatus.NOT_FOUND, null);
                    }
                    Object firstObject = appointmentResponse.get(0);
                    String appointmentId = null;
                    if (firstObject instanceof PondTreatmentResponse firstAppointment) {
                        appointmentId = firstAppointment.getAppointmentId();
                    } else if (firstObject instanceof KoiTreatmentResponse firstAppointment) {
                        appointmentId = firstAppointment.getAppointmentId();
                    }
                    if (appointmentId != null) {
                        insertToInvoice(appointmentId, amountTemp);
                        Customer customer = customerRepository.findByCustomerId(treatmentRequest.getAppointmentRequest().getCustomerId());
                        User user = userRepository.findByUserId(customer.getUser().getUserId());
                        AppointmentResponse appointment = AppointmentResponse.builder()
                                .appointmentDate(treatmentRequest.getAppointmentRequest().getAppointmentDate())
                                .customerName(treatmentRequest.getAppointmentRequest().getCustomerName())
                                .serviceName(treatmentRequest.getAppointmentRequest().getServiceName())
                                .build();
                        String emailContent = buildEmailContent(appointment, amountTemp);
                        sendEmalService.sendMailSender(user.getEmail(), emailContent, "🧑‍⚕️💉❤️ Confirmation of Your Koi Service Appointment");
                    }
                }
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000/booking/paymentsuccess")).build();
            } else {
                System.out.println("Thanh toán thất bại: " + message);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).location(URI.create("http://localhost:3000/booking/paymentfailed")).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseObject.APIRepsonse(500, "Error callback: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}
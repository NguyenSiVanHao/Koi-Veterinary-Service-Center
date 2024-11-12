package com.koicenter.koicenterbackend.exception;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


public enum ErrorCode {
    USER_ID_NOT_EXITS(404,"User id not found"),
    USER_EXISTED(401,"User already existed"),
    USER_NOT_EXISTS(403,"User not found "),
    USER_FALSE(401,"User not authorized"),
    INVALID_LOGIN(401,"Invalid username or password"),
    INVALID_LOGOUT(401,"Logout failed"),
    INVALID_TOKEN(401,"Invalid token"),
    SERVICE_NOT_EXITS(401,"Service not exits"),
    POND_NOT_EXITS(401,"Pond not exits"),
    KOI_NOT_EXITS(401,"Koi not exits"),
    POND_ID_OR_APPOINTMENT_ID_NOT_EXITS(401,"Pond id or appointment id not exits"),
    KOI_ID_OR_APPOINTMENT_ID_NOT_EXITS(401,"Pond id or appointment id not exits"),
    MEDICINE_NOT_EXITS(401,"Medicine not exits"),
    CUSTOMER_NOT_EXITS(401,"Customer not exits"),
    CUSTOMER_NOT_FOUND(404,"Customer not found"),
    PRESCRIPTION_MEDICINE_NOT_EXITS(401,"Prescription medicine not exits"),
    DELIVERY_ID_NOT_EXITS(401,"Delivery not exits"),
    SERVICE_ID_NOT_EXITS(401,"Service not exits"),
    VETERINARIAN_ID_NOT_EXITS(401,"Vetterinarian not exits"),
    NO_SCHEDULE_FOUND(401,"No schedule found"),
    PRESCRIPTION_ID_NOT_FOUND(401,"Prescription id not found"),
    PRESCRIPTION_MEDICINE_ID_NOT_FOUND(401,"Prescription medicine id not found"),
    INVOICE_ID_NOT_FOUND(401,"Invoice id not found"),
    APPOINTMENT_ID_NOT_FOUND(404,"Appointment id not found"),
    APPOINTMENT_NOT_FOUND(404,"Appointment not found"),
    STAR_NOT_EXISTS(401,"Star must between 0 to 5 " ),
    PONDTREATMENT_ID_NOT_FOUND(404,"Pond Treatment ID not found"),
    KOITREATMENT_ID_NOT_FOUND(404,"KOi Treatment ID not found"),
    POND_ID_NOT_FOUND(404,"Pond ID not found"),
        KOI_ID_NOT_FOUND(404,"Koi ID not found"),
    VETSCHEDULE_NOT_FOUND(404,"Vetschedule not found"),
    VETSCHEDULE_EXISTED(401," VETSCHEDULE already existed"),
    FAQ_ID_NOT_FOUND(404,"Faq ID not found"),
    FEEDBACK_NOT_FOUND(404,"Feedback not found"),
    MONTH_NOT_EXEED(400,"The Month Time range not exceed 12 months "),
    YEAR_NOT_EXCEED(400,"The Year Time range not exceed 3 year "),
    DAY_NOT_EXCEED(400,"The Day Time range not exceed 30 days "),
    USER_NAME_EXISTED(401,"User name already existed"),
        MEDICINE_EXITED(401,"Medicine not exits")

    ;
    private int code;
    private String message;
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

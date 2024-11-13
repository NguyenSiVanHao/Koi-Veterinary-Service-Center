package com.koicenter.koicenterbackend.model.enums;

public enum AppointmentStatus {
   // PENDING,
    CREATED, // CHUA CHON BAC SI THÌ SE LÀ CREATED
    BOOKING_COMPLETE, // APPOINT DA CO BAC SI
    PROCESS,
    READY_FOR_PAYMENT,
    FINISH,//~~  COMPLETED
    CANCEL, // DAT ROI MA KHONG DI
   REFUND,
    REFUNDABLE
}

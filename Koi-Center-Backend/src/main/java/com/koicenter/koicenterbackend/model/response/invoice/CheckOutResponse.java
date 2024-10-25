package com.koicenter.koicenterbackend.model.response.invoice;

import com.koicenter.koicenterbackend.model.enums.InvoiceType;
import com.koicenter.koicenterbackend.model.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckOutResponse {
   InvoiceResponse invoice ;
   float depositeMoney ;

}

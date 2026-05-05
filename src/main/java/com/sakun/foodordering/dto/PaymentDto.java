package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data
    public static class Request {
        @NotNull private Long orderId;
        @NotNull private Payment.PaymentMethod method;
    }

    @Data
    public static class Response {
        private Long id;
        private Long orderId;
        private BigDecimal amount;
        private String method;
        private String status;
        private LocalDateTime paidAt;

        public static Response from(Payment payment) {
            Response r = new Response();
            r.id = payment.getId();
            r.orderId = payment.getOrder().getId();
            r.amount = payment.getAmount();
            r.method = payment.getMethod().name();
            r.status = payment.getStatus().name();
            r.paidAt = payment.getPaidAt();
            return r;
        }
    }
}

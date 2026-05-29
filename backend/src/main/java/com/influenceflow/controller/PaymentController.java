package com.influenceflow.controller;

import com.influenceflow.entity.Payment;
import com.influenceflow.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/campaign/{campaignId}")
    public List<Payment> getPaymentsByCampaign(@PathVariable String campaignId) {
        return paymentService.getPaymentsByCampaign(campaignId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable String id, @RequestBody Payment paymentDetails) {
        return paymentService.getPaymentById(id)
                .map(payment -> {
                    payment.setStatus(paymentDetails.getStatus());
                    payment.setPaidDate(paymentDetails.getPaidDate());
                    return ResponseEntity.ok(paymentService.savePayment(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

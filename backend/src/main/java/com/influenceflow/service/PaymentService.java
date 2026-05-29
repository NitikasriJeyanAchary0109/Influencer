package com.influenceflow.service;

import com.influenceflow.entity.Payment;
import com.influenceflow.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByCampaign(String campaignId) {
        return paymentRepository.findByCampaignId(campaignId);
    }

    public List<Payment> getPaymentsByInfluencer(String influencerId) {
        return paymentRepository.findByInfluencerId(influencerId);
    }

    public Optional<Payment> getPaymentById(String id) {
        return paymentRepository.findById(id);
    }

    public Payment savePayment(Payment payment) {
        if ("PENDING".equals(payment.getStatus()) && payment.getDueDate() != null && payment.getDueDate().isBefore(LocalDate.now())) {
            payment.setStatus("OVERDUE");
        }
        return paymentRepository.save(payment);
    }

    public void deletePayment(String id) {
        paymentRepository.deleteById(id);
    }
}

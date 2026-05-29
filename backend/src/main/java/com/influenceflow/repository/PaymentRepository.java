package com.influenceflow.repository;

import com.influenceflow.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByCampaignId(String campaignId);
    List<Payment> findByInfluencerId(String influencerId);
}

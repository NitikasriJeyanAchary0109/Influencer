package com.influenceflow.service;

import com.influenceflow.repository.CampaignRepository;
import com.influenceflow.repository.InfluencerRepository;
import com.influenceflow.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private InfluencerRepository influencerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public Map<String, Object> getDashboardMetrics(String brandId) {
        Map<String, Object> metrics = new HashMap<>();

        long totalCampaigns = campaignRepository.findByBrandBrandId(brandId).size();
        long totalInfluencers = influencerRepository.findByBrandBrandId(brandId).size();

        // In a real application, you might want more optimized queries
        double totalSpend = paymentRepository.findAll().stream()
                .filter(p -> p.getCampaign() != null && p.getCampaign().getBrand() != null && brandId.equals(p.getCampaign().getBrand().getBrandId()))
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount().doubleValue() : 0.0)
                .sum();

        metrics.put("activeCampaigns", totalCampaigns);
        metrics.put("totalInfluencers", totalInfluencers);
        metrics.put("totalSpend", totalSpend);
        
        return metrics;
    }
}

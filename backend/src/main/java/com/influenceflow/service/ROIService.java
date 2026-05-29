package com.influenceflow.service;

import org.springframework.stereotype.Service;

@Service
public class ROIService {

    public double calculateCPE(double paymentAmount, long totalEngagements) {
        if (totalEngagements == 0) return 0.0;
        return paymentAmount / totalEngagements;
    }

    public double calculateCPR(double paymentAmount, long reach) {
        if (reach == 0) return 0.0;
        return paymentAmount / reach;
    }

    public double calculateROI(double revenueGenerated, double spendAmount) {
        if (spendAmount == 0) return 0.0;
        return ((revenueGenerated - spendAmount) / spendAmount) * 100.0;
    }
}

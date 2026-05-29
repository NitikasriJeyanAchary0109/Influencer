package com.influenceflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @Column(name = "campaign_id", length = 36)
    private String campaignId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(name = "campaign_name", nullable = false, length = 100)
    private String campaignName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 14, scale = 2, columnDefinition = "DECIMAL(14,2) DEFAULT 0.00")
    private BigDecimal budget;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'Draft'")
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.campaignId == null) {
            this.campaignId = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.budget == null) {
            this.budget = BigDecimal.ZERO;
        }
        if (this.status == null) {
            this.status = "Draft";
        }
    }
}

package com.influenceflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Metric {

    @Id
    @Column(name = "metric_id", length = 36)
    private String metricId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer reach;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer impressions;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer likes;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer comments;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer shares;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer clicks;

    @Column(name = "revenue_generated", precision = 14, scale = 2, columnDefinition = "DECIMAL(14,2) DEFAULT 0.00")
    private BigDecimal revenueGenerated;

    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (this.metricId == null) {
            this.metricId = UUID.randomUUID().toString();
        }
        if (this.recordedAt == null) {
            this.recordedAt = LocalDateTime.now();
        }
        if (this.reach == null) this.reach = 0;
        if (this.impressions == null) this.impressions = 0;
        if (this.likes == null) this.likes = 0;
        if (this.comments == null) this.comments = 0;
        if (this.shares == null) this.shares = 0;
        if (this.clicks == null) this.clicks = 0;
        if (this.revenueGenerated == null) this.revenueGenerated = BigDecimal.ZERO;
    }
}

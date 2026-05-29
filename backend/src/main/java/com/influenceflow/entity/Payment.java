package com.influenceflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(name = "payment_id", length = 36)
    private String paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "influencer_id", nullable = false)
    private Influencer influencer;

    @Column(precision = 14, scale = 2, columnDefinition = "DECIMAL(14,2) DEFAULT 0.00")
    private BigDecimal amount;

    @Column(name = "payment_type", length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'Cash'")
    private String paymentType; // Cash, Commission, Gift Product, Hybrid

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_status", length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'Pending'")
    private String paymentStatus; // Pending, Paid, Overdue

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.paymentId == null) {
            this.paymentId = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.amount == null) {
            this.amount = BigDecimal.ZERO;
        }
        if (this.paymentType == null) {
            this.paymentType = "Cash";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "Pending";
        }
    }
}

package com.influenceflow.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "influencers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Influencer {

    @Id
    @Column(name = "influencer_id", length = 36)
    @JsonProperty("id")
    private String influencerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "instagram_handle", length = 100)
    @JsonProperty("platformHandle")
    private String instagramHandle;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 50)
    private String niche;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer followers;

    @Column(name = "engagement_rate", precision = 5, scale = 2, columnDefinition = "DECIMAL(5,2) DEFAULT 0.00")
    private BigDecimal engagementRate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isVerified = false;

    @PrePersist
    protected void onCreate() {
        if (this.influencerId == null) {
            this.influencerId = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.followers == null) {
            this.followers = 0;
        }
        if (this.engagementRate == null) {
            this.engagementRate = BigDecimal.ZERO;
        }
    }
}

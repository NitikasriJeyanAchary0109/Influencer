-- InfluenceFlow AI MySQL Database Schema

-- Disable foreign key checks to allow clean table re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS metrics;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS campaign_influencers;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS influencers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================
-- ROLES
-- =====================================
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO roles (name) VALUES ('ADMIN'), ('BRAND_MANAGER');

-- =====================================
-- BRANDS
-- =====================================
CREATE TABLE brands (
    brand_id VARCHAR(36) PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- USERS
-- =====================================
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    brand_id VARCHAR(36),
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- INFLUENCERS
-- =====================================
CREATE TABLE influencers (
    influencer_id VARCHAR(36) PRIMARY KEY,
    brand_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    instagram_handle VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    niche VARCHAR(50),
    followers INT DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE CASCADE,
    INDEX idx_influencers_brand (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- CAMPAIGNS
-- =====================================
CREATE TABLE campaigns (
    campaign_id VARCHAR(36) PRIMARY KEY,
    brand_id VARCHAR(36) NOT NULL,
    campaign_name VARCHAR(100) NOT NULL,
    description TEXT,
    budget DECIMAL(14,2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'Draft', -- Draft, Active, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE CASCADE,
    INDEX idx_campaigns_brand (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- CAMPAIGN INFLUENCERS (Many-to-Many Join Table)
-- =====================================
CREATE TABLE campaign_influencers (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    influencer_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(influencer_id) ON DELETE CASCADE,
    UNIQUE KEY uq_campaign_influencer (campaign_id, influencer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- POSTS
-- =====================================
CREATE TABLE posts (
    post_id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    influencer_id VARCHAR(36) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- Instagram, YouTube, Facebook, X, LinkedIn
    post_url VARCHAR(255),
    post_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(influencer_id) ON DELETE CASCADE,
    INDEX idx_posts_campaign (campaign_id),
    INDEX idx_posts_influencer (influencer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- METRICS
-- =====================================
CREATE TABLE metrics (
    metric_id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    reach INT DEFAULT 0,
    impressions INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    clicks INT DEFAULT 0,
    revenue_generated DECIMAL(14,2) DEFAULT 0.00,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_metrics_post (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- PAYMENTS
-- =====================================
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    influencer_id VARCHAR(36) NOT NULL,
    amount DECIMAL(14,2) DEFAULT 0.00,
    payment_type VARCHAR(50) DEFAULT 'Cash', -- Cash, Commission, Gift Product, Hybrid
    due_date DATE,
    payment_date DATE,
    payment_status VARCHAR(20) DEFAULT 'Pending', -- Pending, Paid, Overdue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencers(influencer_id) ON DELETE CASCADE,
    INDEX idx_payments_campaign (campaign_id),
    INDEX idx_payments_influencer (influencer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

# Influencer Campaign Tracker SaaS

## Purpose
Small brands currently manage influencer campaigns using Excel sheets, WhatsApp chats, and Google Docs. This application provides a centralized platform to manage influencers, campaigns, posts, payments, and ROI tracking.

## User Roles

### Brand User
- Manage influencers
- Create campaigns
- Assign influencers to campaigns
- Track posts
- View metrics
- Manage payments
- View ROI dashboard

### Admin
- Manage all brands
- Manage users
- View system analytics

## Database Design

### Brands
- brand_id (PK)
- brand_name
- industry
- contact_email
- contact_phone
- created_at

### Influencers
- influencer_id (PK)
- name
- instagram_handle
- email
- phone
- niche
- followers
- engagement_rate
- created_at

### Campaigns
- campaign_id (PK)
- brand_id (FK)
- campaign_name
- description
- budget
- start_date
- end_date
- status (Draft, Active, Completed)

### Campaign_Influencers
- id
- campaign_id
- influencer_id

### Posts
- post_id (PK)
- campaign_id (FK)
- influencer_id (FK)
- platform (Instagram, YouTube, Facebook, X, LinkedIn)
- post_url
- post_date

### Metrics
- metric_id
- post_id
- reach
- impressions
- likes
- comments
- shares
- clicks
- revenue_generated
- recorded_at

### Payments
- payment_id
- campaign_id
- influencer_id
- amount
- payment_type (Cash, Commission, Gift Product, Hybrid)
- due_date
- payment_date
- payment_status (Pending, Paid, Overdue)

### Automatic Logic
If payment status is not Paid and current date exceeds due_date, automatically mark payment as Overdue.

## Dashboard

### KPI Cards
- Total Influencers
- Active Campaigns
- Total Campaign Spend
- Total Revenue Generated
- ROI Percentage
- Pending Payments
- Overdue Payments

## Campaign Module
- Create Campaign
- Edit Campaign
- Delete Campaign
- Assign Multiple Influencers
- Set Budget
- Set Timeline
- Track Campaign Status

## Influencer Management Module
- Add Influencer
- Edit Influencer
- Delete Influencer
- Search Influencer
- Filter by Niche
- View Influencer Performance History

## Post Tracking Module
- Add Post URL
- Select Campaign
- Select Influencer
- Select Platform
- Track Posting Date

## Automatic Metrics Tracking
When a post URL is added:
- Automatically fetch performance metrics from platform APIs where available.
- Store reach, impressions, likes, comments, shares, clicks, and revenue.
- Provide simulated data mode for demos if APIs are unavailable.

## ROI Engine

### Cost Per Engagement (CPE)
Payment ÷ (Likes + Comments + Shares)

### Cost Per Reach (CPR)
Payment ÷ Reach

### Revenue ROI
((Revenue Generated - Campaign Spend) ÷ Campaign Spend) × 100

## Payment Management
- Add Payment
- Update Payment Status
- Payment Due Date Tracking
- Overdue Payment Detection
- Payment History

## Reports & Analytics

### Campaign Analytics
- Reach
- Impressions
- Engagement
- Revenue

### Influencer Analytics
- Best Performing Influencer
- Highest ROI Influencer
- Most Engagement Generated

### Financial Analytics
- Total Spend
- Revenue Generated
- ROI %

## Smart Features

### Top Performer Badge
Automatically identify the influencer with the highest ROI.

### Campaign Health Score
Score out of 100 using:
- Engagement
- Reach
- ROI
- Budget Utilization

Categories:
- Excellent
- Good
- Average
- Poor

### Payment Alerts
- Upcoming Due Payments
- Overdue Payments

## UI Design Requirements
- Modern SaaS Dashboard
- Professional Business Theme
- Responsive Design
- Clean Tables
- Analytics Charts
- KPI Cards
- Sidebar Navigation
- Dark and Light Mode Support

### Colors
- Indigo
- White
- Gray

### Charts
- Campaign ROI Trends
- Revenue Trends
- Influencer Performance Comparison
- Campaign Spend Analysis

## Landing Page

### Hero Section
**Track Influencers. Measure ROI. Grow Smarter.**

### Features
- Influencer CRM
- Campaign Manager
- Metrics Dashboard
- Payment Tracking
- ROI Engine

### Pricing
- Starter (Free)
- Growth (₹2499/month)
- Pro (₹6599/month)

### CTA
**Start Tracking Influencer ROI Today**

## Final Requirement
Generate all database tables, relationships, CRUD screens, dashboard pages, analytics pages, forms, validations, and responsive UI required for a production-ready SaaS application.

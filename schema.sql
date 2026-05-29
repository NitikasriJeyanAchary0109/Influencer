-- Influencer Campaign Tracker DDL
-- Apply this schema in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- BRANDS
-- =====================
CREATE TABLE IF NOT EXISTS brands (
  brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- USER → BRAND MAPPING
-- =====================
CREATE TABLE IF NOT EXISTS user_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

-- =====================
-- INFLUENCERS
-- =====================
CREATE TABLE IF NOT EXISTS influencers (
  influencer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instagram_handle TEXT,
  email TEXT,
  phone TEXT,
  niche TEXT,
  followers INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CAMPAIGNS
-- =====================
CREATE TABLE IF NOT EXISTS campaigns (
  campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(14,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft','Active','Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CAMPAIGN INFLUENCERS (Many-to-Many)
-- =====================
CREATE TABLE IF NOT EXISTS campaign_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES influencers(influencer_id) ON DELETE CASCADE,
  UNIQUE(campaign_id, influencer_id)
);

-- =====================
-- POSTS
-- =====================
CREATE TABLE IF NOT EXISTS posts (
  post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES influencers(influencer_id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('Instagram','YouTube','Facebook','X','LinkedIn')),
  post_url TEXT,
  post_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- METRICS
-- =====================
CREATE TABLE IF NOT EXISTS metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  revenue_generated NUMERIC(14,2) DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PAYMENTS
-- =====================
CREATE TABLE IF NOT EXISTS payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES influencers(influencer_id) ON DELETE CASCADE,
  amount NUMERIC(14,2) DEFAULT 0,
  payment_type TEXT DEFAULT 'Cash' CHECK (payment_type IN ('Cash','Commission','Gift Product','Hybrid')),
  due_date DATE,
  payment_date DATE,
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Paid','Overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper function: get brand_ids for current user
CREATE OR REPLACE FUNCTION get_user_brand_ids()
RETURNS SETOF UUID AS $$
  SELECT brand_id FROM user_brands WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- brands RLS
CREATE POLICY "Users can view their brands" ON brands
  FOR SELECT USING (brand_id IN (SELECT get_user_brand_ids()));
CREATE POLICY "Users can insert brands" ON brands
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their brands" ON brands
  FOR UPDATE USING (brand_id IN (SELECT get_user_brand_ids()));
CREATE POLICY "Users can delete their brands" ON brands
  FOR DELETE USING (brand_id IN (SELECT get_user_brand_ids()));

-- user_brands RLS
CREATE POLICY "Users can view own user_brands" ON user_brands
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own user_brands" ON user_brands
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- influencers RLS
CREATE POLICY "Users can manage their influencers" ON influencers
  FOR ALL USING (brand_id IN (SELECT get_user_brand_ids()));

-- campaigns RLS
CREATE POLICY "Users can manage their campaigns" ON campaigns
  FOR ALL USING (brand_id IN (SELECT get_user_brand_ids()));

-- campaign_influencers RLS
CREATE POLICY "Users can manage campaign_influencers" ON campaign_influencers
  FOR ALL USING (
    campaign_id IN (SELECT campaign_id FROM campaigns WHERE brand_id IN (SELECT get_user_brand_ids()))
  );

-- posts RLS
CREATE POLICY "Users can manage their posts" ON posts
  FOR ALL USING (
    campaign_id IN (SELECT campaign_id FROM campaigns WHERE brand_id IN (SELECT get_user_brand_ids()))
  );

-- metrics RLS
CREATE POLICY "Users can manage their metrics" ON metrics
  FOR ALL USING (
    post_id IN (
      SELECT post_id FROM posts WHERE campaign_id IN (
        SELECT campaign_id FROM campaigns WHERE brand_id IN (SELECT get_user_brand_ids())
      )
    )
  );

-- payments RLS
CREATE POLICY "Users can manage their payments" ON payments
  FOR ALL USING (
    campaign_id IN (SELECT campaign_id FROM campaigns WHERE brand_id IN (SELECT get_user_brand_ids()))
  );

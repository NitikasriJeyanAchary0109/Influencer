import { createClient } from '@supabase/supabase-js'

// Try to initialize standard client in case of fallback
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://elhwmkbygzamkxohoqih.supabase.co'
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || ''
const realSupabase = createClient(supabaseUrl, supabaseAnonKey)

// ==========================================
// CLIENT-SIDE LOCAL STORAGE EMULATOR
// ==========================================

// Seed Data Definition
const defaultBrand = {
  brand_id: 'brand-1',
  brand_name: 'Aura Lifestyle',
  industry: 'Fashion & Beauty',
  contact_email: 'brand@aura.co',
  contact_phone: '+91 98765 43210',
  created_at: '2026-01-15T08:00:00.000Z'
};

const defaultUsers = [
  {
    id: 'user-1',
    email: 'brand@aura.co',
    name: 'Aura Brand Manager',
    created_at: '2026-01-15T08:00:00.000Z'
  }
];

const defaultUserBrands = [
  {
    id: 'ub-1',
    user_id: 'user-1',
    brand_id: 'brand-1',
    role: 'owner',
    created_at: '2026-01-15T08:00:00.000Z'
  }
];

const defaultInfluencers = [
  {
    influencer_id: 'inf-1',
    brand_id: 'brand-1',
    name: 'Sarah Jenkins',
    instagram_handle: 'sarah_style',
    email: 'sarah@sarahstyle.com',
    phone: '+91 99999 11111',
    niche: 'Fashion',
    followers: 245000,
    engagement_rate: 4.8,
    created_at: '2026-02-01T09:00:00.000Z'
  },
  {
    influencer_id: 'inf-2',
    brand_id: 'brand-1',
    name: 'Alex Chen',
    instagram_handle: 'tech_bytes',
    email: 'alex@techbytes.io',
    phone: '+91 99999 22222',
    niche: 'Tech',
    followers: 520000,
    engagement_rate: 5.2,
    created_at: '2026-02-02T10:00:00.000Z'
  },
  {
    influencer_id: 'inf-3',
    brand_id: 'brand-1',
    name: 'Priya Sharma',
    instagram_handle: 'priya_eats',
    email: 'priya@priyaeats.in',
    phone: '+91 99999 33333',
    niche: 'Food',
    followers: 185000,
    engagement_rate: 6.1,
    created_at: '2026-02-03T11:00:00.000Z'
  },
  {
    influencer_id: 'inf-4',
    brand_id: 'brand-1',
    name: 'Jessica Miller',
    instagram_handle: 'jess_glow',
    email: 'jessica@glowbeauty.com',
    phone: '+91 99999 44444',
    niche: 'Beauty',
    followers: 310000,
    engagement_rate: 5.9,
    created_at: '2026-02-04T12:00:00.000Z'
  },
  {
    influencer_id: 'inf-5',
    brand_id: 'brand-1',
    name: 'Marcus Vance',
    instagram_handle: 'marcus_fit',
    email: 'contact@marcusvance.fit',
    phone: '+91 99999 55555',
    niche: 'Lifestyle',
    followers: 120000,
    engagement_rate: 3.5,
    created_at: '2026-02-05T13:00:00.000Z'
  },
  {
    influencer_id: 'inf-6',
    brand_id: 'brand-1',
    name: 'Elena Rostova',
    instagram_handle: 'elena_design',
    email: 'hello@elena.design',
    phone: '+91 99999 66666',
    niche: 'Lifestyle',
    followers: 95000,
    engagement_rate: 4.2,
    created_at: '2026-02-06T14:00:00.000Z'
  }
];

const defaultCampaigns = [
  {
    campaign_id: 'camp-1',
    brand_id: 'brand-1',
    campaign_name: 'Summer Glow Launch',
    description: 'Promote our new summer organic skincare line and wellness oils.',
    budget: 250000,
    start_date: '2026-05-01',
    end_date: '2026-06-15',
    status: 'Active',
    created_at: '2026-04-01T08:00:00.000Z'
  },
  {
    campaign_id: 'camp-2',
    brand_id: 'brand-1',
    campaign_name: 'Tech Essentials 2026',
    description: 'Review series for the Aura smart hydration bottle and ecosystem tracker.',
    budget: 500000,
    start_date: '2026-04-10',
    end_date: '2026-05-25',
    status: 'Completed',
    created_at: '2026-03-15T08:00:00.000Z'
  },
  {
    campaign_id: 'camp-3',
    brand_id: 'brand-1',
    campaign_name: 'Autumn Comfort Threads',
    description: 'Teasing the organic cotton autumn capsule clothing collection.',
    budget: 150000,
    start_date: '2026-08-01',
    end_date: '2026-08-31',
    status: 'Draft',
    created_at: '2026-05-20T08:00:00.000Z'
  }
];

const defaultCampaignInfluencers = [
  { id: 'ci-1', campaign_id: 'camp-1', influencer_id: 'inf-1' },
  { id: 'ci-2', campaign_id: 'camp-1', influencer_id: 'inf-4' },
  { id: 'ci-3', campaign_id: 'camp-1', influencer_id: 'inf-5' },
  { id: 'ci-4', campaign_id: 'camp-2', influencer_id: 'inf-2' },
  { id: 'ci-5', campaign_id: 'camp-2', influencer_id: 'inf-6' }
];

const defaultPosts = [
  {
    post_id: 'post-1',
    campaign_id: 'camp-1',
    influencer_id: 'inf-1',
    platform: 'Instagram',
    post_url: 'https://instagram.com/p/CdSummerGlow1',
    post_date: '2026-05-05',
    created_at: '2026-05-05T12:00:00.000Z'
  },
  {
    post_id: 'post-2',
    campaign_id: 'camp-1',
    influencer_id: 'inf-4',
    platform: 'Instagram',
    post_url: 'https://instagram.com/p/CdSummerGlow2',
    post_date: '2026-05-08',
    created_at: '2026-05-08T14:30:00.000Z'
  },
  {
    post_id: 'post-3',
    campaign_id: 'camp-1',
    influencer_id: 'inf-5',
    platform: 'X',
    post_url: 'https://x.com/marcus_fit/status/1298371923',
    post_date: '2026-05-12',
    created_at: '2026-05-12T10:15:00.000Z'
  },
  {
    post_id: 'post-4',
    campaign_id: 'camp-2',
    influencer_id: 'inf-2',
    platform: 'YouTube',
    post_url: 'https://youtube.com/watch?v=AuraSmartBottleReview',
    post_date: '2026-04-20',
    created_at: '2026-04-20T17:00:00.000Z'
  },
  {
    post_id: 'post-5',
    campaign_id: 'camp-2',
    influencer_id: 'inf-6',
    platform: 'LinkedIn',
    post_url: 'https://linkedin.com/posts/elena-design-aura-workspace',
    post_date: '2026-04-28',
    created_at: '2026-04-28T09:00:00.000Z'
  }
];

const defaultMetrics = [
  {
    metric_id: 'met-1',
    post_id: 'post-1',
    reach: 48000,
    impressions: 62000,
    likes: 3100,
    comments: 240,
    shares: 110,
    clicks: 650,
    revenue_generated: 45000,
    recorded_at: '2026-05-10T12:00:00.000Z'
  },
  {
    metric_id: 'met-2',
    post_id: 'post-2',
    reach: 68000,
    impressions: 89000,
    likes: 5400,
    comments: 420,
    shares: 230,
    clicks: 1200,
    revenue_generated: 115000,
    recorded_at: '2026-05-12T12:00:00.000Z'
  },
  {
    metric_id: 'met-3',
    post_id: 'post-3',
    reach: 18000,
    impressions: 24000,
    likes: 850,
    comments: 95,
    shares: 45,
    clicks: 180,
    revenue_generated: 12000,
    recorded_at: '2026-05-15T12:00:00.000Z'
  },
  {
    metric_id: 'met-4',
    post_id: 'post-4',
    reach: 185000,
    impressions: 245000,
    likes: 12500,
    comments: 1100,
    shares: 890,
    clicks: 4500,
    revenue_generated: 380000,
    recorded_at: '2026-04-28T12:00:00.000Z'
  },
  {
    metric_id: 'met-5',
    post_id: 'post-5',
    reach: 22000,
    impressions: 31000,
    likes: 920,
    comments: 180,
    shares: 140,
    clicks: 380,
    revenue_generated: 28000,
    recorded_at: '2026-05-02T12:00:00.000Z'
  }
];

const defaultPayments = [
  {
    payment_id: 'pay-1',
    campaign_id: 'camp-1',
    influencer_id: 'inf-1',
    amount: 120000,
    payment_type: 'Cash',
    due_date: '2026-05-15',
    payment_date: '2026-05-14',
    payment_status: 'Paid',
    created_at: '2026-04-05T08:00:00.000Z'
  },
  {
    payment_id: 'pay-2',
    campaign_id: 'camp-1',
    influencer_id: 'inf-4',
    amount: 80000,
    payment_type: 'Cash',
    due_date: '2026-06-10',
    payment_date: null,
    payment_status: 'Pending',
    created_at: '2026-04-05T08:00:00.000Z'
  },
  {
    payment_id: 'pay-3',
    campaign_id: 'camp-1',
    influencer_id: 'inf-5',
    amount: 50000,
    payment_type: 'Hybrid',
    due_date: '2026-05-20',
    payment_date: null,
    payment_status: 'Pending', // Current local date is May 29, so this is overdue!
    created_at: '2026-04-05T08:00:00.000Z'
  },
  {
    payment_id: 'pay-4',
    campaign_id: 'camp-2',
    influencer_id: 'inf-2',
    amount: 250000,
    payment_type: 'Cash',
    due_date: '2026-05-01',
    payment_date: '2026-04-30',
    payment_status: 'Paid',
    created_at: '2026-03-20T08:00:00.000Z'
  },
  {
    payment_id: 'pay-5',
    campaign_id: 'camp-2',
    influencer_id: 'inf-6',
    amount: 60000,
    payment_type: 'Commission',
    due_date: '2026-05-22',
    payment_date: null,
    payment_status: 'Pending', // Overdue!
    created_at: '2026-03-20T08:00:00.000Z'
  }
];

// Helper to seed database if empty
function initializeLocalStorageDatabase() {
  const seedIfEmpty = (key: string, data: any) => {
    if (!localStorage.getItem(`inf_db_${key}`)) {
      localStorage.setItem(`inf_db_${key}`, JSON.stringify(data));
    }
  };

  seedIfEmpty('brands', [defaultBrand]);
  seedIfEmpty('users', defaultUsers);
  seedIfEmpty('user_brands', defaultUserBrands);
  seedIfEmpty('influencers', defaultInfluencers);
  seedIfEmpty('campaigns', defaultCampaigns);
  seedIfEmpty('campaign_influencers', defaultCampaignInfluencers);
  seedIfEmpty('posts', defaultPosts);
  seedIfEmpty('metrics', defaultMetrics);
  seedIfEmpty('payments', defaultPayments);

  // Auto seed first user session for easy onboarding
  if (!localStorage.getItem('inf_session')) {
    localStorage.setItem('inf_session', JSON.stringify({
      user: defaultUsers[0],
      access_token: 'mock-auth-token-12938'
    }));
  }
}

// Perform initialization
initializeLocalStorageDatabase();

let authListeners: Array<(event: string, session: any) => void> = [];

class SupabaseQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderField: string | null = null;
  private orderAscending: boolean = true;
  private limitCount: number | null = null;
  private columnsToSelect: string = '*';

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*') {
    this.columnsToSelect = columns;
    return this;
  }

  eq(column: string, value: any) {
    if (value === undefined || value === null) return this;
    
    if (Array.isArray(value)) {
      this.filters.push((item) => value.includes(item[column]));
    } else {
      this.filters.push((item) => String(item[column]) === String(value));
    }
    return this;
  }

  neq(column: string, value: any) {
    if (value === undefined || value === null) return this;
    this.filters.push((item) => String(item[column]) !== String(value));
    return this;
  }

  in(column: string, values: any[]) {
    if (!values || values.length === 0) return this;
    const strValues = values.map(v => String(v));
    this.filters.push((item) => strValues.includes(String(item[column])));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderField = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private getRawData(): any[] {
    const raw = localStorage.getItem(`inf_db_${this.tableName}`);
    return raw ? JSON.parse(raw) : [];
  }

  private saveRawData(data: any[]) {
    localStorage.setItem(`inf_db_${this.tableName}`, JSON.stringify(data));
  }

  private executeSelect(data: any[]): any[] {
    let result = data;
    
    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.orderField) {
      result.sort((a, b) => {
        const valA = a[this.orderField!];
        const valB = b[this.orderField!];
        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.orderAscending ? valA - valB : valB - valA;
        }
        return this.orderAscending
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // Apply nested table joins
    result = result.map((item) => {
      const cloned = { ...item };
      
      // Resolve brands(*)
      if (this.columnsToSelect.includes('brands(*)')) {
        const brands = JSON.parse(localStorage.getItem('inf_db_brands') || '[]');
        cloned.brands = brands.find((b: any) => b.brand_id === item.brand_id) || null;
      }
      
      // Resolve influencers(*) or influencers(name)
      if (this.columnsToSelect.includes('influencers(')) {
        const influencers = JSON.parse(localStorage.getItem('inf_db_influencers') || '[]');
        const matched = influencers.find((i: any) => i.influencer_id === item.influencer_id);
        if (matched) {
          if (this.columnsToSelect.includes('influencers(name)')) {
            cloned.influencers = { name: matched.name };
          } else {
            cloned.influencers = matched;
          }
        } else {
          cloned.influencers = null;
        }
      }
      
      return cloned;
    });

    // Apply limit
    if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }

    return result;
  }

  // Promise resolution support (async/await)
  async then(onfulfilled?: (value: { data: any[] | null; error: any }) => any) {
    const data = this.getRawData();
    
    // Auto-update overdue payment statuses dynamically based on current local date
    if (this.tableName === 'payments') {
      const todayStr = new Date().toISOString().split('T')[0];
      let updated = false;
      const updatedData = data.map((p: any) => {
        if (p.payment_status === 'Pending' && p.due_date && p.due_date < todayStr) {
          updated = true;
          return { ...p, payment_status: 'Overdue' };
        }
        return p;
      });
      if (updated) {
        this.saveRawData(updatedData);
      }
    }

    const result = this.executeSelect(this.getRawData());
    const response = { data: result, error: null };
    return onfulfilled ? onfulfilled(response) : response;
  }

  async single() {
    const data = this.getRawData();
    const result = this.executeSelect(data);
    const record = result.length > 0 ? result[0] : null;
    return { data: record, error: record ? null : { message: 'No record found' } };
  }

  async insert(recordOrRecords: any) {
    const data = this.getRawData();
    const isArray = Array.isArray(recordOrRecords);
    const records = isArray ? recordOrRecords : [recordOrRecords];

    const inserted: any[] = [];
    for (const r of records) {
      const newRecord = {
        ...r,
        created_at: new Date().toISOString(),
      };
      
      const idField = this.tableName === 'brands' ? 'brand_id' :
                      this.tableName === 'influencers' ? 'influencer_id' :
                      this.tableName === 'campaigns' ? 'campaign_id' :
                      this.tableName === 'posts' ? 'post_id' :
                      this.tableName === 'metrics' ? 'metric_id' :
                      this.tableName === 'payments' ? 'payment_id' : 'id';
      
      if (!newRecord[idField]) {
        newRecord[idField] = 'id-' + Math.random().toString(36).substr(2, 9);
      }

      data.push(newRecord);
      inserted.push(newRecord);
    }

    this.saveRawData(data);
    const singleObj = isArray ? inserted : inserted[0];
    
    return {
      data: singleObj,
      error: null,
      select: () => ({
        single: async () => ({ data: singleObj, error: null })
      })
    };
  }

  async update(updateData: any) {
    const data = this.getRawData();
    let updatedRecord: any = null;

    const updated = data.map((item) => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }
      if (matches) {
        const next = { ...item, ...updateData };
        updatedRecord = next;
        return next;
      }
      return item;
    });

    this.saveRawData(updated);
    return { data: updatedRecord, error: null };
  }

  async delete() {
    const data = this.getRawData();
    const remaining = data.filter((item) => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }
      return !matches;
    });
    this.saveRawData(remaining);
    return { data: null, error: null };
  }
}

// Complete mock client matching Supabase signature
export const supabase = {
  from(tableName: string) {
    return new SupabaseQueryBuilder(tableName);
  },
  
  auth: {
    async getSession() {
      const sessionStr = localStorage.getItem('inf_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return { data: { session }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    async signInWithPassword({ email, password }: any) {
      const users = JSON.parse(localStorage.getItem('inf_db_users') || '[]');
      const matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!matched) {
        return { error: { message: 'Invalid credentials. Use brand@aura.co or sign up!' }, data: { user: null } };
      }
      
      const session = { user: matched, access_token: 'mock-auth-token-key' };
      localStorage.setItem('inf_session', JSON.stringify(session));
      
      authListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { user: matched, session }, error: null };
    },

    async signUp({ email, password }: any) {
      const users = JSON.parse(localStorage.getItem('inf_db_users') || '[]');
      const exists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { error: { message: 'User already exists' }, data: { user: null } };
      }
      
      const newUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('inf_db_users', JSON.stringify(users));

      const session = { user: newUser, access_token: 'mock-auth-token-key' };
      localStorage.setItem('inf_session', JSON.stringify(session));

      authListeners.forEach(cb => cb('SIGNED_IN', session));
      return { data: { user: newUser, session }, error: null };
    },

    async signOut() {
      localStorage.removeItem('inf_session');
      authListeners.forEach(cb => cb('SIGNED_OUT', null));
      return { error: null };
    },

    onAuthStateChange(callback: any) {
      authListeners.push(callback);
      
      const sessionStr = localStorage.getItem('inf_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      callback('INITIAL_SESSION', session);

      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners = authListeners.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  }
} as any;

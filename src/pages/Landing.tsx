import React from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Shield, Rocket, LineChart, Star, Activity, Sparkles, Brain, Award, Bell } from 'lucide-react'

const Landing: React.FC = () => {
  return (
    <div className="landing">
      <nav className="landing-nav glass-panel" style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>I</div>
          <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InfluenceFlow AI</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm glow-btn" style={{ padding: '8px 16px' }}>Get Started</Link>
        </div>
      </nav>

      <header className="landing-hero" style={{ padding: '120px 24px 90px' }}>
        <span className="hero-badge" style={{ marginBottom: 20 }}>
          <Sparkles size={13}/> Enterprise-Grade AI CRM for Smart Brands
        </span>
        <h1 className="hero-title" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>Track Influencers.<br/>Predict ROI. Streamline Flow.</h1>
        <p className="hero-sub" style={{ fontSize: 18, maxWidth: '620px', color: 'var(--text-muted)', marginBottom: 40 }}>
          The premium full-stack dashboard to discover top-performing creators, monitor automated campaign metrics, audit live health scores, and automate payments.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary glow-btn" style={{ padding: '14px 32px', fontSize: 15 }}>
            Accelerate Influencer ROI Today <ArrowRight size={16}/>
          </Link>
        </div>
      </header>

      <section className="section">
        <h2 className="section-title" style={{ letterSpacing: '-0.02em' }}>Fully Automated Influencer Engine</h2>
        <p className="section-sub" style={{ maxWidth: '600px', margin: '0 auto 48px' }}>
          Stop juggling spreadsheets and manual logs. Deploy InfluenceFlow AI to centralize communications and calculate campaign returns instantly.
        </p>
        
        <div className="features-grid">
          {[
            { icon: <Shield style={{ color: '#6366f1' }}/>, name: 'Influencer CRM', desc: 'Centralize contacts, handles, contracts, and performance history secure in one visual workspace.' },
            { icon: <Brain style={{ color: '#10b981' }}/>, name: 'AI Recommendation Engine', desc: 'Instantly generate high-ROI recommendations tailored to Tech, Fashion, Food, Beauty, or Lifestyle niches.' },
            { icon: <LineChart style={{ color: '#f59e0b' }}/>, name: 'Metrics Autopilot', desc: 'Add content post URLs and let our engine automatically generate reach, impressions, likes, and sales revenue.' },
            { icon: <Award style={{ color: '#06b6d4' }}/>, name: 'Campaign Health index', desc: 'Audit active campaign performance with real-time health scores out of 100 assessing conversion parameters.' },
            { icon: <Bell style={{ color: '#ef4444' }}/>, name: 'Smart Alerts Engine', desc: 'Stay reactive with immediate alerts on upcoming payments, overdue dues, and high-performing creator ROIs.' },
            { icon: <Activity style={{ color: '#8b5cf6' }}/>, name: 'ROI Analytics Matrix', desc: 'Extract accurate Cost Per Engagement (CPE) and Cost Per Reach (CPR) to double down on what works.' }
          ].map(f => (
            <div key={f.name} className="feature-card glass-panel" style={{ border: '1px solid var(--border)' }}>
              <div className="feature-icon" style={{ background: 'var(--bg)' }}>{f.icon}</div>
              <h3 className="feature-name" style={{ color: 'var(--text)', fontSize: 16 }}>{f.name}</h3>
              <p className="feature-desc" style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <h2 className="section-title" style={{ letterSpacing: '-0.02em' }}>Scale Campaign Profitability</h2>
        <p className="section-sub">Choose a model built to supercharge brand visibility and conversions.</p>

        <div className="pricing-grid">
          {[
            { label: 'Starter', price: 'Free', features: ['Up to 5 CRM Influencers', '2 Active Campaigns', 'Manual Metrics Input', 'Dynamic Smart Alerts', 'Basic Analytics Reports'] },
            { label: 'Growth', price: '₹2,499', period: '/month', featured: true, features: ['Up to 25 CRM Influencers', '10 Active Campaigns', 'AI Influencer Recommendations', 'Automated Post Scraper Sim', 'Cost Per Engagement (CPE) Rollups', 'Automatic Upcoming Due Notices'] },
            { label: 'Pro', price: '₹6,599', period: '/month', features: ['Unlimited CRM Influencers', 'Unlimited Campaigns', 'Full Category AI Model Recommendations', 'Real-time Campaign Health Auditing', 'Priority High ROI Creator Alerts', 'Export PDF Financial Reports'] }
          ].map(p => (
            <div key={p.label} className={`pricing-card glass-panel ${p.featured ? 'featured' : ''}`} style={{ border: p.featured ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              {p.featured && <span className="pricing-badge glow-btn">RECOMMENDED</span>}
              <div className="pricing-label" style={{ fontSize: 12 }}>{p.label}</div>
              <div className="pricing-price" style={{ fontSize: 38, fontWeight: 900, color: 'var(--text)' }}>{p.price}</div>
              {p.period && <div className="pricing-period">{p.period}</div>}
              <ul className="pricing-features" style={{ margin: '20px 0 28px' }}>
                {p.features.map(f => (
                  <li key={f} className="pricing-feature" style={{ fontSize: 13, color: 'var(--text-muted)' }}><Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }}/> {f}</li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${p.featured ? 'btn-primary glow-btn' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                Deploy Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer glass-panel" style={{ borderTop: '1px solid var(--border)', padding: '24px 16px' }}>
        © {new Date().getFullYear()} InfluenceFlow AI. Crafted for placement excellence and modern brands.
      </footer>
    </div>
  )
}

export default Landing

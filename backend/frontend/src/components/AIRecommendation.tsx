import React, { useState, useEffect } from 'react'
import { Sparkles, UserPlus, Check, Instagram } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from './ui/Toast'

interface Recommendation {
  name: string
  instagram_handle: string
  email: string
  phone: string
  niche: string
  followers: number
  engagement_rate: number
  estRoi: number
  badgeType: 'roi' | 'eng' | 'top'
  badgeText: string
  reasoning: string
}

const mockRecommendations: Recommendation[] = [
  // TECH
  {
    name: 'Linus Techton',
    instagram_handle: 'linus_techton',
    email: 'linus@techton.com',
    phone: '+91 91111 88888',
    niche: 'Tech',
    followers: 780000,
    engagement_rate: 6.4,
    estRoi: 240,
    badgeType: 'top',
    badgeText: 'Top Tech Authority',
    reasoning: 'Exceptional organic CTR on hardware and gadget reviews. High male audience retention.'
  },
  {
    name: 'Clara Coder',
    instagram_handle: 'claracodes',
    email: 'clara@codes.dev',
    phone: '+91 92222 88888',
    niche: 'Tech',
    followers: 145000,
    engagement_rate: 8.2,
    estRoi: 310,
    badgeType: 'roi',
    badgeText: 'Highest ROI Specialist',
    reasoning: 'Unusually high course/affiliate purchase conversions from developers. Intimate community.'
  },
  {
    name: 'Dev Guru',
    instagram_handle: 'dev_guru',
    email: 'guru@devguru.net',
    phone: '+91 93333 88888',
    niche: 'Tech',
    followers: 980000,
    engagement_rate: 4.1,
    estRoi: 180,
    badgeType: 'eng',
    badgeText: 'High Engagement Guru',
    reasoning: 'Strong weekly video watch retention and thousands of bookmark-saves per tutorial.'
  },
  // FASHION
  {
    name: 'Mia Styles',
    instagram_handle: 'mia_styles',
    email: 'mia@stylesfashion.com',
    phone: '+91 94444 88888',
    niche: 'Fashion',
    followers: 420000,
    engagement_rate: 5.9,
    estRoi: 280,
    badgeType: 'roi',
    badgeText: 'Highest ROI Fashion',
    reasoning: 'High direct swipe-up retail conversions from Instagram Stories. Perfect capsule wardrobe fit.'
  },
  {
    name: 'Oliver Trend',
    instagram_handle: 'oliver_trends',
    email: 'oliver@trends.com',
    phone: '+91 95555 88888',
    niche: 'Fashion',
    followers: 160000,
    engagement_rate: 7.1,
    estRoi: 220,
    badgeType: 'eng',
    badgeText: 'High Engagement Specialist',
    reasoning: 'Extremely high comment/share ratio on styling lookbooks. Highly responsive audience.'
  },
  {
    name: 'Sofia Chic',
    instagram_handle: 'sofia_chic',
    email: 'sofia@chicstyle.com',
    phone: '+91 96666 88888',
    niche: 'Fashion',
    followers: 1200000,
    engagement_rate: 3.8,
    estRoi: 190,
    badgeType: 'top',
    badgeText: 'Top Performer Badge',
    reasoning: 'Massive luxury brand reach, premium photo quality, and active design collaboration history.'
  },
  // FOOD
  {
    name: 'Chef Marco',
    instagram_handle: 'chef_marcos',
    email: 'marco@kitchen.com',
    phone: '+91 97777 88888',
    niche: 'Food',
    followers: 350000,
    engagement_rate: 6.8,
    estRoi: 260,
    badgeType: 'roi',
    badgeText: 'Highest ROI Foodie',
    reasoning: 'Strong coupon code redemption rate for kitchen appliances and organic delivery boxes.'
  },
  {
    name: 'Emily Eats',
    instagram_handle: 'emily_eats_world',
    email: 'emily@eatsworld.co',
    phone: '+91 98888 88888',
    niche: 'Food',
    followers: 640000,
    engagement_rate: 5.4,
    estRoi: 200,
    badgeType: 'top',
    badgeText: 'Top Performer Food',
    reasoning: 'High recipe save rates and deep engagement with street food culture and visual recipes.'
  },
  {
    name: 'Spiced Up',
    instagram_handle: 'spiced_up_recipes',
    email: 'hello@spicedup.in',
    phone: '+91 99999 88888',
    niche: 'Food',
    followers: 90000,
    engagement_rate: 9.1,
    estRoi: 350,
    badgeType: 'eng',
    badgeText: 'Micro-Influencer Star',
    reasoning: 'Exceptional viral organic reach on short recipe reels. Unprecedented 9% engagement rate.'
  },
  // BEAUTY
  {
    name: 'Zoe Glow',
    instagram_handle: 'zoe_glow',
    email: 'zoe@glowbeauty.com',
    phone: '+91 90000 77777',
    niche: 'Beauty',
    followers: 580000,
    engagement_rate: 5.7,
    estRoi: 290,
    badgeType: 'roi',
    badgeText: 'Highest ROI Beauty',
    reasoning: 'Proven conversions on clean makeup line launches. Massive high-intent beauty audience.'
  },
  {
    name: 'Lily Blush',
    instagram_handle: 'lily_blush',
    email: 'lily@blushbeauty.com',
    phone: '+91 91111 77777',
    niche: 'Beauty',
    followers: 230000,
    engagement_rate: 7.8,
    estRoi: 240,
    badgeType: 'eng',
    badgeText: 'Engagement Leader',
    reasoning: 'Excellent question-comment interactions on tutorials and high user product saves.'
  },
  {
    name: 'Glam By Sam',
    instagram_handle: 'glambysam',
    email: 'sam@glambysam.co',
    phone: '+91 92222 77777',
    niche: 'Beauty',
    followers: 850000,
    engagement_rate: 4.5,
    estRoi: 210,
    badgeType: 'top',
    badgeText: 'Top Category Leader',
    reasoning: 'Vast reach, high-fidelity production studio, and regular sponsorships with cosmetics giants.'
  },
  // LIFESTYLE
  {
    name: 'Wanderlust Jack',
    instagram_handle: 'wanderjack',
    email: 'jack@wanderlust.com',
    phone: '+91 93333 77777',
    niche: 'Lifestyle',
    followers: 490000,
    engagement_rate: 5.1,
    estRoi: 230,
    badgeType: 'roi',
    badgeText: 'Highest ROI Travel',
    reasoning: 'Superb conversions on active hotel bookings and adventure gear discount links.'
  },
  {
    name: 'Nomad Chloe',
    instagram_handle: 'nomad_chloe',
    email: 'chloe@nomadlife.com',
    phone: '+91 94444 77777',
    niche: 'Lifestyle',
    followers: 150000,
    engagement_rate: 8.5,
    estRoi: 330,
    badgeType: 'eng',
    badgeText: 'High Engagement Nomad',
    reasoning: 'Extremely loyal micro-community with active dialogue in comment threads. High CTR on lifestyle products.'
  },
  {
    name: 'Aura Living',
    instagram_handle: 'auraliving',
    email: 'contact@auraliving.co',
    phone: '+91 95555 77777',
    niche: 'Lifestyle',
    followers: 720000,
    engagement_rate: 4.4,
    estRoi: 190,
    badgeType: 'top',
    badgeText: 'Lifestyle Icon',
    reasoning: 'Consistent sponsorship performance in home design, slow living, and self-care niches.'
  }
]

interface Props {
  onInfluencerRecruited?: () => void
}

export const AIRecommendation: React.FC<Props> = ({ onInfluencerRecruited }) => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [niche, setNiche] = useState<string>('Tech')
  const [objective, setObjective] = useState<string>('roi')
  const [recruitedHandles, setRecruitedHandles] = useState<string[]>([])
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchExisting = async () => {
      if (!brand) return
      try {
        const { data } = await api.get(`/influencers/brand/${brand.id}`)
        if (data) {
          setRecruitedHandles(data.map((i: any) => i.platformHandle))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchExisting()
  }, [brand])

  const handleAdd = async (rec: Recommendation) => {
    if (!brand) return
    setLoading(rec.instagram_handle)

    try {
      const payload = {
        brand: { id: brand.id },
        name: rec.name,
        platformHandle: rec.instagram_handle,
        platform: 'Instagram',
        email: rec.email,
        phone: rec.phone,
        niche: rec.niche,
        followers: rec.followers,
        engagementRate: rec.engagement_rate
      }

      await api.post('/influencers', payload)
      showToast('success', `${rec.name} has been added to your CRM network successfully!`)
      setRecruitedHandles(prev => [...prev, rec.instagram_handle])
      if (onInfluencerRecruited) onInfluencerRecruited()
    } catch (err: any) {
      showToast('error', err.message || 'An error occurred')
    } finally {
      setLoading(null)
    }
  }

  // Filter recommendations
  const filtered = mockRecommendations
    .filter(r => r.niche === niche)
    .sort((a, b) => {
      if (objective === 'roi') return b.estRoi - a.estRoi
      if (objective === 'eng') return b.engagement_rate - a.engagement_rate
      return b.followers - a.followers
    })

  const getBadgeClass = (type: string) => {
    if (type === 'roi') return 'badge-roi'
    if (type === 'eng') return 'badge-eng'
    return 'badge-top'
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div className="card glass-panel" style={{ padding: '20px 24px', marginBottom: 24, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: 8, background: 'rgba(99, 102, 241, 0.12)', borderRadius: 8, color: 'var(--primary)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Influencer Recommendation Engine</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Our neural campaign model ranks candidates cross-referencing industry conversions, aesthetic affinity, and follower purchase intent.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Select Niche</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Tech', 'Fashion', 'Food', 'Beauty', 'Lifestyle'].map(n => (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  className="tab"
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    background: niche === n ? 'var(--surface)' : 'transparent',
                    color: niche === n ? 'var(--primary)' : 'var(--text-muted)',
                    border: niche === n ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: niche === n ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Optimize For</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="filter-select"
              style={{ padding: '6px 12px', fontSize: 12, minWidth: 160 }}
            >
              <option value="roi">Highest Estimated ROI %</option>
              <option value="eng">Maximum Audience Engagement</option>
              <option value="reach">Maximum Direct Followers</option>
            </select>
          </div>
        </div>
      </div>

      <div className="influencer-grid">
        {filtered.map((rec) => {
          const isRecruited = recruitedHandles.includes(rec.instagram_handle)
          return (
            <div 
              key={rec.instagram_handle} 
              className="influencer-card glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16
                  }}>
                    {rec.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className={`badge ${getBadgeClass(rec.badgeType)}`} style={{ fontSize: 11 }}>
                    {rec.badgeText}
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>{rec.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                    <Instagram size={12} />
                    <span>@{rec.instagram_handle}</span>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg)', padding: 10, borderRadius: 8, margin: '8px 0 16px', border: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', fontSize: 10, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    AI Prediction Insight:
                  </strong>
                  "{rec.reasoning}"
                </p>

                <div className="influencer-stats" style={{ marginTop: 0, marginBottom: 16 }}>
                  <div className="inf-stat">
                    <div className="inf-stat-val" style={{ fontSize: 14 }}>
                      {rec.followers >= 1000000 ? `${(rec.followers / 1000000).toFixed(1)}M` : `${(rec.followers / 1000).toFixed(0)}K`}
                    </div>
                    <div className="inf-stat-label">Reach</div>
                  </div>
                  <div className="inf-stat">
                    <div className="inf-stat-val" style={{ fontSize: 14, color: 'var(--success)' }}>
                      {rec.estRoi}%
                    </div>
                    <div className="inf-stat-label">Est. ROI</div>
                  </div>
                  <div className="inf-stat" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', padding: '6px 12px' }}>
                    <span className="inf-stat-label" style={{ alignSelf: 'center' }}>Avg Engagement</span>
                    <span className="inf-stat-val" style={{ fontSize: 13, color: 'var(--primary)' }}>{rec.engagement_rate}%</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleAdd(rec)}
                  disabled={isRecruited || loading === rec.instagram_handle}
                  className={`btn ${isRecruited ? 'btn-secondary' : 'btn-primary glow-btn'}`}
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  {loading === rec.instagram_handle ? (
                    <div className="spinner" style={{ width: 14, height: 14 }} />
                  ) : isRecruited ? (
                    <>
                      <Check size={14} />
                      Recruited
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Add to CRM Network
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default AIRecommendation

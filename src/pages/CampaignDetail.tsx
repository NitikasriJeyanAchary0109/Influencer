import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import HealthScore from '../components/ui/HealthScore'
import { formatCurrency, formatNumber, calcROI, formatDate } from '../lib/utils'
import { ArrowLeft, Users, FileText, CreditCard, ChevronRight, Activity } from 'lucide-react'

interface Campaign {
  campaign_id: string
  campaign_name: string
  description: string
  budget: number
  start_date: string
  end_date: string
  status: string
}

interface MetricSummary {
  reach: number
  impressions: number
  likes: number
  comments: number
  shares: number
  clicks: number
  revenue: number
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [influencers, setInfluencers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [metrics, setMetrics] = useState<MetricSummary>({ reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  const loadDetail = useCallback(async () => {
    if (!brand || !id) return
    const { data: cam } = await supabase.from('campaigns').select('*').eq('campaign_id', id).single()
    if (!cam) {
      showToast('error', 'Campaign not found')
      navigate('/campaigns')
      return
    }
    setCampaign(cam)

    // Load Campaign Influencers
    const { data: camInfs } = await supabase
      .from('campaign_influencers')
      .select('influencer_id, influencers(*)')
      .eq('campaign_id', id)
    const infList = (camInfs || []).map((ci: any) => ci.influencers)
    setInfluencers(infList)

    // Load Posts & Metrics
    const { data: postList } = await supabase.from('posts').select('*').eq('campaign_id', id)
    setPosts(postList || [])

    if (postList && postList.length > 0) {
      const pIds = postList.map((p: any) => p.post_id)
      const { data: metList } = await supabase.from('metrics').select('*').in('post_id', pIds)
      
      const summary = { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, revenue: 0 }
      ;(metList || []).forEach((m: any) => {
        summary.reach += m.reach || 0
        summary.impressions += m.impressions || 0
        summary.likes += m.likes || 0
        summary.comments += m.comments || 0
        summary.shares += m.shares || 0
        summary.clicks += m.clicks || 0
        summary.revenue += Number(m.revenue_generated) || 0
      })
      setMetrics(summary)
    }

    // Load Payments
    const { data: payList } = await supabase.from('payments').select('*, influencers(name)').eq('campaign_id', id)
    setPayments(payList || [])

    setLoading(false)
  }, [brand, id, navigate, showToast])

  useEffect(() => { loadDetail() }, [loadDetail])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div>
  if (!campaign) return null

  const spend = payments.filter(p => p.payment_status === 'Paid').reduce((acc, p) => acc + Number(p.amount), 0)
  const pendingSpend = payments.filter(p => p.payment_status === 'Pending').reduce((acc, p) => acc + Number(p.amount), 0)
  const roi = calcROI(metrics.revenue, spend)

  // Health Score Inputs
  const healthInput = {
    totalEngagement: metrics.likes + metrics.comments + metrics.shares,
    targetEngagement: influencers.reduce((acc, i) => acc + Math.floor((i.followers || 0) * (i.engagement_rate || 0) / 100), 0) || 5000,
    totalReach: metrics.reach,
    targetReach: influencers.reduce((acc, i) => acc + Math.floor((i.followers || 0) * 0.3), 0) || 10000,
    roi,
    spend,
    budget: campaign.budget
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn-icon" onClick={() => navigate('/campaigns')}><ArrowLeft size={16}/></button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{campaign.campaign_name}</h2>
            <span className="badge badge-active">{campaign.status}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Timeline: {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card glass-panel" style={{ border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Campaign Metrics Overview</div>
              <Activity size={18} style={{ color: 'var(--primary)' }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Engagement (L+C+S)</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{formatNumber(healthInput.totalEngagement)}</div>
              </div>
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Reach</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{formatNumber(metrics.reach)}</div>
              </div>
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Revenue ROI</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: roi >= 0 ? 'var(--success)' : 'var(--danger)' }}>{roi.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="card glass-panel" style={{ border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16}/> Assigned Influencers ({influencers.length})
            </div>
            {influencers.length === 0 ? <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 14 }}>No influencers assigned yet</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {influencers.map(inf => (
                  <div key={inf.influencer_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: 'var(--bg)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{inf.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{inf.instagram_handle} • {inf.niche}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{formatNumber(inf.followers)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Followers</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
            <HealthScore input={healthInput}/>
          </div>

          <div className="card glass-panel" style={{ border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Financial Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Budget</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(campaign.budget)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Paid to Date</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(spend)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Pending Payments</span>
                <span style={{ fontWeight: 600, color: 'var(--warning)' }}>{formatCurrency(pendingSpend)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CampaignDetail

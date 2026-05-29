import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import HealthScore from '../components/ui/HealthScore'
import { formatCurrency, formatNumber, calcROI, formatDate } from '../lib/utils'
import { ArrowLeft, Users, Activity } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  budget: number
  startDate: string
  endDate: string
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
    try {
      const { data: cam } = await api.get(`/campaigns/${id}`)
      if (!cam) {
        showToast('error', 'Campaign not found')
        navigate('/campaigns')
        return
      }
      setCampaign(cam)

      // Assuming backend has or will have these endpoints
      try {
        // Load Posts
        const { data: postList } = await api.get(`/posts/campaign/${id}`)
        setPosts(postList || [])
        
        // Mocking metrics summary calculation for now until we build a /analytics/campaign endpoint
        if (postList && postList.length > 0) {
          const summary = { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, revenue: 0 }
          setMetrics(summary)
        }

        // Load Payments
        const { data: payList } = await api.get(`/payments/campaign/${id}`)
        setPayments(payList || [])

        // Load Campaign Influencers - Assuming we'll build this endpoint
        // const { data: camInfs } = await api.get(`/campaigns/${id}/influencers`)
        // setInfluencers(camInfs || [])
        setInfluencers([])
      } catch (e) {
        console.warn("Some related data could not be loaded", e)
      }

    } catch (e) {
      showToast('error', 'Campaign not found')
      navigate('/campaigns')
    } finally {
      setLoading(false)
    }
  }, [brand, id, navigate, showToast])

  useEffect(() => { loadDetail() }, [loadDetail])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div>
  if (!campaign) return null

  const spend = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + Number(p.amount), 0)
  const pendingSpend = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + Number(p.amount), 0)
  const roi = calcROI(metrics.revenue, spend)

  // Health Score Inputs
  const healthInput = {
    totalEngagement: metrics.likes + metrics.comments + metrics.shares,
    targetEngagement: influencers.reduce((acc, i) => acc + Math.floor((i.followers || 0) * (i.engagementRate || 0) / 100), 0) || 5000,
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
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>{campaign.title}</h2>
            <span className="badge badge-active">{campaign.status}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Timeline: {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</div>
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
                  <div key={inf.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: 'var(--bg)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{inf.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{inf.platformHandle} • {inf.niche}</div>
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

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { formatCurrency, formatNumber, calcROI, calcCPE, calcCPR } from '../lib/utils'
import KPICard from '../components/ui/KPICard'
import { DollarSign, Eye, Award, Flame } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend, Title)
ChartJS.defaults.color = 'rgba(255, 255, 255, 0.7)'
ChartJS.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.1)'

interface AnalyticsData {
  totalSpend: number
  totalRevenue: number
  totalReach: number
  totalImpressions: number
  totalLikes: number
  totalComments: number
  totalShares: number
  influencerROI: { name: string; roi: number; engagement: number }[]
  platformDistribution: Record<string, number>
}

const Analytics: React.FC = () => {
  const { brand } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!brand) return
    const fetchAnalytics = async () => {
      const { data: cams } = await supabase.from('campaigns').select('campaign_id, campaign_name, budget').eq('brand_id', brand.brand_id)
      const camIds = (cams || []).map((c: any) => c.campaign_id)

      if (camIds.length === 0) {
        setData({
          totalSpend: 0, totalRevenue: 0, totalReach: 0, totalImpressions: 0,
          totalLikes: 0, totalComments: 0, totalShares: 0, influencerROI: [], platformDistribution: {}
        })
        setLoading(false)
        return
      }

      const [payRes, postRes] = await Promise.all([
        supabase.from('payments').select('amount, influencer_id').in('campaign_id', camIds),
        supabase.from('posts').select('post_id, platform, influencer_id, influencers(name)').in('campaign_id', camIds)
      ])

      const postIds = (postRes.data || []).map((p: any) => p.post_id)
      let metrics: any[] = []
      if (postIds.length > 0) {
        const { data: metRes } = await supabase.from('metrics').select('*').in('post_id', postIds)
        metrics = metRes || []
      }

      // Roll up metrics
      let totalReach = 0, totalImpressions = 0, totalLikes = 0, totalComments = 0, totalShares = 0, totalRevenue = 0
      metrics.forEach((m: any) => {
        totalReach += m.reach || 0
        totalImpressions += m.impressions || 0
        totalLikes += m.likes || 0
        totalComments += m.comments || 0
        totalShares += m.shares || 0
        totalRevenue += m.revenue_generated || 0
      })

      const totalSpend = (payRes.data || []).reduce((s: number, p: any) => s + (p.amount || 0), 0)

      // Platforms distribution
      const platformDistribution: Record<string, number> = {}
      ;(postRes.data || []).forEach((p: any) => {
        platformDistribution[p.platform] = (platformDistribution[p.platform] || 0) + 1
      })

      // Group ROI / Engagement by Influencer
      const infMap: Record<string, { name: string; spend: number; revenue: number; engagement: number }> = {}
      ;(postRes.data || []).forEach((p: any) => {
        if (!p.influencer_id) return
        const infName = p.influencers?.name || 'Influencer'
        if (!infMap[p.influencer_id]) {
          infMap[p.influencer_id] = { name: infName, spend: 0, revenue: 0, engagement: 0 }
        }
      })
      ;(payRes.data || []).forEach((p: any) => {
        if (p.influencer_id && infMap[p.influencer_id]) {
          infMap[p.influencer_id].spend += p.amount || 0
        }
      })
      ;(postRes.data || []).forEach((p: any) => {
        const pMetrics = metrics.filter(m => m.post_id === p.post_id)
        pMetrics.forEach(m => {
          if (p.influencer_id && infMap[p.influencer_id]) {
            infMap[p.influencer_id].revenue += m.revenue_generated || 0
            infMap[p.influencer_id].engagement += (m.likes || 0) + (m.comments || 0) + (m.shares || 0)
          }
        })
      })

      const influencerROI = Object.values(infMap).map(i => ({
        name: i.name,
        roi: calcROI(i.revenue, i.spend),
        engagement: i.engagement
      }))

      setData({
        totalSpend, totalRevenue, totalReach, totalImpressions,
        totalLikes, totalComments, totalShares, influencerROI, platformDistribution
      })
      setLoading(false)
    }

    fetchAnalytics()
  }, [brand])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div>
  if (!data) return null

  const overallROI = calcROI(data.totalRevenue, data.totalSpend)
  const totalEng = data.totalLikes + data.totalComments + data.totalShares

  // Platforms chart
  const pLabels = Object.keys(data.platformDistribution)
  const pValues = Object.values(data.platformDistribution)
  const doughnutData = {
    labels: pLabels.length ? pLabels : ['No Posts'],
    datasets: [{
      data: pValues.length ? pValues : [1],
      backgroundColor: ['#e1306c', '#ff0000', '#1877f2', '#000000', '#0a66c2', '#94a3b8'],
      borderWidth: 0
    }]
  }

  // Influencers Comparison
  const barData = {
    labels: data.influencerROI.map(i => i.name),
    datasets: [
      {
        label: 'ROI (%)',
        data: data.influencerROI.map(i => i.roi),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 6
      }
    ]
  }

  const radarData = {
    labels: ['Reach', 'Impressions', 'Likes', 'Comments', 'Shares'],
    datasets: [
      {
        label: 'Funnel Engagement Distribution',
        data: [
          data.totalReach * 0.1,
          data.totalImpressions * 0.05,
          data.totalLikes * 0.5,
          data.totalComments,
          data.totalShares * 2
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        borderWidth: 2
      }
    ]
  }

  // Smart Features badges
  const bestROIInf = [...data.influencerROI].sort((a, b) => b.roi - a.roi)[0]
  const bestEngInf = [...data.influencerROI].sort((a, b) => b.engagement - a.engagement)[0]

  return (
    <>
      <div className="kpi-grid">
        <KPICard label="Total Spend" value={formatCurrency(data.totalSpend)} sub="Total investment" color="#6366f1" icon={<DollarSign size={40}/>}/>
        <KPICard label="Revenue ROI" value={`${overallROI.toFixed(1)}%`} sub="Overall performance" color={overallROI >= 0 ? '#10b981' : '#ef4444'} icon={<Flame size={40}/>}/>
        <KPICard label="Reach & Impressions" value={formatNumber(data.totalReach)} sub={`${formatNumber(data.totalImpressions)} Impressions`} color="#f59e0b" icon={<Eye size={40}/>}/>
        <KPICard label="Total Engagement" value={formatNumber(totalEng)} sub="Likes + Comments + Shares" color="#06b6d4" icon={<Award size={40}/>}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="chart-card">
          <div className="chart-title">Highest ROI Influencers</div>
          <div className="chart-sub">Comparing ROI percentage generated by influencer partnerships</div>
          {data.influencerROI.length ? <Bar data={barData} options={{ responsive: true }}/> : <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No influencer ROI tracked yet</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Smart Performance Badges</div>
            {bestROIInf && bestROIInf.roi > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.08))', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 24 }}>🏆</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Top Performer Badge</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{bestROIInf.name} with {bestROIInf.roi.toFixed(0)}% ROI</div>
                </div>
              </div>
            ) : null}

            {bestEngInf && bestEngInf.engagement > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08))', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 10 }}>
                <div style={{ fontSize: 24 }}>⚡</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Most Engagement Badge</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{bestEngInf.name} ({formatNumber(bestEngInf.engagement)} interactions)</div>
                </div>
              </div>
            ) : <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 13 }}>Track posts to unlock creator performance badges</div>}
          </div>

          <div className="chart-card">
            <div className="chart-title">Platform Distribution</div>
            <div className="chart-sub">Breakdown of posts by channel</div>
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}/>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Engagement Funnel Radar</div>
          <div className="chart-sub">Visual scale of total audience outreach lifecycle</div>
          <Radar data={radarData} options={{ responsive: true, plugins: { legend: { display: false } } }}/>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="chart-title" style={{ marginBottom: 16 }}>Efficiency Calculations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg)', borderRadius: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Cost Per Engagement (CPE)</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                {totalEng > 0 ? `₹${(data.totalSpend / totalEng).toFixed(2)}` : '₹0.00'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg)', borderRadius: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Cost Per Reach (CPR)</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>
                {data.totalReach > 0 ? `₹${(data.totalSpend / data.totalReach).toFixed(2)}` : '₹0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Analytics

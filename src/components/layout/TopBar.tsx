import React, { useEffect, useState } from 'react'
import { Sun, Moon, Bell, AlertTriangle, AlertCircle, Sparkles, Award, Check } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { supabase } from '../../lib/supabase'
import { isOverdue, formatDate } from '../../lib/utils'

interface Props { title: string; sub?: string }

interface AlertItem {
  id: string
  type: 'danger' | 'warning' | 'info' | 'success'
  title: string
  desc: string
  icon: React.ReactNode
}

const TopBar: React.FC<Props> = ({ title, sub }) => {
  const { theme, toggleTheme } = useTheme()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [showDrawer, setShowDrawer] = useState(false)

  const loadAlerts = async () => {
    const list: AlertItem[] = []
    
    // 1. Fetch campaigns and payments
    const { data: campaigns } = await supabase.from('campaigns').select('*')
    const { data: payments } = await supabase.from('payments').select('*, influencers(name)')
    const { data: posts } = await supabase.from('posts').select('*')
    const { data: metrics } = await supabase.from('metrics').select('*')

    if (payments) {
      // Overdue payments (Pending status AND past due date)
      const overdue = payments.filter((p: any) => p.payment_status === 'Overdue' || (p.payment_status === 'Pending' && isOverdue(p.due_date, p.payment_status)))
      overdue.forEach((p: any) => {
        list.push({
          id: `overdue-${p.payment_id}`,
          type: 'danger',
          title: 'Overdue Payment',
          desc: `₹${p.amount.toLocaleString('en-IN')} to ${p.influencers?.name || 'influencer'} was due on ${formatDate(p.due_date)}`,
          icon: <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
        })
      })

      // Upcoming due in 14 days
      const today = new Date()
      const fourteenDaysFromNow = new Date()
      fourteenDaysFromNow.setDate(today.getDate() + 14)
      
      const upcoming = payments.filter((p: any) => {
        if (p.payment_status !== 'Pending') return false
        const due = new Date(p.due_date)
        return due >= today && due <= fourteenDaysFromNow
      })
      upcoming.forEach((p: any) => {
        list.push({
          id: `upcoming-${p.payment_id}`,
          type: 'warning',
          title: 'Upcoming Payment',
          desc: `₹${p.amount.toLocaleString('en-IN')} due to ${p.influencers?.name || 'influencer'} on ${formatDate(p.due_date)}`,
          icon: <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
        })
      })
    }

    if (campaigns) {
      const today = new Date()
      const fifteenDaysFromNow = new Date()
      fifteenDaysFromNow.setDate(today.getDate() + 15)

      // Active campaigns ending soon
      campaigns.forEach((c: any) => {
        if (c.status === 'Active' && c.end_date) {
          const end = new Date(c.end_date)
          if (end >= today && end <= fifteenDaysFromNow) {
            list.push({
              id: `ending-${c.campaign_id}`,
              type: 'info',
              title: 'Campaign Ending Soon',
              desc: `"${c.campaign_name}" will end on ${formatDate(c.end_date)}`,
              icon: <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            })
          }
        }
      })
    }

    if (metrics && posts && payments) {
      // Find top performers (ROI > 100%)
      const influencersMap = JSON.parse(localStorage.getItem('inf_db_influencers') || '[]')
      const campaignsMap = JSON.parse(localStorage.getItem('inf_db_campaigns') || '[]')
      
      metrics.forEach((m: any) => {
        const post = posts.find((p: any) => p.post_id === m.post_id)
        if (post) {
          const campaign = campaignsMap.find((c: any) => c.campaign_id === post.campaign_id)
          const payment = payments.find((pay: any) => pay.campaign_id === post.campaign_id && pay.influencer_id === post.influencer_id)
          const influencer = influencersMap.find((i: any) => i.influencer_id === post.influencer_id)

          if (campaign && payment && influencer) {
            const spend = payment.amount || 1
            const roi = ((m.revenue_generated - spend) / spend) * 100
            if (roi > 100) {
              list.push({
                id: `high-perf-${m.metric_id}`,
                type: 'success',
                title: 'High ROI Creator',
                desc: `${influencer.name} achieved ${roi.toFixed(0)}% ROI in "${campaign.campaign_name}"`,
                icon: <Award size={16} style={{ color: 'var(--success)' }} />
              })
            }
          }
        }
      })
    }

    // Default tip if no alerts
    if (list.length === 0) {
      list.push({
        id: 'no-alerts',
        type: 'success',
        title: 'All Systems Normal',
        desc: 'Campaign parameters look excellent. No overdue payments or items needing attention.',
        icon: <Check size={16} style={{ color: 'var(--success)' }} />
      })
    }

    setAlerts(list)
  }

  useEffect(() => {
    loadAlerts()
    
    // Listen for storage changes
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {sub && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
      <div className="topbar-actions" style={{ position: 'relative' }}>
        {/* Theme Toggle */}
        <button className="btn-icon animate-hover" title="Toggle theme" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
        </button>

        {/* Notifications Dropdown */}
        <button 
          className="btn-icon animate-hover" 
          title="Smart Alerts"
          onClick={() => setShowDrawer(!showDrawer)}
          style={{ position: 'relative' }}
        >
          <Bell size={18}/>
          {alerts.length > 0 && alerts[0].id !== 'no-alerts' && (
            <span style={{ 
              position: 'absolute', 
              top: 4, 
              right: 4, 
              width: 8, 
              height: 8, 
              background: 'var(--danger)', 
              borderRadius: '50%' 
            }}/>
          )}
        </button>

        {showDrawer && (
          <div className="alert-drawer">
            <div className="alert-drawer-title">
              <span>Smart Alerts Engine</span>
              <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
                {alerts[0].id === 'no-alerts' ? 0 : alerts.length} Active
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '280px', overflowY: 'auto' }}>
              {alerts.map((item) => (
                <div key={item.id} className="alert-drawer-item">
                  {item.icon}
                  <div>
                    <div className="alert-drawer-item-title">{item.title}</div>
                    <div className="alert-drawer-item-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar

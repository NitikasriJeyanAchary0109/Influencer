import React, { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, AlertTriangle, AlertCircle, Sparkles, Award, Check, MapPin, Settings, Layers } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
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
  const { brand } = useAuth()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [showDrawer, setShowDrawer] = useState(false)

  const loadAlerts = useCallback(async () => {
    if (!brand) return
    const list: AlertItem[] = []
    
    try {
      const { data: campaigns } = await api.get(`/campaigns/brand/${brand.id}`)
      
      let payments: any[] = []
      let posts: any[] = []

      if (campaigns && campaigns.length > 0) {
        const camIds = campaigns.map((c: any) => c.id)
        
        // Load payments and posts for these campaigns
        const payRes = await Promise.all(camIds.map((id: string) => api.get(`/payments/campaign/${id}`).catch(() => ({ data: [] }))))
        const postRes = await Promise.all(camIds.map((id: string) => api.get(`/posts/campaign/${id}`).catch(() => ({ data: [] }))))
        
        payments = payRes.flatMap(r => r.data || [])
        posts = postRes.flatMap(r => r.data || [])
      }

      // Mock metrics for now (since we don't have a robust metrics endpoint)
      const metrics: any[] = []

      if (payments && payments.length > 0) {
        // Overdue payments
        const overdue = payments.filter((p: any) => p.status === 'OVERDUE' || (p.status === 'PENDING' && isOverdue(p.dueDate, p.status)))
        overdue.forEach((p: any) => {
          list.push({
            id: `overdue-${p.id}`,
            type: 'danger',
            title: 'Overdue Payment',
            desc: `₹${p.amount.toLocaleString('en-IN')} to ${p.influencer?.name || 'influencer'} was due on ${formatDate(p.dueDate)}`,
            icon: <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
          })
        })

        // Upcoming due in 14 days
        const today = new Date()
        const fourteenDaysFromNow = new Date()
        fourteenDaysFromNow.setDate(today.getDate() + 14)
        
        const upcoming = payments.filter((p: any) => {
          if (p.status !== 'PENDING') return false
          const due = new Date(p.dueDate)
          return due >= today && due <= fourteenDaysFromNow
        })
        upcoming.forEach((p: any) => {
          list.push({
            id: `upcoming-${p.id}`,
            type: 'warning',
            title: 'Upcoming Payment',
            desc: `₹${p.amount.toLocaleString('en-IN')} due to ${p.influencer?.name || 'influencer'} on ${formatDate(p.dueDate)}`,
            icon: <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
          })
        })
      }

      if (campaigns && campaigns.length > 0) {
        const today = new Date()
        const fifteenDaysFromNow = new Date()
        fifteenDaysFromNow.setDate(today.getDate() + 15)

        // Active campaigns ending soon
        campaigns.forEach((c: any) => {
          if (c.status === 'Active' && c.endDate) {
            const end = new Date(c.endDate)
            if (end >= today && end <= fifteenDaysFromNow) {
              list.push({
                id: `ending-${c.id}`,
                type: 'info',
                title: 'Campaign Ending Soon',
                desc: `"${c.title}" will end on ${formatDate(c.endDate)}`,
                icon: <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              })
            }
          }
        })
      }

      if (metrics.length > 0 && posts.length > 0 && payments.length > 0) {
        metrics.forEach((m: any) => {
          const post = posts.find((p: any) => p.id === m.postId)
          if (post) {
            const campaign = campaigns.find((c: any) => c.id === post.campaign?.id)
            const payment = payments.find((pay: any) => pay.campaign?.id === post.campaign?.id && pay.influencer?.id === post.influencer?.id)
            const influencer = post.influencer

            if (campaign && payment && influencer) {
              const spend = payment.amount || 1
              const roi = ((m.revenueGenerated - spend) / spend) * 100
              if (roi > 100) {
                list.push({
                  id: `high-perf-${m.id}`,
                  type: 'success',
                  title: 'High ROI Creator',
                  desc: `${influencer.name} achieved ${roi.toFixed(0)}% ROI in "${campaign.title}"`,
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
    } catch (e) {
      console.error('Failed to load alerts', e)
    }
  }, [brand])

  useEffect(() => {
    loadAlerts()
    
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [loadAlerts])

  const location = useLocation()
  
  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Search', path: '/influencers' },
    { name: 'Messages', path: '/campaigns' },
    { name: 'Community', path: '/posts' },
    { name: 'Resources', path: '/analytics' },
  ]

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-transparent text-white">
      {/* Logo & Navigation */}
      <div className="flex items-center gap-12">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
            <Layers size={20} className="text-white" />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path)
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`relative py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400 font-medium">
          <MapPin size={16} />
          <span>London, UK</span>
        </div>
        
        <div className="w-px h-6 bg-gray-800 mx-2 hidden lg:block" />
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
            <Settings size={18} />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors relative"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <Bell size={18} />
            {alerts.length > 0 && alerts[0].id !== 'no-alerts' && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]" />
            )}
          </button>
          
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-semibold hidden md:block">{brand?.brandName || 'Brand'}</span>
            <img src={`https://ui-avatars.com/api/?name=${brand?.brandName || 'B'}&background=random`} alt="Profile" className="w-10 h-10 rounded-full border border-gray-800" />
          </div>
        </div>

        {/* Notifications Drawer */}
        {showDrawer && (
          <div className="absolute top-20 right-8 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 text-gray-900">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-sm">Smart Alerts</span>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">
                {alerts[0].id === 'no-alerts' ? 0 : alerts.length}
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {alerts.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
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

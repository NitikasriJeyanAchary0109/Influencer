import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Outlet, useLocation } from 'react-router-dom'

const titles: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of your campaign performance' },
  '/campaigns': { title: 'Campaigns', sub: 'Manage your influencer campaigns' },
  '/influencers': { title: 'Influencers', sub: 'Your influencer CRM' },
  '/posts': { title: 'Post Tracking', sub: 'Track influencer posts and content' },
  '/payments': { title: 'Payments', sub: 'Manage influencer payments' },
  '/analytics': { title: 'Analytics', sub: 'Performance reports and insights' },
  '/settings': { title: 'Settings', sub: 'Brand profile and preferences' },
}

const AppLayout: React.FC = () => {
  const location = useLocation()
  const path = Object.keys(titles).find(k => location.pathname.startsWith(k)) || '/dashboard'
  const { title, sub } = titles[path] || { title: 'InfluenceFlow AI', sub: '' }
  return (
    <div className="app-layout">
      <Sidebar/>
      <div className="main-content">
        <TopBar title={title} sub={sub}/>
        <main className="page">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default AppLayout

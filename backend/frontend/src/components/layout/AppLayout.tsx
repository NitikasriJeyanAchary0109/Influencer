import React from 'react'

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
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1a1a1a] rounded-b-[40px] z-0" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar title={title} sub={sub} />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 pt-12 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Target, Users, FileText, CreditCard, BarChart3, Settings, LogOut, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
  { to: '/campaigns', icon: <Target size={18}/>, label: 'Campaigns' },
  { to: '/influencers', icon: <Users size={18}/>, label: 'Influencers' },
  { to: '/posts', icon: <FileText size={18}/>, label: 'Posts' },
  { to: '/payments', icon: <CreditCard size={18}/>, label: 'Payments' },
  { to: '/analytics', icon: <BarChart3 size={18}/>, label: 'Analytics' },
  { to: '/settings', icon: <Settings size={18}/>, label: 'Settings' },
]

const Sidebar: React.FC = () => {
  const { brand, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><TrendingUp size={18}/></div>
        <div>
          <div className="sidebar-logo-text">InfluenceFlow AI</div>
          <div className="sidebar-logo-sub">{brand?.brandName || 'Campaign Tracker'}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleSignOut} style={{ width: '100%', color: 'var(--danger)' }}>
          <LogOut size={18}/>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

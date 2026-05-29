import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import AppLayout from './components/layout/AppLayout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'
import Influencers from './pages/Influencers'
import Posts from './pages/Posts'
import Payments from './pages/Payments'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"/></div>
  if (!user) return <Navigate to="/login" replace/>
  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"/></div>
  if (user) return <Navigate to="/dashboard" replace/>
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>

            {/* Protected Core App Dashboard */}
            <Route path="/" element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="campaigns" element={<Campaigns/>}/>
              <Route path="campaigns/:id" element={<CampaignDetail/>}/>
              <Route path="influencers" element={<Influencers/>}/>
              <Route path="posts" element={<Posts/>}/>
              <Route path="payments" element={<Payments/>}/>
              <Route path="analytics" element={<Analytics/>}/>
              <Route path="settings" element={<Settings/>}/>
            </Route>

            {/* Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { Key, Mail, Building, Plus } from 'lucide-react'

const Register: React.FC = () => {
  const { signUp } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim()) return showToast('error', 'Brand name is required')
    setLoading(true)
    const { error } = await signUp(email, password, brandName, industry)
    if (error) {
      showToast('error', error)
    } else {
      showToast('success', 'Brand registered successfully!')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: 440, border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, margin: '0 auto 12px', fontSize: 20 }}>I</div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Register Brand</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Get unified control of your influencer partnerships</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Brand Name *</label>
            <div style={{ position: 'relative' }}>
              <Building size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}/>
              <input type="text" className="form-input" style={{ paddingLeft: 38 }} placeholder="e.g. Acme Cosmetics" value={brandName} onChange={e => setBrandName(e.target.value)} required/>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Industry Sector</label>
            <input type="text" className="form-input" placeholder="e.g. Beauty & Wellness" value={industry} onChange={e => setIndustry(e.target.value)}/>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Corporate Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}/>
              <input type="email" className="form-input" style={{ paddingLeft: 38 }} placeholder="partners@brand.com" value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}/>
              <input type="password" className="form-input" style={{ paddingLeft: 38 }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 11 }} disabled={loading}>
            {loading ? 'Registering...' : 'Register Brand'} <Plus size={16}/>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register

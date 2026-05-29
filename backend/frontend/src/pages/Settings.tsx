import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../lib/api'
import { Settings as SettingsIcon, Save } from 'lucide-react'

const Settings: React.FC = () => {
  const { brand, refreshBrand } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState(brand?.brandName || '')
  const [industry, setIndustry] = useState(brand?.industry || '')
  const [email, setEmail] = useState(brand?.contactEmail || '')
  const [phone, setPhone] = useState(brand?.contactPhone || '')
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brand) return
    setUpdating(true)
    
    try {
      await api.put(`/brands/${brand.id}`, {
        brandName: name,
        industry,
        contactEmail: email,
        contactPhone: phone
      })
      showToast('success', 'Profile settings updated successfully!')
      await refreshBrand()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to update settings')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <form className="card" onSubmit={handleUpdate}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <SettingsIcon size={20} style={{ color: 'var(--primary)' }}/>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Brand Profile Settings</h2>
        </div>

        <div className="form-group">
          <label className="form-label">Brand Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} required/>
        </div>

        <div className="form-group">
          <label className="form-label">Industry</label>
          <input className="form-input" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. D2C Fashion"/>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 99999 88888"/>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} disabled={updating}>
          <Save size={16}/> {updating ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings

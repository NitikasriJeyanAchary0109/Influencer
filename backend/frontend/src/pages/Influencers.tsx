import React, { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, Trophy, Instagram, Download, BadgeCheck } from 'lucide-react'
import { formatNumber, formatPercent } from '../lib/utils'
import { fetchInstagramProfile } from '../lib/instagram'
import AIRecommendation from '../components/AIRecommendation'

interface Influencer { id: string; name: string; platformHandle: string; email: string; niche: string; followers: number; engagementRate: number; platform?: string; isVerified?: boolean }

const niches = ['Fashion', 'Beauty', 'Tech', 'Food', 'Travel', 'Fitness', 'Lifestyle', 'Gaming', 'Education', 'Finance', 'Other']
const empty = { name: '', platformHandle: '', email: '', niche: '', followers: '', engagementRate: '' }

const Influencers: React.FC = () => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Influencer | null>(null)
  const [form, setForm] = useState(empty)
  const [search, setSearch] = useState('')
  const [nicheFilter, setNicheFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'list' | 'ai'>('list')
  const [searchParams, setSearchParams] = useSearchParams()
  const [igImportHandle, setIgImportHandle] = useState('')
  const [importingIg, setImportingIg] = useState(false)

  const load = useCallback(async () => {
    if (!brand) return
    try {
      const { data } = await api.get(`/influencers/brand/${brand.id}`)
      setInfluencers(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [brand])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const addIg = searchParams.get('add_ig')
    if (addIg) {
      setEditing(null)
      setForm({
        ...empty,
        name: searchParams.get('name') || addIg,
        platformHandle: addIg,
        followers: searchParams.get('followers') || '',
        engagementRate: searchParams.get('engagement') || ''
      })
      setModalOpen(true)
      // Clear the params so a refresh doesn't trigger it again
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const openCreate = () => { setEditing(null); setForm(empty); setIgImportHandle(''); setModalOpen(true) }
  const openEdit = (inf: Influencer) => {
    setEditing(inf)
    setForm({ name: inf.name, platformHandle: inf.platformHandle || '', email: inf.email || '', niche: inf.niche || '', followers: String(inf.followers), engagementRate: String(inf.engagementRate) })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!brand || !form.name.trim()) return showToast('error', 'Name is required')
    const payload = { ...form, followers: Number(form.followers), engagementRate: Number(form.engagementRate), brand: { id: brand.id }, platform: 'Instagram' }
    try {
      if (editing) {
        await api.put(`/influencers/${editing.id}`, payload)
        showToast('success', 'Influencer updated!')
      } else {
        await api.post('/influencers', payload)
        showToast('success', 'Influencer added!')
      }
      setModalOpen(false)
      load()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to save influencer')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this influencer?')) return
    try {
      await api.delete(`/influencers/${id}`)
      showToast('success', 'Influencer deleted')
      load()
    } catch (e) {
      showToast('error', 'Failed to delete')
    }
  }

  const handleIgImport = async () => {
    if (!igImportHandle) return
    setImportingIg(true)
    try {
      const data = await fetchInstagramProfile(igImportHandle)
      setForm(f => ({
        ...f,
        name: data.fullName,
        platformHandle: data.username,
        followers: String(data.followers),
        engagementRate: String(data.engagementRate)
      }))
      showToast('success', 'Instagram profile data fetched!')
    } catch (err: any) {
      showToast('error', err.message || 'Failed to fetch Instagram data')
    } finally {
      setImportingIg(false)
    }
  }

  const filtered = influencers.filter(inf => {
    const s = search.toLowerCase()
    const matchSearch = inf.name.toLowerCase().includes(s) || (inf.platformHandle || '').toLowerCase().includes(s) || (inf.niche || '').toLowerCase().includes(s)
    const matchNiche = nicheFilter === 'All' || inf.niche === nicheFilter
    return matchSearch && matchNiche
  })

  const topPerformer = influencers.reduce((best, inf) => (!best || (inf.engagementRate > best.engagementRate) ? inf : best), null as Influencer | null)

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Influencers</div>
          <div className="page-sub">{influencers.length} total creators in your CRM network</div>
        </div>
        <button className="btn btn-primary glow-btn" onClick={openCreate}><Plus size={16}/> Add Influencer</button>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          CRM Network
        </button>
        <button className={`tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
          AI Recommendations Engine
        </button>
      </div>

      {activeTab === 'ai' ? (
        <AIRecommendation onInfluencerRecruited={load} />
      ) : (
        <>
          <div className="filters">
            <div className="search-box">
              <Search size={16} className="search-icon"/>
              <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search by name, handle, niche…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="filter-select" value={nicheFilter} onChange={e => setNicheFilter(e.target.value)}>
              <option value="All">All Niches</option>
              {niches.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>

          {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div> :
            filtered.length === 0 ? (
              <div className="empty-state card glass-panel">
                <div className="empty-icon">👥</div>
                <div className="empty-title">No influencers found</div>
                <div className="empty-sub">Add influencers manually or recruit highly rated influencers from the AI Recommendation Engine</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add Influencer</button>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('ai')}>Browse AI Recommendations</button>
                </div>
              </div>
            ) : (
              <div className="influencer-grid">
                {filtered.map(inf => (
                  <div key={inf.id} className="influencer-card glass-panel" style={{ border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="influencer-avatar">{initials(inf.name)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {inf.name}
                            {inf.isVerified !== false && <BadgeCheck size={16} className="text-blue-500" />}
                            {topPerformer?.id === inf.id && <span className="top-badge"><Trophy size={10}/> Top</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{inf.platformHandle || '—'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon animate-hover" onClick={() => openEdit(inf)}><Edit2 size={13}/></button>
                        <button className="btn-icon animate-hover" onClick={() => handleDelete(inf.id)} style={{ color: 'var(--danger)' }}><Trash2 size={13}/></button>
                      </div>
                    </div>
                    {inf.niche && <span className="badge badge-draft" style={{ marginBottom: 12 }}>{inf.niche}</span>}
                    <div className="influencer-stats">
                      <div className="inf-stat"><div className="inf-stat-val">{formatNumber(inf.followers)}</div><div className="inf-stat-label">Followers</div></div>
                      <div className="inf-stat"><div className="inf-stat-val" style={{ color: 'var(--primary)' }}>{formatPercent(inf.engagementRate)}</div><div className="inf-stat-label">Eng. Rate</div></div>
                    </div>
                    {inf.email && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>✉ {inf.email}</div>}
                  </div>
                ))}
              </div>
            )
          }
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Influencer' : 'Add Influencer'} size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
        
        {!editing && (
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(225, 48, 108, 0.05)', border: '1px solid rgba(225, 48, 108, 0.2)', borderRadius: 'var(--radius-sm)' }}>
            <label className="form-label" style={{ color: '#e1306c', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Instagram size={14}/> Import from Instagram
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>@</span>
                <input 
                  className="form-input" 
                  style={{ paddingLeft: 28 }} 
                  placeholder="username" 
                  value={igImportHandle} 
                  onChange={e => setIgImportHandle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleIgImport()}
                />
              </div>
              <button 
                className="btn btn-primary glow-btn" 
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none' }}
                onClick={handleIgImport}
                disabled={importingIg || !igImportHandle}
              >
                {importingIg ? <div className="spinner" style={{ width: 14, height: 14 }}/> : <Download size={14}/>} 
                Fetch Data
              </button>
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Instagram Handle</label><input className="form-input" placeholder="priya_eats" value={form.platformHandle} onChange={e => setForm(f => ({ ...f, platformHandle: e.target.value }))}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="priya@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Niche</label><select className="form-select" value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}><option value="">Select niche</option>{niches.map(n => <option key={n}>{n}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Followers</label><input type="number" className="form-input" placeholder="50000" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))}/></div>
        </div>
        <div className="form-group"><label className="form-label">Engagement Rate (%)</label><input type="number" step="0.01" className="form-input" placeholder="3.5" value={form.engagementRate} onChange={e => setForm(f => ({ ...f, engagementRate: e.target.value }))}/></div>
      </Modal>
    </>
  )
}

export default Influencers

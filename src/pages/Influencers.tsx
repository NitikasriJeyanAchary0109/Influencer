import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, Edit2, Trash2, Search, Trophy } from 'lucide-react'
import { formatNumber, formatPercent } from '../lib/utils'
import AIRecommendation from '../components/AIRecommendation'

interface Influencer { influencer_id: string; name: string; instagram_handle: string; email: string; phone: string; niche: string; followers: number; engagement_rate: number }

const niches = ['Fashion', 'Beauty', 'Tech', 'Food', 'Travel', 'Fitness', 'Lifestyle', 'Gaming', 'Education', 'Finance', 'Other']
const empty = { name: '', instagram_handle: '', email: '', phone: '', niche: '', followers: '', engagement_rate: '' }

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

  const load = useCallback(async () => {
    if (!brand) return
    const { data } = await supabase.from('influencers').select('*').eq('brand_id', brand.brand_id).order('created_at', { ascending: false })
    setInfluencers(data || [])
    setLoading(false)
  }, [brand])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true) }
  const openEdit = (inf: Influencer) => {
    setEditing(inf)
    setForm({ name: inf.name, instagram_handle: inf.instagram_handle || '', email: inf.email || '', phone: inf.phone || '', niche: inf.niche || '', followers: String(inf.followers), engagement_rate: String(inf.engagement_rate) })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!brand || !form.name.trim()) return showToast('error', 'Name is required')
    const payload = { ...form, followers: Number(form.followers), engagement_rate: Number(form.engagement_rate), brand_id: brand.brand_id }
    if (editing) {
      const { error } = await supabase.from('influencers').update(payload).eq('influencer_id', editing.influencer_id)
      if (error) return showToast('error', error.message)
      showToast('success', 'Influencer updated!')
    } else {
      const { error } = await supabase.from('influencers').insert(payload)
      if (error) return showToast('error', error.message)
      showToast('success', 'Influencer added!')
    }
    setModalOpen(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this influencer?')) return
    await supabase.from('influencers').delete().eq('influencer_id', id)
    showToast('success', 'Influencer deleted'); load()
  }

  const filtered = influencers.filter(inf => {
    const s = search.toLowerCase()
    const matchSearch = inf.name.toLowerCase().includes(s) || (inf.instagram_handle || '').toLowerCase().includes(s) || (inf.niche || '').toLowerCase().includes(s)
    const matchNiche = nicheFilter === 'All' || inf.niche === nicheFilter
    return matchSearch && matchNiche
  })

  const topPerformer = influencers.reduce((best, inf) => (!best || (inf.engagement_rate > best.engagement_rate) ? inf : best), null as Influencer | null)

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
                  <div key={inf.influencer_id} className="influencer-card glass-panel" style={{ border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="influencer-avatar">{initials(inf.name)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {inf.name}
                            {topPerformer?.influencer_id === inf.influencer_id && <span className="top-badge"><Trophy size={10}/> Top</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{inf.instagram_handle || '—'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon animate-hover" onClick={() => openEdit(inf)}><Edit2 size={13}/></button>
                        <button className="btn-icon animate-hover" onClick={() => handleDelete(inf.influencer_id)} style={{ color: 'var(--danger)' }}><Trash2 size={13}/></button>
                      </div>
                    </div>
                    {inf.niche && <span className="badge badge-draft" style={{ marginBottom: 12 }}>{inf.niche}</span>}
                    <div className="influencer-stats">
                      <div className="inf-stat"><div className="inf-stat-val">{formatNumber(inf.followers)}</div><div className="inf-stat-label">Followers</div></div>
                      <div className="inf-stat"><div className="inf-stat-val" style={{ color: 'var(--primary)' }}>{formatPercent(inf.engagement_rate)}</div><div className="inf-stat-label">Eng. Rate</div></div>
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
        <div className="form-row">
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Instagram Handle</label><input className="form-input" placeholder="priya_eats" value={form.instagram_handle} onChange={e => setForm(f => ({ ...f, instagram_handle: e.target.value }))}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="priya@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Niche</label><select className="form-select" value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}><option value="">Select niche</option>{niches.map(n => <option key={n}>{n}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Followers</label><input type="number" className="form-input" placeholder="50000" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))}/></div>
        </div>
        <div className="form-group"><label className="form-label">Engagement Rate (%)</label><input type="number" step="0.01" className="form-input" placeholder="3.5" value={form.engagement_rate} onChange={e => setForm(f => ({ ...f, engagement_rate: e.target.value }))}/></div>
      </Modal>
    </>
  )
}

export default Influencers

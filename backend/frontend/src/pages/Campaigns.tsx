import React, { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, Edit2, Trash2, Users, Search } from 'lucide-react'
import { formatDate, formatCurrency } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

interface Campaign { id: string; title: string; description: string; budget: number; startDate: string; endDate: string; status: string; influencer_count?: number }
interface Influencer { id: string; name: string }

const statusColors: Record<string,string> = { Draft: 'badge-draft', Active: 'badge-active', Completed: 'badge-completed' }
const empty = { title: '', description: '', budget: '', startDate: '', endDate: '', status: 'Draft' }

const Campaigns: React.FC = () => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [allInfluencers, setAllInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState(empty)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const load = useCallback(async () => {
    if (!brand) return
    try {
      const { data: cams } = await api.get(`/campaigns/brand/${brand.id}`)
      
      // Assume influencer_count can be attached from backend or we just show 0 for now until CampaignInfluencers endpoint is robust
      setCampaigns((cams || []).map((c: any) => ({ ...c, influencer_count: 0 })))
      
      const { data: infs } = await api.get(`/influencers/brand/${brand.id}`)
      setAllInfluencers(infs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [brand])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true) }
  const openEdit = (c: Campaign) => { setEditing(c); setForm({ title: c.title, description: c.description || '', budget: String(c.budget), startDate: c.startDate || '', endDate: c.endDate || '', status: c.status || 'Draft' }); setModalOpen(true) }

  const handleSave = async () => {
    if (!brand || !form.title.trim()) return showToast('error', 'Campaign name is required')
    try {
      if (editing) {
        await api.put(`/campaigns/${editing.id}`, { ...form, budget: Number(form.budget) })
        showToast('success', 'Campaign updated!')
      } else {
        await api.post('/campaigns', { ...form, budget: Number(form.budget), brand: { id: brand.id } })
        showToast('success', 'Campaign created!')
      }
      setModalOpen(false)
      load()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to save')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this campaign? This will remove all associated posts and payments.')) return
    try {
      await api.delete(`/campaigns/${id}`)
      showToast('success', 'Campaign deleted')
      load()
    } catch (e) {
      showToast('error', 'Failed to delete')
    }
  }

  const filtered = campaigns.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Campaigns</div>
          <div className="page-sub">{campaigns.length} total campaigns</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> New Campaign</button>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={16} className="search-icon"/>
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        {['All','Draft','Active','Completed'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div> :
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <div className="empty-title">No campaigns yet</div>
            <div className="empty-sub">Create your first influencer campaign to get started</div>
            <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Create Campaign</button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr>
                <th>Campaign</th><th>Status</th><th>Budget</th><th>Influencers</th><th>Start</th><th>End</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate(`/campaigns/${c.id}`)}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.description?.slice(0, 50)}</div>
                    </td>
                    <td><span className={`badge ${statusColors[c.status || 'Draft']}`}>{c.status || 'Draft'}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.budget)}</td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14}/>{c.influencer_count || 0}</span></td>
                    <td>{formatDate(c.startDate)}</td>
                    <td>{formatDate(c.endDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-icon" onClick={() => openEdit(c)}><Edit2 size={14}/></button>
                        <button className="btn-icon" onClick={() => handleDelete(c.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Campaign' : 'New Campaign'} size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save Campaign</button></>}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Campaign Name *</label>
            <input className="form-input" placeholder="e.g. Summer Launch 2024" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['Draft','Active','Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Campaign goals and description…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Budget (₹)</label>
            <input type="number" className="form-input" placeholder="50000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-input" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input type="date" className="form-input" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}/>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Campaigns

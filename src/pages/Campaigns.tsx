import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, Edit2, Trash2, Users, Search } from 'lucide-react'
import { formatDate, formatCurrency } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

interface Campaign { campaign_id: string; campaign_name: string; description: string; budget: number; start_date: string; end_date: string; status: string; influencer_count?: number }
interface Influencer { influencer_id: string; name: string }

const statusColors: Record<string,string> = { Draft: 'badge-draft', Active: 'badge-active', Completed: 'badge-completed' }
const empty = { campaign_name: '', description: '', budget: '', start_date: '', end_date: '', status: 'Draft' }

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
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const load = useCallback(async () => {
    if (!brand) return
    const { data: cams } = await supabase.from('campaigns').select('*').eq('brand_id', brand.brand_id).order('created_at', { ascending: false })
    const { data: ci } = await supabase.from('campaign_influencers').select('campaign_id, influencer_id')
    const countMap: Record<string, number> = {}
    ;(ci || []).forEach((r: any) => { countMap[r.campaign_id] = (countMap[r.campaign_id] || 0) + 1 })
    setCampaigns((cams || []).map((c: any) => ({ ...c, influencer_count: countMap[c.campaign_id] || 0 })))
    const { data: infs } = await supabase.from('influencers').select('influencer_id, name').eq('brand_id', brand.brand_id)
    setAllInfluencers(infs || [])
    setLoading(false)
  }, [brand])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(empty); setSelectedInfluencers([]); setModalOpen(true) }
  const openEdit = (c: Campaign) => { setEditing(c); setForm({ campaign_name: c.campaign_name, description: c.description || '', budget: String(c.budget), start_date: c.start_date || '', end_date: c.end_date || '', status: c.status }); setModalOpen(true) }

  const handleSave = async () => {
    if (!brand || !form.campaign_name.trim()) return showToast('error', 'Campaign name is required')
    if (editing) {
      const { error } = await supabase.from('campaigns').update({ ...form, budget: Number(form.budget) }).eq('campaign_id', editing.campaign_id)
      if (error) return showToast('error', error.message)
      showToast('success', 'Campaign updated!')
    } else {
      const { data, error } = await supabase.from('campaigns').insert({ ...form, budget: Number(form.budget), brand_id: brand.brand_id }).select().single()
      if (error) return showToast('error', error.message)
      if (selectedInfluencers.length > 0) {
        await supabase.from('campaign_influencers').insert(selectedInfluencers.map(id => ({ campaign_id: data.campaign_id, influencer_id: id })))
      }
      showToast('success', 'Campaign created!')
    }
    setModalOpen(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign? This will remove all associated posts and payments.')) return
    await supabase.from('campaigns').delete().eq('campaign_id', id)
    showToast('success', 'Campaign deleted'); load()
  }

  const filtered = campaigns.filter(c => {
    const matchSearch = c.campaign_name.toLowerCase().includes(search.toLowerCase())
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
                  <tr key={c.campaign_id}>
                    <td>
                      <div style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate(`/campaigns/${c.campaign_id}`)}>{c.campaign_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.description?.slice(0, 50)}</div>
                    </td>
                    <td><span className={`badge ${statusColors[c.status]}`}>{c.status}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.budget)}</td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14}/>{c.influencer_count}</span></td>
                    <td>{formatDate(c.start_date)}</td>
                    <td>{formatDate(c.end_date)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-icon" onClick={() => openEdit(c)}><Edit2 size={14}/></button>
                        <button className="btn-icon" onClick={() => handleDelete(c.campaign_id)} style={{ color: 'var(--danger)' }}><Trash2 size={14}/></button>
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
            <input className="form-input" placeholder="e.g. Summer Launch 2024" value={form.campaign_name} onChange={e => setForm(f => ({ ...f, campaign_name: e.target.value }))}/>
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
            <input type="date" className="form-input" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input type="date" className="form-input" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}/>
          </div>
        </div>
        {!editing && allInfluencers.length > 0 && (
          <div className="form-group">
            <label className="form-label">Assign Influencers</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allInfluencers.map(inf => (
                <label key={inf.influencer_id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${selectedInfluencers.includes(inf.influencer_id) ? 'var(--primary)' : 'var(--border)'}`, background: selectedInfluencers.includes(inf.influencer_id) ? 'rgba(99,102,241,.08)' : 'var(--surface)', fontSize: 13 }}>
                  <input type="checkbox" checked={selectedInfluencers.includes(inf.influencer_id)} onChange={e => setSelectedInfluencers(prev => e.target.checked ? [...prev, inf.influencer_id] : prev.filter(id => id !== inf.influencer_id))} style={{ display: 'none' }}/>
                  {inf.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default Campaigns

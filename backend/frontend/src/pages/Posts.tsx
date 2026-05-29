import React, { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, ExternalLink, Trash2 } from 'lucide-react'
import { formatDate } from '../lib/utils'

interface Post { id: string; campaign: any; influencer: any; platform: string; postUrl: string; postDate: string; campaign_name?: string; influencer_name?: string }
interface Campaign { id: string; title: string }
interface Influencer { id: string; name: string; followers: number }

const platforms = ['Instagram','YouTube','Facebook','X','LinkedIn']
const platformColors: Record<string,string> = { Instagram: 'badge-instagram', YouTube: 'badge-youtube', Facebook: 'badge-facebook', X: 'badge-x', LinkedIn: 'badge-linkedin' }
const empty = { campaign_id: '', influencer_id: '', platform: 'Instagram', postUrl: '', postDate: '' }

const Posts: React.FC = () => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)

  const load = useCallback(async () => {
    if (!brand) return
    try {
      const [{ data: cams }, { data: infs }] = await Promise.all([
        api.get(`/campaigns/brand/${brand.id}`),
        api.get(`/influencers/brand/${brand.id}`)
      ])
      
      setCampaigns(cams || [])
      setInfluencers(infs || [])
      
      if (cams && cams.length > 0) {
        const postRes = await Promise.all(cams.map((c: any) => api.get(`/posts/campaign/${c.id}`)))
        const postsData = postRes.flatMap(r => r.data || [])
        
        const camMap = Object.fromEntries((cams || []).map((c: any) => [c.id, c.title]))
        const infMap = Object.fromEntries((infs || []).map((i: any) => [i.id, i.name]))
        
        setPosts((postsData || []).map((p: any) => ({ 
          ...p, 
          campaign_name: p.campaign ? p.campaign.title : camMap[p.campaign?.id], 
          influencer_name: p.influencer ? p.influencer.name : infMap[p.influencer?.id] 
        })))
      } else { 
        setPosts([]) 
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [brand])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.campaign_id || !form.influencer_id) return showToast('error', 'Select campaign and influencer')
    try {
      await api.post('/posts', { 
        campaign: { id: form.campaign_id },
        influencer: { id: form.influencer_id },
        platform: form.platform,
        postUrl: form.postUrl,
        postDate: form.postDate
      })
      // Auto-generated metrics will be handled by backend eventually
      showToast('success', 'Post added!')
      setModalOpen(false)
      load()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to save')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${id}`)
      showToast('success', 'Post deleted')
      load()
    } catch (e) {
      showToast('error', 'Failed to delete')
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Post Tracking</div>
          <div className="page-sub">{posts.length} posts tracked</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setModalOpen(true) }}><Plus size={16}/> Add Post</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div> :
        posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">No posts tracked</div>
            <div className="empty-sub">Start tracking influencer posts to see metrics</div>
            <button className="btn btn-primary" onClick={() => { setForm(empty); setModalOpen(true) }}><Plus size={16}/> Add Post</button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Influencer</th><th>Campaign</th><th>Platform</th><th>Post Date</th><th>URL</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.influencer_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.campaign_name}</td>
                    <td><span className={`badge ${platformColors[p.platform] || 'badge-draft'}`}>{p.platform}</span></td>
                    <td>{formatDate(p.postDate)}</td>
                    <td>{p.postUrl ? <a href={p.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}><ExternalLink size={14}/> View</a> : '—'}</td>
                    <td><button className="btn-icon" onClick={() => handleDelete(p.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Post"
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Add Post</button></>}>
        <div className="form-group"><label className="form-label">Campaign *</label>
          <select className="form-select" value={form.campaign_id} onChange={e => setForm(f => ({ ...f, campaign_id: e.target.value }))}>
            <option value="">Select campaign</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Influencer *</label>
          <select className="form-select" value={form.influencer_id} onChange={e => setForm(f => ({ ...f, influencer_id: e.target.value }))}>
            <option value="">Select influencer</option>{influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Platform</label>
            <select className="form-select" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
              {platforms.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Post Date</label><input type="date" className="form-input" value={form.postDate} onChange={e => setForm(f => ({ ...f, postDate: e.target.value }))}/></div>
        </div>
        <div className="form-group"><label className="form-label">Post URL</label><input type="url" className="form-input" placeholder="https://instagram.com/p/..." value={form.postUrl} onChange={e => setForm(f => ({ ...f, postUrl: e.target.value }))}/></div>
        <div style={{ background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--primary)' }}>
          ✨ Metrics will be auto-generated using simulated data based on the influencer's follower count by the backend.
        </div>
      </Modal>
    </>
  )
}

export default Posts

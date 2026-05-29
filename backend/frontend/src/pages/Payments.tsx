import React, { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, Check, Clock } from 'lucide-react'
import { formatDate, formatCurrency, isOverdue } from '../lib/utils'

interface Payment {
  id: string
  campaign: any
  influencer: any
  amount: number
  paymentType: string
  dueDate: string
  paidDate: string | null
  status: string
  campaign_name?: string
  influencer_name?: string
}
interface Campaign { id: string; title: string }
interface Influencer { id: string; name: string }

const statusColors: Record<string, string> = {
  PAID: 'badge-paid',
  PENDING: 'badge-pending',
  OVERDUE: 'badge-overdue'
}

const empty = { campaign_id: '', influencer_id: '', amount: '', paymentType: 'Cash', dueDate: '', status: 'PENDING' }

const Payments: React.FC = () => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [activeTab, setActiveTab] = useState<'All' | 'PENDING' | 'PAID' | 'OVERDUE'>('All')

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
        const payRes = await Promise.all(cams.map((c: any) => api.get(`/payments/campaign/${c.id}`)))
        const payData = payRes.flatMap(r => r.data || [])
        
        const camMap = Object.fromEntries((cams || []).map((c: any) => [c.id, c.title]))
        const infMap = Object.fromEntries((infs || []).map((i: any) => [i.id, i.name]))

        // Process overdue auto-updates dynamically
        const processed: Payment[] = (payData || []).map((p: any) => {
          let status = p.status
          if (status !== 'PAID' && isOverdue(p.dueDate, status)) {
            status = 'OVERDUE'
          }
          return {
            ...p,
            status,
            campaign_name: p.campaign ? p.campaign.title : camMap[p.campaign?.id],
            influencer_name: p.influencer ? p.influencer.name : infMap[p.influencer?.id]
          }
        })
        setPayments(processed)
      } else {
        setPayments([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [brand])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.campaign_id || !form.influencer_id || !form.amount) {
      return showToast('error', 'Please fill all required fields')
    }
    
    try {
      await api.post('/payments', {
        ...form,
        amount: Number(form.amount),
        campaign: { id: form.campaign_id },
        influencer: { id: form.influencer_id }
      })
      showToast('success', 'Payment schedule created!')
      setModalOpen(false)
      load()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to save')
    }
  }

  const markAsPaid = async (p: Payment) => {
    const today = new Date().toISOString().split('T')[0]
    try {
      await api.put(`/payments/${p.id}`, { status: 'PAID', paidDate: today })
      showToast('success', 'Payment marked as Paid!')
      load()
    } catch (error: any) {
      showToast('error', error.message || 'Failed to mark as paid')
    }
  }

  const filtered = payments.filter(p => {
    if (activeTab === 'All') return true
    return p.status === activeTab
  })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Payments</div>
          <div className="page-sub">Track budgets, custom payouts, and schedules</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setModalOpen(true) }}><Plus size={16}/> Create Payment</button>
      </div>

      <div className="tabs">
        {(['All', 'PENDING', 'PAID', 'OVERDUE'] as const).map(t => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: 'auto' }}/></div> :
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <div className="empty-title">No payments found</div>
            <div className="empty-sub">No payment schedules match this tab filter</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Influencer</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.influencer_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.campaign_name}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(p.amount)}</td>
                    <td><span className="badge badge-draft">{p.paymentType}</span></td>
                    <td><span className={`badge ${statusColors[p.status] || 'badge-pending'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }}/>
                        {formatDate(p.dueDate)}
                      </div>
                    </td>
                    <td>{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                    <td>
                      {p.status !== 'PAID' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => markAsPaid(p)}>
                          <Check size={13}/> Mark Paid
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Payment Schedule"
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Create</button></>}>
        <div className="form-group"><label className="form-label">Campaign *</label>
          <select className="form-select" value={form.campaign_id} onChange={e => setForm(f => ({ ...f, campaign_id: e.target.value }))}>
            <option value="">Select campaign</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Influencer *</label>
          <select className="form-select" value={form.influencer_id} onChange={e => setForm(f => ({ ...f, influencer_id: e.target.value }))}>
            <option value="">Select influencer</option>
            {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Amount (₹) *</label><input type="number" className="form-input" placeholder="15000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Payment Type</label>
            <select className="form-select" value={form.paymentType} onChange={e => setForm(f => ({ ...f, paymentType: e.target.value }))}>
              {['Cash','Commission','Gift Product','Hybrid'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Due Date *</label><input type="date" className="form-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {['PENDING','PAID'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Payments

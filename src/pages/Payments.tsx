import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { Plus, Edit2, Check, AlertTriangle, Clock } from 'lucide-react'
import { formatDate, formatCurrency, isOverdue } from '../lib/utils'

interface Payment {
  payment_id: string
  campaign_id: string
  influencer_id: string
  amount: number
  payment_type: string
  due_date: string
  payment_date: string | null
  payment_status: string
  campaign_name?: string
  influencer_name?: string
}
interface Campaign { campaign_id: string; campaign_name: string }
interface Influencer { influencer_id: string; name: string }

const statusColors: Record<string, string> = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Overdue: 'badge-overdue'
}

const empty = { campaign_id: '', influencer_id: '', amount: '', payment_type: 'Cash', due_date: '', payment_status: 'Pending' }

const Payments: React.FC = () => {
  const { brand } = useAuth()
  const { showToast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Paid' | 'Overdue'>('All')

  const load = useCallback(async () => {
    if (!brand) return
    const { data: cams } = await supabase.from('campaigns').select('campaign_id, campaign_name').eq('brand_id', brand.brand_id)
    const { data: infs } = await supabase.from('influencers').select('influencer_id, name').eq('brand_id', brand.brand_id)
    setCampaigns(cams || [])
    setInfluencers(infs || [])

    if (cams && cams.length > 0) {
      const ids = cams.map((c: any) => c.campaign_id)
      const { data: payData } = await supabase.from('payments').select('*').in('campaign_id', ids).order('due_date', { ascending: true })
      
      const camMap = Object.fromEntries((cams || []).map((c: any) => [c.campaign_id, c.campaign_name]))
      const infMap = Object.fromEntries((infs || []).map((i: any) => [i.influencer_id, i.name]))

      // Process overdue auto-updates dynamically
      const processed: Payment[] = (payData || []).map((p: any) => {
        let status = p.payment_status
        if (status !== 'Paid' && isOverdue(p.due_date, status)) {
          status = 'Overdue'
        }
        return {
          ...p,
          payment_status: status,
          campaign_name: camMap[p.campaign_id],
          influencer_name: infMap[p.influencer_id]
        }
      })
      setPayments(processed)
    } else {
      setPayments([])
    }
    setLoading(false)
  }, [brand])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.campaign_id || !form.influencer_id || !form.amount) {
      return showToast('error', 'Please fill all required fields')
    }
    const payload = { ...form, amount: Number(form.amount) }
    const { error } = await supabase.from('payments').insert(payload)
    if (error) return showToast('error', error.message)
    showToast('success', 'Payment schedule created!')
    setModalOpen(false)
    load()
  }

  const markAsPaid = async (p: Payment) => {
    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase
      .from('payments')
      .update({ payment_status: 'Paid', payment_date: today })
      .eq('payment_id', p.payment_id)
    if (error) return showToast('error', error.message)
    showToast('success', 'Payment marked as Paid!')
    load()
  }

  const filtered = payments.filter(p => {
    if (activeTab === 'All') return true
    return p.payment_status === activeTab
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
        {(['All', 'Pending', 'Paid', 'Overdue'] as const).map(t => (
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
                  <tr key={p.payment_id}>
                    <td style={{ fontWeight: 600 }}>{p.influencer_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.campaign_name}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(p.amount)}</td>
                    <td><span className="badge badge-draft">{p.payment_type}</span></td>
                    <td><span className={`badge ${statusColors[p.payment_status]}`}>{p.payment_status}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }}/>
                        {formatDate(p.due_date)}
                      </div>
                    </td>
                    <td>{p.payment_date ? formatDate(p.payment_date) : '—'}</td>
                    <td>
                      {p.payment_status !== 'Paid' ? (
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
            {campaigns.map(c => <option key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Influencer *</label>
          <select className="form-select" value={form.influencer_id} onChange={e => setForm(f => ({ ...f, influencer_id: e.target.value }))}>
            <option value="">Select influencer</option>
            {influencers.map(i => <option key={i.influencer_id} value={i.influencer_id}>{i.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Amount (₹) *</label><input type="number" className="form-input" placeholder="15000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Payment Type</label>
            <select className="form-select" value={form.payment_type} onChange={e => setForm(f => ({ ...f, payment_type: e.target.value }))}>
              {['Cash','Commission','Gift Product','Hybrid'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Due Date *</label><input type="date" className="form-input" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}/></div>
          <div className="form-group"><label className="form-label">Status</label>
            <select className="form-select" value={form.payment_status} onChange={e => setForm(f => ({ ...f, payment_status: e.target.value }))}>
              {['Pending','Paid'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Payments

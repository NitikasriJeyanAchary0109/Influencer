import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ShieldCheck, ArrowRight, CreditCard, Lock } from 'lucide-react'
import { useToast } from '../components/ui/Toast'

const plans = {
  starter: { name: 'Starter', price: 0, interval: '', desc: 'Free trial to test the waters' },
  growth: { name: 'Growth', price: 2499, interval: '/month', desc: 'Perfect for scaling brands' },
  pro: { name: 'Pro', price: 6599, interval: '/month', desc: 'For enterprise scale' }
}

const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const planKey = (searchParams.get('plan') || 'growth').toLowerCase() as keyof typeof plans
  const plan = plans[planKey] || plans.growth
  
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  useEffect(() => {
    // If it's a free plan, redirect directly to register
    if (plan.price === 0) {
      navigate(`/register?plan=${planKey}`)
    }
  }, [plan, navigate, planKey])

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate payment processing delay
    setTimeout(() => {
      setLoading(false)
      showToast('success', "Payment successful! Let's set up your brand.")
      navigate(`/register?plan=${planKey}`)
    }, 1500)
  }

  // Format card number with spaces
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.substring(0, 16)
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val
    setCard(formatted)
  }

  // Format expiry with slash
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.substring(0, 4)
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2)
    setExpiry(val)
  }

  if (plan.price === 0) return null // Handled by useEffect redirect

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: 850, display: 'flex', overflow: 'hidden', padding: 0, border: '1px solid var(--border)' }}>
        
        {/* Left Side: Order Summary */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: 40, color: 'white' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, marginBottom: 16 }}>I</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Subscribe to {plan.name}</h2>
            <p style={{ opacity: 0.8 }}>{plan.desc}</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: 24, borderRadius: 12, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span>{plan.name} Plan</span>
              <span style={{ fontWeight: 700 }}>₹{plan.price.toLocaleString('en-IN')}{plan.interval}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
              <span>Total due today</span>
              <span>₹{plan.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.9 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Check size={16}/> Cancel anytime, no questions asked.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Check size={16}/> Secure 256-bit SSL encryption.</li>
          </ul>
        </div>
        
        {/* Right Side: Payment Form */}
        <div style={{ flex: 1, padding: 40, background: 'var(--surface)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            Payment Details <Lock size={16} style={{ color: 'var(--text-muted)' }}/>
          </h3>
          
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@company.com" required/>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Card Information</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: 40, fontFamily: 'monospace', fontSize: 16 }} 
                  placeholder="0000 0000 0000 0000" 
                  value={card} 
                  onChange={handleCardChange} 
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expiry Date</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="MM/YY" 
                  value={expiry} 
                  onChange={handleExpiryChange} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">CVC</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="123" 
                  maxLength={4} 
                  value={cvc} 
                  onChange={e => setCvc(e.target.value.replace(/\D/g, ''))} 
                  required
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Name on Card</label>
              <input type="text" className="form-input" placeholder="John Doe" required/>
            </div>
            
            <button type="submit" className="btn btn-primary glow-btn" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, marginTop: 8 }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderTopColor: 'white' }}/> : (
                <>Pay ₹{plan.price.toLocaleString('en-IN')} & Continue <ArrowRight size={18}/></>
              )}
            </button>
            
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <ShieldCheck size={14}/> Payments are securely processed by Stripe.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { Key, Mail, Building, Plus, Globe } from 'lucide-react'

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
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-6 font-sans selection:bg-[#D3F971] selection:text-black">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D3F971] rounded-full blur-2xl opacity-40 pointer-events-none" />

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 duration-200">
              <Globe size={20} className="text-[#D3F971] stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#1a1a1a]">InfluenceFlow</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">Register Brand</h2>
          <p className="text-sm font-semibold text-gray-400 mt-1">Get unified control of your influencer partnerships</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Name *</label>
            <div className="relative">
              <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                placeholder="e.g. Acme Cosmetics"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Industry Sector</label>
            <input
              type="text"
              className="w-full bg-[#f9fafb] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
              placeholder="e.g. Beauty & Wellness"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Corporate Email *</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                placeholder="partners@brand.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a1a1a] hover:bg-black text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 pt-3"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Brand'}
            <Plus size={16} className="transition-transform group-hover:scale-110 duration-200" />
          </button>
        </form>

        <div className="text-center mt-8 text-sm font-semibold text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1a1a1a] hover:underline font-extrabold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register


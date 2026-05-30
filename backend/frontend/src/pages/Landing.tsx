import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, ArrowRight, Instagram, Twitter, Sparkles, TrendingUp, Coins, Users, CheckCircle, ArrowRightLeft, ShieldCheck, BadgeCheck, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [emailInput, setEmailInput] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/checkout?plan=growth&email=${encodeURIComponent(emailInput)}`)
  }

  const features = [
    {
      icon: <Users size={24} className="text-[#1a1a1a]" />,
      title: "Creator CRM",
      desc: "Maintain profiles, social handles, niche details, follower counts, and contact info in one structured vault."
    },
    {
      icon: <TrendingUp size={24} className="text-[#1a1a1a]" />,
      title: "ROI Analytics Engine",
      desc: "Instantly compute CPE, CPR, and Revenue ROI. Compare influencer performance metrics automatically."
    },
    {
      icon: <Coins size={24} className="text-[#1a1a1a]" />,
      title: "Unified Payments",
      desc: "Keep track of upcoming dues, automate overdue alerts, and log payments (Cash, Gift, Commission)."
    },
    {
      icon: <Sparkles size={24} className="text-[#1a1a1a]" />,
      title: "Campaign Orchestrator",
      desc: "Assign multiple creators, set budgets, track milestones, and view overall campaign health scores."
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹0",
      period: "forever",
      desc: "Perfect for brands starting their influencer journey.",
      features: [
        "Up to 10 Influencers",
        "2 Active Campaigns",
        "Basic ROI calculations",
        "Manual payment logs"
      ],
      planKey: "starter",
      highlighted: false
    },
    {
      name: "Growth",
      price: "₹2,499",
      period: "month",
      desc: "For scaling brands seeking serious performance tracking.",
      features: [
        "Unlimited Influencers",
        "10 Active Campaigns",
        "Advanced ROI Analytics & Charts",
        "Automated Overdue Alerts",
        "Community forum access"
      ],
      planKey: "growth",
      highlighted: true
    },
    {
      name: "Pro",
      price: "₹6,599",
      period: "month",
      desc: "Complete command center for enterprise agencies.",
      features: [
        "Unlimited Influencers & Campaigns",
        "Priority AI Recommendations",
        "Custom API integrations",
        "Dedicated account manager",
        "Full financial exports"
      ],
      planKey: "pro",
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#1a1a1a] font-sans selection:bg-[#D3F971] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto bg-[#1a1a1a] rounded-3xl px-6 py-3.5 flex items-center justify-between shadow-xl border border-white/5">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-[#D3F971] rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-200">
                <Globe size={18} className="text-[#1a1a1a] stroke-[2.5]" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">InfluenceFlow</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">About</a>
            </div>
          </div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm font-semibold hidden md:inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  Logged in as <strong className="text-white">{user.brand?.brandName || user.email}</strong>
                  {user.brand?.isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-500" />}
                </span>
                <button 
                  onClick={async () => { await signOut(); navigate('/') }} 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold px-4 py-2"
                >
                  Sign Out
                </button>
                <Link to="/dashboard" className="bg-[#D3F971] text-[#1a1a1a] font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-[#c2e855] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold px-4 py-2">Login</Link>
                <Link to="/checkout?plan=growth" className="bg-[#D3F971] text-[#1a1a1a] font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-[#c2e855] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md">
                  Start Free Trial
                </Link>
              </div>
            )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-[#1a1a1a] text-white pt-36 pb-32 px-6 rounded-b-[48px] overflow-hidden shadow-2xl">
        {/* Subtle geometric background shapes */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#D3F971] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-[#D3F971]">
            <Sparkles size={14} /> Unified Campaign Management
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Influence with <span className="text-[#D3F971]">Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Stop juggling spreadsheets. Track influencers, measure real-time ROI, and scale your brand partnerships on a single, stunning dashboard.
          </p>

          {user ? (
            <div className="pt-4 space-y-4 max-w-xs mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#D3F971]/10 border border-[#D3F971]/20 px-4 py-2 rounded-2xl text-sm font-semibold text-[#D3F971]">
                <ShieldCheck size={16} /> Verified Session Active
              </div>
              <div>
                <Link
                  to="/dashboard"
                  className="bg-[#D3F971] text-[#1a1a1a] hover:bg-[#c2e855] transition-all font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] duration-200 w-full"
                >
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto pt-4">
              <form onSubmit={handleSignup} className="bg-white/5 backdrop-blur-md rounded-2xl p-2 flex flex-col sm:flex-row gap-2 border border-white/10 shadow-lg focus-within:border-[#D3F971]/50 transition-colors">
                <input
                  type="email"
                  placeholder="Enter corporate email"
                  className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-gray-500 px-4 py-3 text-sm focus:ring-0"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#D3F971] text-[#1a1a1a] hover:bg-[#c2e855] transition-all font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] duration-200"
                >
                  Get Started <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto -mt-16 px-6 relative z-20">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center">
          <div className="space-y-2 py-4 md:py-0">
            <div className="text-4xl font-extrabold tracking-tight text-[#1a1a1a]">500k+</div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Creators Cataloged</div>
          </div>
          <div className="space-y-2 py-4 md:py-0">
            <div className="text-4xl font-extrabold tracking-tight text-[#1a1a1a]">₹120M+</div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payments Streamlined</div>
          </div>
          <div className="space-y-2 py-4 md:py-0">
            <div className="text-4xl font-extrabold tracking-tight text-[#1a1a1a]">240%</div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Average Campaign ROI</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto py-24 px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Engineered for High-Growth Brands
          </h2>
          <p className="text-gray-500 font-medium text-base md:text-lg max-w-xl mx-auto">
            Everything you need to source creators, track content performance, and maximize marketing spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#D3F971] flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1a1a1a]">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#1a1a1a] text-white py-24 px-6 rounded-[48px] shadow-2xl">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 font-medium text-base md:text-lg max-w-xl mx-auto">
              Find a plan that fits your current operational needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-transform duration-300 hover:scale-[1.02] ${
                  plan.highlighted
                    ? 'bg-white text-[#1a1a1a] border-4 border-[#D3F971] shadow-2xl'
                    : 'bg-[#252525] text-white border border-white/5'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D3F971] text-[#1a1a1a] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
                    <p className={`text-xs mt-1 ${plan.highlighted ? 'text-gray-500' : 'text-gray-400'}`}>
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-xs font-semibold ${plan.highlighted ? 'text-gray-500' : 'text-gray-400'}`}>
                      /{plan.period}
                    </span>
                  </div>

                  <div className={`h-px ${plan.highlighted ? 'bg-gray-100' : 'bg-white/10'}`} />

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle size={16} className={plan.highlighted ? 'text-emerald-500' : 'text-[#D3F971]'} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => user ? navigate('/dashboard') : navigate(`/checkout?plan=${plan.planKey}`)}
                    className={`w-full font-bold py-3.5 px-6 rounded-2xl transition-colors ${
                      plan.highlighted
                        ? 'bg-[#1a1a1a] text-white hover:bg-black'
                        : 'bg-[#333333] text-white hover:bg-[#444444] border border-white/10'
                    }`}
                  >
                    {user ? 'Go to Dashboard' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Ready to scale your influencer revenue?
        </h2>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
          Join high-performance marketing teams who manage, track, and pay their influencers on InfluenceFlow.
        </p>
        <div className="pt-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-[#1a1a1a] hover:bg-black text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          ) : (
            <Link
              to="/checkout?plan=growth"
              className="bg-[#1a1a1a] hover:bg-black text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 group"
            >
              Create Brand Profile
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          )}
        </div>
      </section>

      {/* About & Trust System Section */}
      <section id="about" className="bg-white py-24 px-6 rounded-[48px] shadow-sm max-w-6xl mx-auto mb-16 border border-gray-100">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="stroke-[2.5]" /> Trust & Verification Framework
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Zero-Scam Marketing Ecosystem
            </h2>
            <p className="text-gray-500 font-medium text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              InfluenceFlow protects your ad-spend with double-sided verification layers, preventing influencer spoofing and brand payment default scams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="bg-[#f9fafb] p-8 rounded-3xl border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Official Brand Verification</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Brands undergo business registry audit checks (GSTIN/Tax ID registry, business address, and corporate email domain checks) to verify their authenticity. This prevents bad actors from creating dummy brands and scamming creators.
              </p>
            </div>

            <div className="bg-[#f9fafb] p-8 rounded-3xl border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-[#D3F971]/20 rounded-2xl flex items-center justify-center text-[#1a1a1a]">
                <BadgeCheck size={24} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Influencer Audits & CRM Badges</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Influencers imported from Instagram are verified against their real-time profile API data to prevent spoof accounts. Brand managers can run manual audits to flag, approve, and display Trust checkmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <Globe size={16} className="text-[#D3F971]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#1a1a1a]">InfluenceFlow</span>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors">
              <Twitter size={18} />
            </a>
          </div>

          <div className="text-xs font-semibold text-gray-400">
            &copy; {new Date().getFullYear()} InfluenceFlow Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing


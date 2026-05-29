import React, { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, ArrowRight, Instagram, Twitter } from 'lucide-react'

const Landing: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [opacity, setOpacity] = useState(0)
  const fadingOutRef = useRef(false)
  const animFrameRef = useRef<number>()
  const navigate = useNavigate()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const fadeDuration = 500
    let lastTime: number | null = null

    const animateFade = (targetOpacity: number, timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const delta = timestamp - lastTime
      
      setOpacity((prevOpacity) => {
        let newOpacity
        if (targetOpacity > prevOpacity) {
          // Fading in
          newOpacity = Math.min(prevOpacity + delta / fadeDuration, targetOpacity)
        } else {
          // Fading out
          newOpacity = Math.max(prevOpacity - delta / fadeDuration, targetOpacity)
        }
        
        if (newOpacity !== targetOpacity) {
          animFrameRef.current = requestAnimationFrame((ts) => animateFade(targetOpacity, ts))
        } else {
          if (targetOpacity === 0) {
            fadingOutRef.current = false
          }
        }
        return newOpacity
      })
      lastTime = timestamp
    }

    const startFadeIn = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      lastTime = null
      animFrameRef.current = requestAnimationFrame((ts) => animateFade(1, ts))
    }

    const startFadeOut = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      lastTime = null
      animFrameRef.current = requestAnimationFrame((ts) => animateFade(0, ts))
    }

    const handleTimeUpdate = () => {
      if (!video.duration) return
      const timeLeft = video.duration - video.currentTime
      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true
        startFadeOut()
      }
    }

    const handleEnded = () => {
      setOpacity(0)
      setTimeout(() => {
        video.currentTime = 0
        video.play().then(() => {
          fadingOutRef.current = false
          startFadeIn()
        }).catch(() => {})
      }, 100)
    }

    const handlePlay = () => {
      if (opacity === 0 && !fadingOutRef.current) {
         startFadeIn()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)

    // Force play in case autoplay policy blocked it
    video.play().catch(() => {})

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
    }
  }, [opacity])

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/checkout?plan=growth')
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col relative font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        style={{ opacity }}
      />

      {/* Navigation */}
      <nav className="relative z-20 pl-6 pr-6 py-6 w-full">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto liquid-glass">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Globe size={24} className="text-white" />
              <span className="text-white font-semibold text-lg">Asme</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</Link>
              <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
              <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/checkout?plan=growth" className="text-white text-sm font-medium hover:text-white/80 transition-colors">Sign Up</Link>
            <Link to="/login" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>
        
        <div className="max-w-xl w-full space-y-4">
          <form onSubmit={handleSignup} className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base"
              required
            />
            <button 
              type="submit"
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Subscribe"
            >
              <ArrowRight size={20} />
            </button>
          </form>
          
          <p className="text-white text-sm leading-relaxed px-4 opacity-90">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>
          
          <div className="pt-4">
            <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Manifesto
            </button>
          </div>
        </div>
      </main>

      {/* Social Footer */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12 mt-auto">
        <a href="#" aria-label="Instagram" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram size={20} />
        </a>
        <a href="#" aria-label="Twitter" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter size={20} />
        </a>
        <a href="#" aria-label="Website" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={20} />
        </a>
      </footer>
    </div>
  )
}

export default Landing

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Brand {
  brand_id: string
  brand_name: string
  industry: string
  contact_email: string
  contact_phone: string
}

interface AuthContextType {
  user: User | null
  brand: Brand | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, brandName: string, industry: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshBrand: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBrand = async (userId: string) => {
    const { data } = await supabase
      .from('user_brands')
      .select('brand_id, brands(*)')
      .eq('user_id', userId)
      .single()
    if (data?.brands) {
      setBrand(data.brands as unknown as Brand)
    }
  }

  const refreshBrand = async () => {
    if (user) await fetchBrand(user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchBrand(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchBrand(session.user.id)
      else setBrand(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signUp = async (email: string, password: string, brandName: string, industry: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    if (!data.user) return { error: 'No user returned' }

    // Create brand
    const { data: brandData, error: brandErr } = await supabase
      .from('brands')
      .insert({ brand_name: brandName, industry, contact_email: email })
      .select()
      .single()
    if (brandErr) return { error: brandErr.message }

    // Link user to brand
    const { error: linkErr } = await supabase
      .from('user_brands')
      .insert({ user_id: data.user.id, brand_id: brandData.brand_id })
    if (linkErr) return { error: linkErr.message }

    setBrand(brandData)
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setBrand(null)
  }

  return (
    <AuthContext.Provider value={{ user, brand, loading, signIn, signUp, signOut, refreshBrand }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

interface User {
  id: string
  email: string
  name?: string
  brand?: Brand
  [key: string]: any
}

interface Brand {
  id: string
  brandName: string
  industry: string
  contactEmail?: string
  contactPhone?: string
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

  const fetchCurrentUser = async () => {
    try {
      // Assuming you will implement a /me endpoint or similar to get the user based on JWT
      // Wait, we don't have a /me endpoint right now. We could decode the token or just store the user object on login.
      // For now, if there's a token, let's assume logged in. But to get details, we might need a dummy user.
      const token = localStorage.getItem('auth_token')
      if (token) {
        const { data } = await api.get('/auth/me')
        setUser(data)
        setBrand(data.brand)
      } else {
        setUser(null)
        setBrand(null)
      }
    } catch (e) {
      console.error(e)
      setUser(null)
      setBrand(null)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const refreshBrand = async () => {
    // Implement brand refresh if needed
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('auth_token', response.data.accessToken)
      await fetchCurrentUser()
      return { error: null }
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Login failed' }
    }
  }

  const signUp = async (email: string, password: string, brandName: string, industry: string) => {
    try {
      await api.post('/auth/register', { 
        email, 
        password, 
        name: email.split('@')[0], 
        brandName, 
        brandIndustry: industry 
      })
      // Optionally sign in directly after registration
      return await signIn(email, password)
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Registration failed' }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('auth_token')
    setUser(null)
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

import React, { useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export interface ToastMessage { id: string; type: 'success'|'error'|'warning'|'info'; message: string }

interface ToastContextType {
  showToast: (type: ToastMessage['type'], message: string) => void
}
const ToastContext = React.createContext<ToastContextType>({ showToast: () => {} })

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const icons = { success: <CheckCircle size={16}/>, error: <AlertCircle size={16}/>, warning: <AlertTriangle size={16}/>, info: <Info size={16}/> }
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#6366f1' }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span style={{ color: colors[t.type] }}>{icons[t.type]}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button className="btn-icon" style={{ padding: 4 }} onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
              <X size={14}/>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => React.useContext(ToastContext)

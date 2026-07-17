import { createContext, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, options = {}) => {
    const id = Date.now()
    const toast = { id, message, ...options }
    setToasts(prev => [...prev, toast])
    
    if (options.duration !== 0) {
      setTimeout(() => removeToast(id), options.duration || 4000)
    }
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

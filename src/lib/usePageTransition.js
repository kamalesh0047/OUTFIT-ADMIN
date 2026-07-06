import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTransition() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const prev = useRef(location.pathname)

  useEffect(() => {
    if (prev.current === location.pathname) return
    prev.current = location.pathname
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [location.pathname])

  return loading
}

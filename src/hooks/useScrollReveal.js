import { useEffect, useRef, useState } from 'react'

// Lightweight IntersectionObserver reveal — fires once.
export default function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.unobserve(el) }
    }, { threshold: 0.15, ...options })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

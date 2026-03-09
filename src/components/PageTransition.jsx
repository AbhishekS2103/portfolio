import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

export default function PageTransition({ children }) {
  const ref = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // fade in on route change
    el.style.opacity = "0"
    el.style.transform = "translateY(12px)"
    const t = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.45s ease, transform 0.45s ease"
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    })
    return () => cancelAnimationFrame(t)
  }, [location.pathname])

  return <div ref={ref}>{children}</div>
}
import { useRef } from "react"

/**
 * Wrap any element with <Magnetic> to give it a magnetic pull effect.
 * strength: how many px it moves toward the cursor (default 12)
 */
export default function Magnetic({ children, strength = 12, className = "", style = {} }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    el.style.transition = "transform 0.1s ease"
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = "translate(0,0)"
    el.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block", ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}
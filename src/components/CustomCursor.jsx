import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const onMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onOver = (e) => {
      const el = e.target.closest("a, button, .travel-chip, .film-card, .song-card, .book-card, .skill-row")
      if (el) dot.classList.add("cursor-hover")
      else    dot.classList.remove("cursor-hover")
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onOver, { passive: true })

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" />
}
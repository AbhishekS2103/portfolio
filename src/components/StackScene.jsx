import { useEffect, useRef } from "react"

/**
 * StackScene — wraps project cards so each one sticks
 * and scales down as the next card scrolls over it.
 * Drop any number of children inside.
 */
export default function StackScene({ children }) {
  const sceneRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const cards = Array.from(scene.querySelectorAll(".stack-card"))
    const CARD_HEIGHT = cards[0]?.offsetHeight || 300
    const OFFSET      = 24   // gap between sticky tops
    const SCALE_STEP  = 0.03 // how much each buried card shrinks

    function onScroll() {
      const sceneTop = scene.getBoundingClientRect().top
      cards.forEach((card, i) => {
        const cardTop = card.getBoundingClientRect().top
        const burial  = Math.max(0, 72 + OFFSET * i - cardTop) // how far it's been pushed under
        const scale   = Math.max(1 - SCALE_STEP * burial / CARD_HEIGHT, 0.88)
        const opacity = Math.max(1 - 0.15 * burial / CARD_HEIGHT, 0.6)
        card.style.transform = `scale(${scale})`
        card.style.opacity   = `${opacity}`
        card.style.top       = `${72 + OFFSET * i}px`
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="stack-scene" ref={sceneRef}>
      {children}
    </div>
  )
}
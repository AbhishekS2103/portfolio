import { useEffect, useRef } from "react"

export default function DotGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    let animId, w, h, t = 0
    const mouse  = { x: -9999, y: -9999 }

    const SPACING  = 38
    const DOT_R    = 1.7
    const SPEED    = 0.009
    const REPEL_R  = 110   // radius of repulsion
    const REPEL_F  = 28    // how many px dots push away at closest point
    const COLOR    = "126,200,247"

    const resize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }, { passive: true })

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const cols = Math.ceil(w / SPACING) + 2
      const rows = Math.ceil(h / SPACING) + 2

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const ox = i * SPACING   // original x
          const oy = j * SPACING   // original y

          // wave alpha
          const wave  = Math.sin(i * 0.32 + j * 0.32 + t)
          let alpha   = (wave + 1) / 2 * 0.55 + 0.12
          let x = ox, y = oy

          // magnetic repulsion
          const dx   = ox - mouse.x
          const dy   = oy - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < REPEL_R && dist > 0) {
            const force  = (1 - dist / REPEL_R)
            const angle  = Math.atan2(dy, dx)
            x += Math.cos(angle) * force * REPEL_F
            y += Math.sin(angle) * force * REPEL_F
            alpha += force * 0.6    // brighten as they push away
          }

          ctx.beginPath()
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${COLOR},${Math.min(alpha, 1.0)})`
          ctx.fill()
        }
      }

      t += SPEED
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="dot-grid">
      <canvas ref={canvasRef} />
    </div>
  )
}
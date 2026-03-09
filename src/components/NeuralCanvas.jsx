import { useEffect, useRef } from "react"

export default function NeuralCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId, w, h

    const mouse = { x: -9999, y: -9999 }
    const PARTICLE_COUNT = 85
    const CONNECT_DIST   = 140
    const MOUSE_DIST     = 170
    const MOUSE_PULL     = 0.014
    const SPEED          = 0.45
    const COLOR          = "126,200,247"
    const particles      = []

    // fade in on mount
    canvas.classList.add("visible")

    // hide when user scrolls past landing section
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        canvas.style.opacity = "0"
        canvas.style.pointerEvents = "none"
      } else {
        canvas.style.opacity = "1"
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const resize = () => {
      // size from window — canvas fills landing section which is 100vh/100vw
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // spawn particles spread across full canvas
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.4 + 1.0,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        // drift toward mouse
        const mdx = mouse.x - p.x
        const mdy = mouse.y - p.y
        const md  = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < MOUSE_DIST && md > 0) {
          p.vx += (mdx / md) * MOUSE_PULL
          p.vy += (mdy / md) * MOUSE_PULL
        }

        // speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > SPEED * 2.2) { p.vx *= 0.88; p.vy *= 0.88 }

        p.x += p.vx
        p.y += p.vy

        // wrap edges (smoother than bounce)
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COLOR}, 0.8)`
        ctx.fill()
      }

      // connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      // connections from mouse to nearby particles
      for (const p of particles) {
        const dx   = p.x - mouse.x
        const dy   = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.7
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`
          ctx.lineWidth = 0.9
          ctx.stroke()
        }
      }

      // mouse node
      if (mouse.x > 0 && mouse.x < w) {
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COLOR}, 0.95)`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="neural-canvas" />
}
import { useEffect, useRef } from "react"

export default function HeroText({ lines = [], className = "", personal = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const words = ref.current?.querySelectorAll(".hw")
    if (!words) return
    words.forEach((w, i) => {
      w.style.animationDelay = `${0.08 + i * 0.09}s`
    })
  }, [])

  const cls = personal ? `personal-hero-name ${className}` : `hero-name ${className}`

  return (
    <h1 className={cls} ref={ref}>
      {lines.map((line, li) => (
        <span key={li} className="hero-line">
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="hw-wrap">
              <span className="hw">{word}</span>
              {wi < line.split(" ").length - 1 && "\u00a0"}
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </h1>
  )
}
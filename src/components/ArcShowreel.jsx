import { useEffect, useRef } from 'react'
import { AV_STATS } from '../data'
import StatCard, { PANELS } from './StatCard'

/* =========================================================================
   ARC SHOWREEL (mobile) — the same tumbling-wheel mechanic as the desktop
   CursorShowreel, but the hub sits ABOVE the screen and centred, so the cards
   ride the BOTTOM of the wheel: a shallow downward arc across the top of the
   hero. Cards drift + tumble along the rim exactly like desktop. Isolated from
   CursorShowreel so the desktop wheel is never touched.
   ========================================================================= */

const STEP = 0.78    // angular gap between cards on the rim (rad) — wide so cards
                     // spread along the arc instead of hiding one another
const DRIFT = 0.05   // steady rotation speed (rad/s) — matches desktop's calm drift
const TUMBLE = 0.6   // how much rim angle becomes card rotation
const HALF = Math.PI / 2 // rim centre = bottom of the circle (points down)
const HUB_X = 0.42   // hub x as a fraction of width — a touch left of centre

export default function ArcShowreel() {
  /* belt doubled so the loop never shows a hole across the visible arc */
  const items = [...AV_STATS, ...AV_STATS]
  const n = items.length
  const stageRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const st = { scroll: 0 }
    let raf
    let last = performance.now()
    const span = n * STEP
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const stage = stageRef.current
      if (!stage) { raf = requestAnimationFrame(loop); return }
      const w = stage.clientWidth
      const h = stage.clientHeight
      /* big radius = gentle arc. hub centred horizontally, lifted above the top
         so the rim's lowest point dips ~46% of the width into the band. */
      const R = w * 0.92
      const cx = w * HUB_X /* hub sits a touch left of centre */
      const cy = -R + Math.min(h - 40, w * 0.46)

      if (!reduced) st.scroll += DRIFT * dt

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        /* theta = signed angle from the rim centre (bottom of the circle) */
        const theta = ((((i * STEP + st.scroll) % span) + span) % span) - span / 2
        const a = HALF + theta
        const x = cx + Math.cos(a) * R
        const y = cy + Math.sin(a) * R
        const rot = theta * TUMBLE * (180 / Math.PI)
        const off = Math.abs(theta)
        const sc = Math.max(0.7, 1 - off * 0.13)
        const op = off > 0.82 ? Math.max(0, 1 - (off - 0.82) / 0.32) : 1
        el.style.transform =
          `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`
        /* monotonic z along the rim so each card cleanly overlaps the last */
        el.style.zIndex = `${200 + Math.round(theta * 40)}`
        el.style.opacity = op.toFixed(2)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [n])

  return (
    <div className="arcreel" ref={stageRef} aria-hidden="true">
      {items.map((s, i) => (
        <StatCard
          key={`${s.label}-${i}`}
          ref={(el) => (cardRefs.current[i] = el)}
          s={s}
          panel={PANELS[i % PANELS.length]}
        />
      ))}
    </div>
  )
}

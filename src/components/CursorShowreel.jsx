import { useEffect, useRef, useState } from 'react'
import { AV_STATS } from '../data'
import StatCard, { PANELS } from './StatCard'

/* =========================================================================
   CURSOR SHOWREEL — circular wheel marquee (per reference).
   The tarot cards ride the rim of a huge invisible wheel whose hub sits
   far off the left edge of the stage. The wheel turns slowly on its own,
   so cards sweep through the visible arc in an endless loop, tumbling
   along the tangent as they travel. Cursor-sensitive: pointer height
   steers the wheel — high spins it forward, low spins it back, and the
   further from the middle the faster it turns. Click gives it a push.
   ========================================================================= */

const R = 560 /* default wheel radius — big, so the visible arc stays gentle */
const STEP = 0.34 /* angular gap between cards on the rim (rad) — cards always overlap in a cascade, but light enough that each card's number clears the one above; the breathing only varies the gap */
const DRIFT = 0.049 /* steady rotation speed (rad/s) — constant, not cursor-driven; slow, contemplative drift */
const TUMBLE = 0.62 /* how much of the rim angle becomes card rotation */
const BREATH_AMP = 0.13 /* how far the stack spreads then draws back — kept modest so cards always stay overlapped, only the gap changes */
const BREATH_FREQ = 0.5 /* breathing speed (rad/s) — one spread+gather every ~12.5s */

/* Geometry is overridable so v2 can flatten the arc and drop the hub lower —
   less vertical spread means the top/bottom cards stop clipping the stage.
   Defaults reproduce v1 exactly, so the original hero is untouched. */
export default function CursorShowreel({
  watchRef,
  radius = R,
  hubXFrac = 0.42,
  hubYFrac = 0.5,
}) {
  /* belt doubled: with the tight STEP the five stats alone wouldn't
     cover the visible arc, so the loop would show a hole */
  const items = [...AV_STATS, ...AV_STATS]
  const n = items.length
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const hovering = useRef(false)

  /* on phones the wheel collides with the hero copy — swap it for a simple
     horizontal marquee (below). Track the breakpoint so the rAF wheel stops. */
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* hovering the stack pauses it — nothing else about the cursor matters */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const enter = () => { hovering.current = true }
    const leave = () => { hovering.current = false }
    stage.addEventListener('pointerenter', enter)
    stage.addEventListener('pointerleave', leave)
    return () => {
      stage.removeEventListener('pointerenter', enter)
      stage.removeEventListener('pointerleave', leave)
    }
  }, [])

  /* rAF: steady drift + a slow breathing spread; hover eases it to a stop */
  useEffect(() => {
    /* mobile renders a CSS marquee instead — clear any wheel transforms the
       rAF left on the cards so flow layout + the marquee animation take over */
    if (isMobile) {
      cardRefs.current.forEach((el) => { if (el) el.style.cssText = '' })
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const st = { scroll: 0, vel: 0, breath: 0 }
    let raf
    let last = performance.now()
    const span = n * STEP
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const stage = stageRef.current
      if (!stage) {
        raf = requestAnimationFrame(loop)
        return
      }
      const w = stage.clientWidth
      const h = stage.clientHeight
      /* hub far off the left edge; the rim bulges into the stage */
      const cx = w * hubXFrac - radius
      const cy = h * hubYFrac

      const paused = reduced || hovering.current
      /* one constant speed; hover eases the drift to a stop in about half a
         second — quick enough to read as "stopped", soft enough not to jerk */
      const target = paused ? 0 : DRIFT
      st.vel += (target - st.vel) * (paused ? 0.14 : 0.06)
      st.scroll += st.vel * dt
      /* breathing phase advances only while live, so it freezes on hover */
      if (!paused) st.breath += dt
      const breath = 1 + Math.sin(st.breath * BREATH_FREQ) * BREATH_AMP

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        /* rim position, wrapped so the belt of cards loops forever;
           breath scales the spread so cards drift apart then re-stack */
        const a0 = ((((i * STEP + st.scroll) % span) + span) % span) - span / 2
        const a = a0 * breath
        const x = cx + Math.cos(a) * radius
        const y = cy + Math.sin(a) * radius
        const rot = a * TUMBLE * (180 / Math.PI)
        const off = Math.abs(a)
        /* cards shrink and dim (but never desaturate) as they leave the heart,
           so the vivid purples keep popping across the whole arc */
        const sc = Math.max(0.7, 1 - off * 0.12)
        const dim = Math.min(0.24, Math.max(0, (off - 0.35) * 0.3))
        const op = off > 1.05 ? Math.max(0, 1 - (off - 1.05) / 0.3) : 1
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`
        /* z rises monotonically down the belt so each lower card overlaps the
           one above it — a steady cascade, never a reversal at the centre */
        el.style.zIndex = `${200 + Math.round(a * 40)}`
        el.style.opacity = op.toFixed(2)
        el.style.filter = dim > 0.01 ? `brightness(${(1 - dim).toFixed(2)})` : 'none'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [n, isMobile, radius, hubXFrac, hubYFrac])

  return (
    <div className="stackreel stackreel--wheel" ref={stageRef}>
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

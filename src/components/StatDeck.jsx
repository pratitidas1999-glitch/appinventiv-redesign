import { useEffect, useRef } from 'react'
import { AV_STATS } from '../data'
import StatCard, { PANELS } from './StatCard'

/* =========================================================================
   STAT DECK (mobile) — a stacked coverflow carousel. One card sits centred
   and full-size; its neighbours peek out behind it on the left and right,
   progressively smaller and dimmer. The deck advances on its own (auto-swipe)
   and follows the finger on a horizontal drag, snapping to the nearest card
   on release. Cards wrap forever, so it never runs out. Isolated from the
   desktop wheel (CursorShowreel) and the arc (ArcShowreel).
   ========================================================================= */

const GAP = 46 /* px each card is offset from its inner neighbour */
const SCALE = 0.1 /* how much each step shrinks a card (pos1 → 0.90, pos2 → 0.80) */
const SWIPE = 150 /* px of drag that moves the deck by one whole card */
const AUTO_MS = 2800 /* dwell on each card before the deck auto-advances */

export default function StatDeck() {
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const n = AV_STATS.length

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const EASE = reduced ? 1 : 0.15
    /* tighter peek on phones so the neighbours don't get sliced at the screen
       edge; the roomier desktop offset stays as-is */
    const gap = window.matchMedia('(max-width: 760px)').matches ? 30 : GAP

    /* cur = the position shown this frame; target = where it's easing to.
       Both are unbounded floats; place() wraps them onto the 5-card ring. */
    const st = { cur: 0, target: 0, drag: false, startX: 0, base: 0 }

    /* lay every card out for a (possibly fractional) active position */
    const place = (active) => {
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        /* signed distance to the active slot, wrapped to [-n/2, n/2] so the
           ring is seamless and always takes the short way round */
        let rel = i - active
        rel -= n * Math.round(rel / n)
        const abs = Math.abs(rel)
        const x = rel * gap
        const sc = Math.max(0.6, 1 - abs * SCALE)
        /* full opacity out to ±2; only the card crossing the back seam fades */
        const op = abs <= 2 ? 1 : Math.max(0, 1 - (abs - 2) / 0.5)
        el.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) scale(${sc.toFixed(3)})`
        el.style.zIndex = `${Math.round(1000 - abs * 100)}`
        el.style.opacity = op.toFixed(2)
      }
    }

    let raf
    const loop = () => {
      st.cur += (st.target - st.cur) * EASE
      if (Math.abs(st.target - st.cur) < 0.0005) st.cur = st.target
      place(st.cur)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    /* auto-advance — paused while dragging and for a beat after a swipe */
    let timer
    const startAuto = () => {
      if (reduced) return
      clearInterval(timer)
      timer = setInterval(() => {
        if (!st.drag) st.target = Math.round(st.target) + 1
      }, AUTO_MS)
    }
    startAuto()

    const stage = stageRef.current
    const onDown = (e) => {
      st.drag = true
      st.startX = e.clientX
      st.base = st.target = st.cur
      clearInterval(timer)
      try { stage.setPointerCapture(e.pointerId) } catch { /* no active pointer */ }
    }
    const onMove = (e) => {
      if (!st.drag) return
      /* finger-left (dx<0) brings the next card in → active increases */
      const dx = e.clientX - st.startX
      st.cur = st.target = st.base - dx / SWIPE
      place(st.cur)
    }
    const onUp = (e) => {
      if (!st.drag) return
      st.drag = false
      try { stage.releasePointerCapture(e.pointerId) } catch { /* already released */ }
      const delta = st.cur - st.base
      let snap = Math.round(st.cur)
      /* a short but deliberate flick still advances one card */
      if (Math.abs(delta) > 0.18 && snap === st.base) snap = st.base + Math.sign(delta)
      st.target = snap
      startAuto()
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(timer)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [n])

  return (
    <div className="statdeck" ref={stageRef} aria-hidden="true">
      {AV_STATS.map((s, i) => (
        <StatCard
          key={s.label}
          ref={(el) => (cardRefs.current[i] = el)}
          s={s}
          panel={PANELS[i % PANELS.length]}
        />
      ))}
    </div>
  )
}

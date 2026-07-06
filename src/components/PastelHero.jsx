import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AV_HERO, AV_STATS } from '../data'
import CursorShowreel from './CursorShowreel'
import StatMarquee from './StatMarquee'
import StatDeck from './StatDeck'

/* =========================================================================
   PASTEL HERO — "we're here to solve your issues."
   A living gradient field: lavender, purple and yellow blooms drifting
   slowly across warm paper, gently leaning toward the cursor. Copy is
   near-black ink on the light field — movement without conflict.
   ========================================================================= */

/* each bloom: base position (fractions), drift radii, period, color stops.
   Kept deliberately faint — the field should whisper, not perform. */
const BLOOMS = [
  { x: 0.8, y: 0.2, r: 0.5, ax: 0.05, ay: 0.04, w: 0.00006, p: 0.5, c: '226,221,213', a: 0.34 }, /* warm greige */
  { x: 0.12, y: 0.74, r: 0.42, ax: 0.04, ay: 0.05, w: 0.00007, p: 2.1, c: '213,210,215', a: 0.2 }, /* soft grey */
  { x: 0.45, y: 0.08, r: 0.34, ax: 0.05, ay: 0.03, w: 0.00005, p: 4.2, c: '208,199,230', a: 0.16 }, /* faint lavender hint */
]

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function PastelHero() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    let cw = 0
    let ch = 0

    const resize = () => {
      cw = section.clientWidth
      ch = section.clientHeight
      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    /* cursor lean — blooms drift a few percent toward the pointer */
    const mouse = { tx: 0.5, ty: 0.45, x: 0.5, y: 0.45, in: false }
    const onMove = (e) => {
      const r = section.getBoundingClientRect()
      mouse.tx = (e.clientX - r.left) / r.width
      mouse.ty = (e.clientY - r.top) / r.height
      mouse.in = true
    }
    const onLeave = () => {
      mouse.tx = 0.5
      mouse.ty = 0.45
      mouse.in = false
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)

    let raf
    const frame = (t) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      /* transparent canvas — the page's pixel grid shows through */
      ctx.clearRect(0, 0, cw, ch)

      const minD = Math.min(cw, ch)
      for (const b of BLOOMS) {
        const lean = 0.045
        const bx = (b.x + Math.sin(t * b.w + b.p) * b.ax + (mouse.x - 0.5) * lean) * cw
        const by = (b.y + Math.cos(t * b.w * 1.3 + b.p * 2) * b.ay + (mouse.y - 0.45) * lean) * ch
        const br = b.r * minD * (1 + 0.05 * Math.sin(t * b.w * 2 + b.p))
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, `rgba(${b.c},${b.a})`)
        g.addColorStop(0.55, `rgba(${b.c},${b.a * 0.45})`)
        g.addColorStop(1, `rgba(${b.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, cw, ch)
      }

      /* cursor dot-grid removed — not needed; the drifting gradient field
         carries the background motion on its own */

      raf = requestAnimationFrame(frame)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      frame(4000)
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section id="top" className="hero hero--pastel" ref={sectionRef}>
      <canvas ref={canvasRef} className="pastel__canvas" aria-hidden="true" />
      <div className="container pastel__inner">
        {/* mobile only — a swipeable, auto-advancing stacked card deck */}
        <div className="hero__deck">
          <StatDeck />
        </div>
        {/* mobile only — 2 cards ride above the heading (full-bleed marquee) */}
        <StatMarquee
          className="hero__mcards hero__mcards--top"
          stats={AV_STATS.slice(0, 2)}
          panelOffset={0}
          duration={22}
        />
        <motion.div
          className="pastel__copy"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.span variants={rise} className="kicker">
            {AV_HERO.kicker}
          </motion.span>
          <motion.h1 variants={rise} className="hero__title display">
            <em className="hero__lede">Engineering</em> the Next Generation of
            Digital Systems <span className="pastel__hl">with AI</span>
          </motion.h1>
          <motion.p variants={rise} className="lead hero__sub">
            {AV_HERO.sub}
          </motion.p>
          <motion.div variants={rise} className="hero__ctas">
            <a href="#contact" className="btn btn-primary">
              {AV_HERO.cta} <span className="arrow">→</span>
            </a>
            <a href="#work" className="btn btn-ghost">
              See Our Work
            </a>
          </motion.div>
        </motion.div>
        {/* mobile only — 3 cards below the copy (full-bleed marquee) */}
        <StatMarquee
          className="hero__mcards hero__mcards--bottom"
          stats={AV_STATS.slice(2)}
          panelOffset={2}
          duration={30}
        />
        <motion.div
          className="pastel__reelcol"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <CursorShowreel watchRef={sectionRef} />
        </motion.div>
      </div>
    </section>
  )
}

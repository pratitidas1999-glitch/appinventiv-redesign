import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AV_HERO, TRUST_LOGOS } from '../data'
import CursorShowreel from './CursorShowreel'

/* =========================================================================
   PASTEL HERO — V2 (review fixes over the saved v1)
   1. Card wheel flattened + hub dropped, and the stage is masked top/bottom
      so cards dissolve at the edges instead of hard-clipping.
   2. Real client proof: a "Trusted by" logo strip under the CTAs — fills the
      previously empty lower-right and swaps vanity metrics for third-party
      credibility.
   3. Word-by-word text-reveal headline (mask reveal) — the animation the
      brief explicitly rewards.
   4. Scroll parallax on the reel so the composition feels alive on scroll.
   The living-gradient background is carried over verbatim from v1.
   ========================================================================= */

const BLOOMS = [
  { x: 0.8, y: 0.2, r: 0.5, ax: 0.05, ay: 0.04, w: 0.00006, p: 0.5, c: '226,221,213', a: 0.34 },
  { x: 0.12, y: 0.74, r: 0.42, ax: 0.04, ay: 0.05, w: 0.00007, p: 2.1, c: '213,210,215', a: 0.2 },
  { x: 0.45, y: 0.08, r: 0.34, ax: 0.05, ay: 0.03, w: 0.00005, p: 4.2, c: '208,199,230', a: 0.16 },
]

/* headline split into words; the opening word keeps the serif-italic Lyon
   treatment, "with AI" stays together so it never wraps mid-phrase */
const HEAD_WORDS = [
  { t: 'Engineering', lede: true },
  { t: 'the' }, { t: 'Next' }, { t: 'Generation' }, { t: 'of' },
  { t: 'Digital' }, { t: 'Systems' }, { t: 'with AI', hl: true },
]

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function PastelHeroV2() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  /* reel drifts up a touch as the hero scrolls away — subtle depth */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const reelY = useTransform(scrollYProgress, [0, 1], [0, -70])

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

      /* cursor dot-grid removed — it added visual noise without helping the
         message. The gradient field alone carries the background motion. */

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

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section id="top" className="hero hero--pastel hero--pastel2" ref={sectionRef}>
      <canvas ref={canvasRef} className="pastel__canvas" aria-hidden="true" />
      <div className="container pastel__inner">
        <motion.div
          className="pastel__copy"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
        >
          <motion.span variants={rise} className="kicker">
            {AV_HERO.kicker}
          </motion.span>

          {/* word-by-word mask reveal — the space sits BETWEEN the clip
              wrappers (never inside one) so words keep their gaps */}
          <h1 className="hero__title display pastel2__title" aria-label={AV_HERO.title}>
            {HEAD_WORDS.map((w, i) => (
              <span className="reveal-word" key={i} aria-hidden="true">
                <motion.span
                  className={`reveal-word__inner${w.lede ? ' hero__lede' : ''}${w.hl ? ' pastel__hl' : ''}`}
                  initial={reduced ? { y: '0%' } : { y: '112%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w.t}
                </motion.span>
              </span>
            )).reduce((acc, el, i) => (i === 0 ? [el] : [...acc, ' ', el]), [])}
          </h1>

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

          {/* real client proof — fills the lower-right, adds third-party trust */}
          <motion.div variants={rise} className="pastel2__trust">
            <span className="pastel2__trust-cap">Trusted by category leaders</span>
            <div className="pastel2__logos">
              {TRUST_LOGOS.map((name) => (
                <span key={name} className="pastel2__logo">{name}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="pastel__reelcol"
          style={{ y: reelY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          {/* mask fades cards at top/bottom instead of a hard clip */}
          <div className="pastel2__reelmask">
            <CursorShowreel watchRef={sectionRef} radius={720} hubYFrac={0.52} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

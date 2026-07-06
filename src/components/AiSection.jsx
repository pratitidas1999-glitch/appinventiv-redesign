import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Counter from './Counter'
import AiNeuralField from './AiNeuralField'
import { AV_AI } from '../data'
import { asset } from '../asset'

/* =========================================================================
   INVENTIVAI — cinematic AI band.
   A dark full-bleed moment: the AI footage plays behind a cursor-reactive
   neural field (screen-blended so its signals glow over the video). Real copy
   and real numbers (150+/200+/50+/35+, verbatim from appinventiv.com) sit on
   top. The animation is aesthetic; every fact is verifiable.
   ========================================================================= */

const inView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}
const stagger = (i) => ({ ...inView, transition: { ...inView.transition, delay: i * 0.09 } })

export default function AiSection() {
  const vidRef = useRef(null)
  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); return }
    const slow = () => { v.playbackRate = 0.7 }
    slow()
    v.addEventListener('loadedmetadata', slow)
    return () => v.removeEventListener('loadedmetadata', slow)
  }, [])

  return (
    <section id="ai" className="section aiband">
      <video
        ref={vidRef}
        className="ai__bg"
        src={asset('/videos/ai-hero.mp4')}
        autoPlay muted loop playsInline
        aria-hidden="true"
      />
      <span className="ai__tint" aria-hidden="true" />
      <AiNeuralField />
      <span className="ai__wash" aria-hidden="true" />

      <div className="container ai__wrap">
        {/* ---- message ---- */}
        <motion.div className="ai__top" {...inView}>
          <span className="kicker ai__eyebrow">{AV_AI.eyebrow} · {AV_AI.label}</span>
          <h2 className="display ai__title">
            {AV_AI.titleLead}<em className="avlede">{AV_AI.titleLede}</em>
          </h2>
          <p className="ai__promise">{AV_AI.promise}</p>
          <div className="ai__ctas">
            <a href="#contact" className="btn btn-primary ai__cta">
              <span>{AV_AI.ctaPrimary}</span><span className="arrow">→</span>
            </a>
            <a href="#ai" className="ai__ghost">{AV_AI.ctaGhost} <span className="arrow">↗</span></a>
          </div>
        </motion.div>

        {/* ---- footer: capabilities + real numbers ---- */}
        <div className="ai__foot">
          <motion.div className="ai__caps" {...stagger(1)}>
            {AV_AI.capabilities.map((c) => (
              <div className="ai__cap" key={c.title}>
                <h3 className="ai__cap-title">{c.title}</h3>
                <span className="ai__cap-items">{c.items.join(' · ')}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="ai__stats" {...stagger(2)}>
            {AV_AI.stats.map((s) => (
              <div className="ai__stat" key={s.label}>
                <Counter value={s.value} suffix={s.suffix} />
                <span className="ai__stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p className="ai__industries-line" {...inView}>
          <span className="ai__industries-label">Deployed across</span>
          {AV_AI.industries.join(' · ')}
        </motion.p>
      </div>
    </section>
  )
}

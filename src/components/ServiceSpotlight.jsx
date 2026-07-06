import { useRef } from 'react'
import { motion } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { GRADIENTS, LIGHT, Icon, sectionInView } from './serviceMeta'

/* SPOTLIGHT — four cards in a row. A soft radial glow tracks the cursor across
   each card; hovering lifts the card and fades in its stat + CTA. */
function Card({ s, i }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <article
      ref={ref}
      className={`spot${LIGHT.has(i) ? ' spot--light' : ''}`}
      style={{ background: GRADIENTS[i % GRADIENTS.length] }}
      onMouseMove={onMove}
      tabIndex={0}
    >
      <span className="spot__glow" aria-hidden="true" />
      <div className="spot__inner">
        <span className="spot__icon"><Icon i={i} /></span>
        <span className="spot__idx">{s.index}</span>
        <h3 className="spot__title">{s.title}</h3>
        <p className="spot__blurb">{s.blurb}</p>
        <div className="spot__reveal">
          <span className="spot__proof"><b>{s.proof.value}</b> {s.proof.label}</span>
          <a href="#contact" className="spot__cta">
            {s.cta} <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function ServiceSpotlight() {
  return (
    <section id="services" className="section avservices">
      <div className="container">
        <motion.h2 className="avh2 display" {...sectionInView}>
          {AV_TRANSFORMATION.title}
        </motion.h2>
        <motion.div className="spotrow" {...sectionInView}>
          {SERVICES.map((s, i) => (
            <Card key={s.id} s={s} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

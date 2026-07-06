import { motion } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { GRADIENTS, LIGHT, Icon, sectionInView } from './serviceMeta'

/* BENTO — asymmetric tile grid, all four visible; hover a tile to reveal the
   stat + CTA (which slide up from the bottom). */
export default function ServiceBento() {
  return (
    <section id="services" className="section avservices">
      <div className="container">
        <motion.h2 className="avh2 display" {...sectionInView}>
          {AV_TRANSFORMATION.title}
        </motion.h2>

        <motion.div className="bento" {...sectionInView}>
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className={`bento__tile bento__tile--${i + 1}${LIGHT.has(i) ? ' bento__tile--light' : ''}`}
              style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              tabIndex={0}
            >
              <div className="bento__top">
                <span className="bento__icon"><Icon i={i} /></span>
                <span className="bento__idx">{s.index}</span>
              </div>
              <div className="bento__mid">
                <h3 className="bento__title">{s.title}</h3>
                <p className="bento__blurb">{s.blurb}</p>
              </div>
              <div className="bento__reveal">
                <span className="bento__proof"><b>{s.proof.value}</b> {s.proof.label}</span>
                <a href="#contact" className="bento__cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { GRADIENTS, LIGHT, Icon, sectionInView } from './serviceMeta'

/* STICKY SCROLL STORY — the section pins while you scroll; each service is a
   "beat". Copy pins on the left, a branded visual swaps on the right. On mobile
   the scroll-jack is dropped for a plain stacked list. */
export default function ServiceSticky() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const set = () => setMobile(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = SERVICES.length
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999))))
  })

  if (mobile) {
    return (
      <section id="services" className="section avservices">
        <div className="container">
          <motion.h2 className="avh2 display" {...sectionInView}>
            {AV_TRANSFORMATION.title}
          </motion.h2>
          <div className="stickystack">
            {SERVICES.map((s, i) => (
              <article
                key={s.id}
                className={`stickycard${LIGHT.has(i) ? ' sticky--light' : ''}`}
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                <span className="sticky__icon"><Icon i={i} /></span>
                <span className="sticky__idx">{s.index}</span>
                <h3 className="sticky__title">{s.title}</h3>
                <p className="sticky__blurb">{s.blurb}</p>
                <div className="sticky__proof"><b>{s.proof.value}</b> {s.proof.label}</div>
                <a href="#contact" className="sticky__cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const s = SERVICES[active]
  const light = LIGHT.has(active)

  return (
    <section
      id="services"
      className="section avservices sticky-sec"
      ref={ref}
      style={{ height: `${SERVICES.length * 100}vh` }}
    >
      <div className="sticky-stage">
        <div className="container sticky-grid">
          <div className="sticky-copy">
            <h2 className="avh2 display sticky-h2">{AV_TRANSFORMATION.title}</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="sticky__idx">{s.index}</span>
                <h3 className="sticky__title">{s.title}</h3>
                <p className="sticky__blurb">{s.blurb}</p>
                <div className="sticky__proof"><b>{s.proof.value}</b> {s.proof.label}</div>
                <a href="#contact" className="sticky__cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </motion.div>
            </AnimatePresence>
            <div className="sticky-dots" aria-hidden="true">
              {SERVICES.map((_, i) => (
                <span key={i} className={`sticky-dot${i === active ? ' is-on' : ''}`} />
              ))}
            </div>
          </div>

          <div className="sticky-viz-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id + '-v'}
                className={`sticky-viz${light ? ' sticky-viz--light' : ''}`}
                style={{ background: GRADIENTS[active % GRADIENTS.length] }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="sticky-viz__icon"><Icon i={active} /></span>
                <span className="sticky-viz__stat"><b>{s.proof.value}</b> {s.proof.label}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { GRADIENTS, LIGHT, Icon, sectionInView } from './serviceMeta'

/* TABS — a row of service tabs drives one large preview panel. Clicking a tab
   swaps the copy + a big branded visual (the icon on the service's ground). */
export default function ServiceTabs() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]
  const light = LIGHT.has(active)

  return (
    <section id="services" className="section avservices">
      <div className="container">
        <motion.h2 className="avh2 display" {...sectionInView}>
          {AV_TRANSFORMATION.title}
        </motion.h2>

        <motion.div className="svctabs" {...sectionInView}>
          <div className="svctabs__bar" role="tablist" aria-label="Services">
            {SERVICES.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={active === i}
                className={`svctabs__tab${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="svctabs__tabidx">{t.index}</span>
                <span className="svctabs__tabname">{t.title}</span>
              </button>
            ))}
          </div>

          <div className={`svctabs__panel${light ? ' svctabs__panel--light' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                className="svctabs__copy"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="svctabs__idx">{s.index}</span>
                <h3 className="svctabs__title">{s.title}</h3>
                <p className="svctabs__blurb">{s.blurb}</p>
                <div className="svctabs__proof"><b>{s.proof.value}</b> {s.proof.label}</div>
                <a href="#contact" className="svctabs__cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={s.id + '-viz'}
                className={`svctabs__viz${light ? ' svctabs__viz--light' : ''}`}
                style={{ background: GRADIENTS[active % GRADIENTS.length] }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="svctabs__vizicon"><Icon i={active} /></span>
                <span className="svctabs__vizstat"><b>{s.proof.value}</b></span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'

/* =========================================================================
   SERVICE ACCORDION — hover-expanding panels.
   Collapsed panels are icon slivers; the active panel opens to reveal the
   service title, blurb, a proof stat, and a CTA. Hover (or keyboard focus,
   or tap on touch) swaps which panel is open. On mobile it becomes a plain
   vertical stack so every service stays readable.
   ========================================================================= */

/* per-panel grounds — purple / charcoal / rust / white. The first three carry
   white text; the white panel flips to dark ink (see svcpanel--light). */
const GRADIENTS = [
  'linear-gradient(155deg, #5a3ad0 0%, #3d2597 100%)',
  'linear-gradient(155deg, #2c2933 0%, #17161a 100%)',
  'linear-gradient(155deg, #cb551f 0%, #8f3a12 100%)',
  'linear-gradient(155deg, #ffffff 0%, #f1ecdf 100%)',
]
/* which panels are light-grounded (dark text) */
const LIGHT = new Set([3])

/* monoline icons, one per service, in section order
   (Consulting · Product · AI/Data · Cloud). Stroke = currentColor. */
const ICONS = [
  /* Strategic Technology Consulting — compass / strategy */
  <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" /></>,
  /* Digital Product Development & Engineering — layout / build */
  <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
  /* AI, Data and Analytics — analytics bars */
  <><path d="M4 20V10M9.5 20V4M15 20v-7M20.5 20V8" /></>,
  /* Cloud Operations and Cybersecurity — shield */
  <><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
]

function Icon({ i }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[i]}
    </svg>
  )
}

const inView = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

export default function ServiceAccordion() {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="section avservices">
      <div className="container">
        <motion.h2 className="avh2 display" {...inView}>
          {AV_TRANSFORMATION.title}
        </motion.h2>

        <motion.div className="svcacc" role="tablist" aria-label="Services" {...inView}>
          {SERVICES.map((s, i) => {
            const isActive = active === i
            return (
              <article
                key={s.id}
                className={`svcrow${isActive ? ' is-active' : ''}${LIGHT.has(i) ? ' svcrow--light' : ''}`}
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                {/* header — always visible, title reads horizontally */}
                <div className="svcrow__header">
                  <span className="svcrow__icon"><Icon i={i} /></span>
                  <span className="svcrow__idx">{s.index}</span>
                  <h3 className="svcrow__title">{s.title}</h3>
                  <span className="svcrow__chev" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>

                {/* body — drops down when active */}
                <div className="svcrow__bodywrap">
                  <div className="svcrow__body">
                    <div className="svcrow__inner">
                      <p className="svcrow__blurb">{s.blurb}</p>
                      <div className="svcrow__proof">
                        <b>{s.proof.value}</b> {s.proof.label}
                      </div>
                      <a href="#contact" className="svcrow__cta">
                        {s.cta} <span className="arrow">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

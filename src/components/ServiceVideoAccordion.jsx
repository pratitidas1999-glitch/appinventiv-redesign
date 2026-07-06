import { useState } from 'react'
import { motion } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'

/* =========================================================================
   SERVICE VIDEO ACCORDION (mockup)
   Vertical accordion. Collapsed rows play their service video in the
   background with the section icon + title at the bottom. The active row
   opens into a half/half layout: video on the left, copy (title, blurb,
   stat, CTA) on the right.
   ========================================================================= */

const VIDEOS = {
  consulting: '/videos/consulting.mp4',
  product:    '/videos/product.mp4',
  ai:         '/videos/ai.mp4',
  cloud:      '/videos/cloud.mp4',
}
const SPEEDS = { consulting: 0.5 }

/* monoline icons, one per service, in section order */
const ICONS = [
  <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" /></>,
  <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
  <><path d="M4 20V10M9.5 20V4M15 20v-7M20.5 20V8" /></>,
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

/* background video — always playing, muted + looping */
function Bg({ s }) {
  const src = VIDEOS[s.id]
  const rate = SPEEDS[s.id] ?? 1
  return (
    <video
      className="vrow__bg"
      src={src}
      autoPlay muted loop playsInline
      ref={(el) => { if (el) el.playbackRate = rate }}
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate }}
    />
  )
}

/* animate on mount (not on scroll) so the mockup always renders, even if it
   loads already in view or the reveal trigger never fires */
const inView = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

export default function ServiceVideoAccordion() {
  const [active, setActive] = useState(0)

  /* italic last word, matching the hero lede */
  const title = AV_TRANSFORMATION.title
  const cut = title.lastIndexOf(' ')
  const headLead = title.slice(0, cut + 1)
  const headLede = title.slice(cut + 1)

  return (
    <section id="services" className="section svid">
      <div className="container">
        <motion.h2 className="avh2 display svid__h" {...inView}>
          {headLead}<em className="avlede">{headLede}</em>
        </motion.h2>

        <motion.div className="vacc" role="tablist" aria-label="Services" {...inView}>
          {SERVICES.map((s, i) => {
            const on = active === i
            return (
              <article
                key={s.id}
                className={`vrow${on ? ' is-open' : ''}`}
                role="tab"
                aria-selected={on}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <Bg s={s} />

                {/* collapsed label — icon only, no title (revealed on expand) */}
                <div className="vrow__tab">
                  <span className="vrow__ticon"><Icon i={i} /></span>
                </div>

                {/* expanded copy — right half */}
                <div className="vrow__panel">
                  <span className="vrow__idx">{s.index}</span>
                  <h3 className="vrow__title">{s.title}</h3>
                  <p className="vrow__blurb">{s.blurb}</p>
                  <div className="vrow__proof">
                    <b>{s.proof.value}</b> {s.proof.label}
                  </div>
                  <a href="#contact" className="vrow__cta">
                    {s.cta} <span className="arrow">→</span>
                  </a>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

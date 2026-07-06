import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { Icon, sectionInView } from './serviceMeta'

/* SPLIT — half accordion (left), half video (right).
   Opening / hovering a service on the left swaps the video on the right.
   Drop real per-service clips into VIDEOS below (keyed by service id) and the
   placeholder is replaced automatically. */
const VIDEOS = {
  consulting: '/videos/consulting.mp4',
  product:    '/videos/product.mp4',
  ai:         '/videos/ai.mp4',
  cloud:      '/videos/cloud.mp4',
}

/* per-service playback speed (default 1x) — the consulting clip plays at half speed */
const SPEEDS = {
  consulting: 0.5,
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
    <path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" />
  </svg>
)

/* just the swapping content — video or placeholder, no frame */
function MediaInner({ s }) {
  const src = VIDEOS[s.id]
  const rate = SPEEDS[s.id] ?? 1
  return src ? (
    <video
      className="split__vid"
      src={src}
      autoPlay muted loop playsInline
      ref={(el) => { if (el) el.playbackRate = rate }}
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate }}
    />
  ) : (
    <div className="split__ph">
      <span className="split__phplay"><PlayIcon /></span>
    </div>
  )
}

/* full frame — used inline on mobile where there's no sticky panel */
function Media({ s }) {
  return (
    <div className="split__frame">
      <MediaInner s={s} />
    </div>
  )
}

export default function ServiceSplit() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]

  /* split the heading so the last word ("Transformation.") renders italic,
     mirroring the hero's italic lede */
  const title = AV_TRANSFORMATION.title
  const cut = title.lastIndexOf(' ')
  const headLead = title.slice(0, cut + 1)
  const headLede = title.slice(cut + 1)

  return (
    <section id="services" className="section avservices">
      <div className="container">
        <motion.h2 className="avh2 display" {...sectionInView}>
          {headLead}<em className="avlede">{headLede}</em>
        </motion.h2>

        <div className="avservices__box">
        <div className="split">
          <div className="split__list" role="tablist" aria-label="Services">
            {SERVICES.map((row, i) => {
              const on = active === i
              return (
                <article
                  key={row.id}
                  className={`splitrow${on ? ' is-active' : ''}`}
                  role="tab"
                  aria-selected={on}
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <div className="splitrow__head">
                    <span className="splitrow__idx">{row.index}</span>
                    <span className="splitrow__icon"><Icon i={i} /></span>
                    <h3 className="splitrow__title">{row.title}</h3>
                    <span className="splitrow__chev" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  <div className="splitrow__bodywrap">
                    <div className="splitrow__body">
                      <div className="splitrow__inner">
                        <p className="splitrow__blurb">{row.blurb}</p>
                        {/* inline media — shown on mobile only */}
                        <div className="splitrow__media"><Media s={row} /></div>
                        <div className="splitrow__proof">
                          <b>{row.proof.value}</b> {row.proof.label}
                        </div>
                        <a href="#contact" className="splitrow__cta">
                          {row.cta} <span className="arrow">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="split__media">
            <div className="split__sticky">
              {/* frame stays fixed in place — only the inner video content crossfades */}
              <div className="split__frame">
                <AnimatePresence>
                  <motion.div
                    key={s.id}
                    className="split__layer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MediaInner s={s} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

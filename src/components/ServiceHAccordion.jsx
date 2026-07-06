import { useEffect, useMemo, useRef, useState } from 'react'
import { SERVICES, AV_TRANSFORMATION } from '../data'
import { asset } from '../asset'

/* =========================================================================
   SERVICE HORIZONTAL ACCORDION (mockup)
   Panels sit side by side. Collapsed panels are narrow video slivers with a
   single icon badge and their video PAUSED. Hovering one expands it to a wide
   panel whose video plays (at 0.3x) behind a bottom-left caption.
   ========================================================================= */

const VIDEOS = {
  consulting: asset('/videos/consulting.mp4'),
  product:    asset('/videos/product.mp4'),
  ai:         asset('/videos/ai.mp4'),
  cloud:      asset('/videos/cloud.mp4'),
}
const SPEED = 0.6 // all videos play at 0.6x — slow-cinematic but clearly moving

/* needs-router: business-goal chips (the buyer's language) → the service
   line(s) that own each goal. Picking goals opens the best-fit panel and
   surfaces a tailored proof callout. Manual hover/click still works. */
const GOALS = [
  { id: 'strategy', label: 'Set our tech strategy', maps: ['consulting'] },
  { id: 'buildscale', label: 'Build or scale a product', maps: ['product'] },
  { id: 'legacy', label: 'Modernize legacy systems', maps: ['product', 'cloud'] },
  { id: 'ai', label: 'Adopt AI & automation', maps: ['ai'] },
  { id: 'data', label: 'Activate our data', maps: ['ai'] },
  { id: 'cloud', label: 'Migrate to the cloud', maps: ['cloud'] },
  { id: 'security', label: 'Strengthen security & compliance', maps: ['cloud'] },
]

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

/* video plays only when its panel is open; paused (and rewound) otherwise */
function Bg({ s, playing }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.playbackRate = SPEED
    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [playing])
  return (
    <video
      ref={ref}
      className="hpanel__bg"
      src={VIDEOS[s.id]}
      muted loop playsInline
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        v.playbackRate = SPEED
        /* decode a frame so paused slivers show a clean poster, not a blank */
        if (v.paused && v.currentTime === 0) { try { v.currentTime = 0.1 } catch { /* ignore */ } }
      }}
    />
  )
}

export default function ServiceHAccordion() {
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState([]) // selected goal ids
  const hasPicked = picked.length > 0
  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const clear = () => setPicked([])

  /* score each service by how many picked goals route to it; the top score is
     the best fit, which becomes the expanded panel */
  const scored = useMemo(() => {
    const score = {}
    SERVICES.forEach((s) => { score[s.id] = 0 })
    picked.forEach((gid) => {
      const g = GOALS.find((x) => x.id === gid)
      g?.maps.forEach((sid) => { score[sid] = (score[sid] || 0) + 1 })
    })
    return { score, max: Math.max(0, ...Object.values(score)) }
  }, [picked])

  const bestFitIndex = hasPicked && scored.max > 0
    ? SERVICES.findIndex((s) => scored.score[s.id] === scored.max)
    : -1

  /* open the best-fit panel whenever the selection resolves to one */
  useEffect(() => {
    if (bestFitIndex >= 0) setActive(bestFitIndex)
  }, [bestFitIndex])

  const title = AV_TRANSFORMATION.title
  const cut = title.lastIndexOf(' ')
  const headLead = title.slice(0, cut + 1)
  const headLede = title.slice(cut + 1)

  return (
    <section id="services" className="section svid">
      <div className="container">
        <h2 className="avh2 display svid__h">
          {headLead}<em className="avlede">{headLede}</em>
        </h2>

        <p className="svid__prompt">
          Where are you headed? Pick your goals — we&rsquo;ll point you to the right team and the proof.
        </p>

        {/* needs-router chips — picking goals opens the best-fit panel below */}
        <div className="svid__chips" role="group" aria-label="Your goals">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`svid__chip${picked.includes(g.id) ? ' is-on' : ''}`}
              aria-pressed={picked.includes(g.id)}
              onClick={() => toggle(g.id)}
            >
              {g.label}
            </button>
          ))}
          {hasPicked && (
            <button type="button" className="svid__clear" onClick={clear}>
              Clear
            </button>
          )}
        </div>

        <div className="hacc">
          {SERVICES.map((s, i) => {
            const on = active === i
            const isBest = hasPicked && i === bestFitIndex
            const isRel = hasPicked && scored.score[s.id] > 0 && !isBest
            return (
              <article
                key={s.id}
                className={`hpanel${on ? ' is-open' : ''}${isBest ? ' is-bestfit' : ''}${isRel ? ' is-relfit' : ''}`}
                role="tab"
                aria-selected={on}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <Bg s={s} playing={on} />
                <div className="hpanel__scrim" />

                {/* match badge — driven by the goal chips above */}
                {(isBest || isRel) && (
                  <span className={`hpanel__badge ${isBest ? 'is-best' : 'is-rel'}`}>
                    {isBest ? 'Best fit' : 'Relevant'}
                  </span>
                )}

                {/* collapsed marker — short category label + icon along the bottom.
                    The full title lives in the tab and the expanded panel; the sliver
                    only carries a short word so it stays readable rotated. */}
                <span className="hpanel__label" aria-hidden="true">
                  <i className="hpanel__labelidx">{s.index}</i>{s.short}
                </span>
                <span className="hpanel__icon"><Icon i={i} /></span>

                {/* expanded content — plain panel on the right, video on the left */}
                <div className="hpanel__cap">
                  <div className="hpanel__capinner">
                    <span className="hpanel__capicon"><Icon i={i} /></span>
                    <h3 className="hpanel__title">{s.title}</h3>
                    <p className="hpanel__sub">{s.blurb}</p>
                    <div className="hpanel__proof">
                      <b>{s.proof.value}</b> {s.proof.label}
                    </div>
                    <a href="#contact" className="hpanel__cta">
                      {s.cta} <span className="arrow">→</span>
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

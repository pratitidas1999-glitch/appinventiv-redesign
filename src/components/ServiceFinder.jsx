import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SERVICES } from '../data'
import './ServiceFinder.css'

/* =========================================================================
   SERVICE FINDER (prototype)
   A router, not a quiz. Enterprise buyers usually know their initiative but
   not our taxonomy — so we phrase the chips as BUSINESS GOALS (their words)
   and map each to the service line(s) that own it. Picking goals re-ranks the
   four cards, badges the best fit, and surfaces the matching client proof +
   a tailored CTA. Default state shows all four equally (works if ignored).
   ========================================================================= */

/* goal (user's language) → service id(s) it routes to */
const GOALS = [
  { id: 'strategy', label: 'Set our tech strategy', maps: ['consulting'] },
  { id: 'buildscale', label: 'Build or scale a product', maps: ['product'] },
  { id: 'legacy', label: 'Modernize legacy systems', maps: ['product', 'cloud'] },
  { id: 'ai', label: 'Adopt AI & automation', maps: ['ai'] },
  { id: 'data', label: 'Activate our data', maps: ['ai'] },
  { id: 'cloud', label: 'Migrate to the cloud', maps: ['cloud'] },
  { id: 'security', label: 'Strengthen security & compliance', maps: ['cloud'] },
]

const ICONS = {
  consulting: <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" /></>,
  product: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
  ai: <><path d="M4 20V10M9.5 20V4M15 20v-7M20.5 20V8" /></>,
  cloud: <><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
}

function Icon({ id }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[id]}
    </svg>
  )
}

export default function ServiceFinder() {
  const [picked, setPicked] = useState([]) // goal ids

  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const clear = () => setPicked([])
  const active = picked.length > 0

  /* score every service by how many picked goals route to it, then order
     matches first (stable within equal scores) */
  const scored = useMemo(() => {
    const score = {}
    SERVICES.forEach((s) => { score[s.id] = 0 })
    picked.forEach((gid) => {
      const g = GOALS.find((x) => x.id === gid)
      g?.maps.forEach((sid) => { score[sid] = (score[sid] || 0) + 1 })
    })
    const max = Math.max(0, ...Object.values(score))
    const ordered = SERVICES.map((s, i) => ({ s, i }))
      .sort((a, b) => (score[b.s.id] - score[a.s.id]) || (a.i - b.i))
      .map((x) => x.s)
    return { score, max, ordered }
  }, [picked])

  const bestFit = active && scored.max > 0
    ? scored.ordered.find((s) => scored.score[s.id] === scored.max)
    : null

  return (
    <section id="services" className="section finder">
      <div className="container">
        <span className="finder__eyebrow">What we do</span>
        <h2 className="finder__h display">
          Beyond Development. We Deliver <em className="finder__lede">Transformation.</em>
        </h2>
        <p className="finder__prompt">
          Where are you headed? Pick your goals — we&rsquo;ll point you to the right team and the proof.
        </p>

        {/* goal chips */}
        <div className="finder__chips" role="group" aria-label="Your goals">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`finder__chip${picked.includes(g.id) ? ' is-on' : ''}`}
              aria-pressed={picked.includes(g.id)}
              onClick={() => toggle(g.id)}
            >
              {g.label}
            </button>
          ))}
          <AnimatePresence>
            {active && (
              <motion.button
                key="clear"
                type="button"
                className="finder__clear"
                onClick={clear}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* tailored best-fit callout */}
        <AnimatePresence mode="wait">
          {bestFit && (
            <motion.div
              key={bestFit.id}
              className="finder__result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="finder__result-ey">Best fit</span>
              <p className="finder__result-line">
                Start with <b>{bestFit.title}</b> —{' '}
                <span className="finder__result-proof"><b>{bestFit.proof.value}</b> {bestFit.proof.label}</span>.
              </p>
              <a href="#contact" className="finder__result-cta">
                Book a strategy consult <span className="arrow">→</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* service cards — re-rank + highlight on selection */}
        <div className="finder__grid">
          {scored.ordered.map((s) => {
            const on = scored.score[s.id] > 0
            const best = bestFit && bestFit.id === s.id
            const dim = active && !on
            return (
              <motion.article
                layout
                key={s.id}
                className={`fcard${best ? ' is-best' : ''}${on && !best ? ' is-match' : ''}${dim ? ' is-dim' : ''}`}
                transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              >
                {best && <span className="fcard__badge">Best fit</span>}
                {on && !best && <span className="fcard__badge fcard__badge--soft">Relevant</span>}
                <div className="fcard__top">
                  <span className="fcard__icon"><Icon id={s.id} /></span>
                  <span className="fcard__idx">{s.index}</span>
                </div>
                <h3 className="fcard__title">{s.title}</h3>
                <p className="fcard__blurb">{s.blurb}</p>
                <div className="fcard__proof"><b>{s.proof.value}</b> {s.proof.label}</div>
                <a href="#contact" className="fcard__cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

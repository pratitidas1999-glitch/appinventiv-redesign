import { motion } from 'framer-motion'
import Counter from './Counter'
import { AV_AWARD_WALL } from '../data'
import { asset } from '../asset'

/* =========================================================================
   AWARDS SHOWCASE — "Hall of Recognition".
   A dark ceremony stage right after the light hero: the real award artwork
   rides a single-line marquee that drifts across the charcoal band, each tile
   lifting into a rust glow on hover (which also pauses the belt). The colour
   comes entirely from the award graphics; the frame stays dark so they read
   like lit exhibits. The belt is doubled so the loop is seamless.
   ========================================================================= */

export default function AwardsShowcase() {
  const items = AV_AWARD_WALL
  const belt = [...items, ...items]
  return (
    <section id="awards" className="awards">
      <div className="awards__spotlight" aria-hidden="true" />
      <div className="awards__grain" aria-hidden="true" />

      <div className="container awards__inner">
        <motion.header
          className="awards__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="awards__eyebrow">Recognition</span>
          <h2 className="awards__title display">
            Proven Expertise. <em>Globally Accredited.</em>
          </h2>
          <div className="awards__count">
            <span className="awards__count-num">
              <Counter value={15} suffix="+" />
            </span>
            <span className="awards__count-label">global awards &amp; honours, and counting</span>
          </div>
        </motion.header>
      </div>

      {/* full-bleed single-line marquee of the award artwork */}
      <div className="awards__marquee">
        <div className="awards__belt">
          {belt.map((it, i) => (
            <figure className="awardtile" key={i} aria-hidden={i >= items.length ? true : undefined}>
              <img
                src={asset(it.img)}
                alt={i < items.length ? `${it.org} — ${it.title}` : ''}
                draggable="false"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

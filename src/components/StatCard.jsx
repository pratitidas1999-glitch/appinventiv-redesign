import { forwardRef } from 'react'
import Counter from './Counter'
import cornerRaw from '../assets/border-design.svg?raw'
import flourishRaw from '../assets/frame.svg?raw'

/* tarot panels — three grounds: purple, charcoal, and a cool beige-grey.
   Shared by the desktop wheel (CursorShowreel) and the mobile marquees
   (StatMarquee) so a stat card looks identical wherever it appears. */
export const PANELS = [
  { bg: '#5334c7', fg: '#ffffff', label: 'rgba(255,255,255,0.82)', frame: 'rgba(255,255,255,0.5)', media: 'rgba(255,255,255,0.12)' },
  { bg: '#221f28', fg: '#f4f2f7', label: 'rgba(255,255,255,0.75)', frame: 'rgba(255,255,255,0.48)', media: 'rgba(255,255,255,0.07)' },
  { bg: '#f1f1f4', fg: '#201f26', label: 'rgba(32,31,38,0.6)', frame: 'rgba(219,94,43,0.8)', media: 'rgba(32,31,38,0.05)' },
  { bg: '#3d2597', fg: '#ffffff', label: 'rgba(255,255,255,0.8)', frame: 'rgba(255,255,255,0.5)', media: 'rgba(255,255,255,0.1)' },
  { bg: '#221f28', fg: '#f4f2f7', label: 'rgba(255,255,255,0.75)', frame: 'rgba(255,255,255,0.48)', media: 'rgba(255,255,255,0.07)' },
]

/* one stat tile. forwardRef so the wheel can drive it per-frame via rAF; the
   marquee just renders it in normal flow. */
const StatCard = forwardRef(function StatCard({ s, panel }, ref) {
  return (
    <article ref={ref} className="stackcard">
      <div className="stackcard__surface" style={{ background: panel.bg }}>
        <div
          className="stackcard__media"
          style={{ background: `color-mix(in srgb, ${panel.bg} 10%, #ffffff)` }}
        >
          <img className="stackcard__icon" src={s.icon} alt="" draggable="false" />
        </div>
        <div className="stackcard__stats">
          {['tr', 'br'].map((pos) => (
            <span
              key={pos}
              className={`stackcard__corner stackcard__corner--${pos}`}
              style={{ color: panel.frame }}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: cornerRaw }}
            />
          ))}
          <header className="stackcard__head">
            <span className="stackcard__figure" style={{ color: panel.fg }}>
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="stackcard__label" style={{ color: panel.label }}>
              {s.label}
            </span>
          </header>
          <span
            className="stackcard__flourish"
            style={{ color: panel.frame }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: flourishRaw }}
          />
        </div>
        <span className="stackcard__sheen" aria-hidden="true" />
      </div>
    </article>
  )
})

export default StatCard

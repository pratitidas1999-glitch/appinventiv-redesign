import StatCard, { PANELS } from './StatCard'

/* Mobile-only horizontal marquee of stat cards. Used twice in the pastel hero:
   a 2-card strip above the heading and a 3-card strip below the copy. The belt
   is doubled so a translateX(-50%) loop is seamless. Full-bleed, no edge fade —
   the CSS lives in App.css under `.stackreel--marquee`. */
export default function StatMarquee({ stats, panelOffset = 0, duration = 26, className = '' }) {
  const belt = [...stats, ...stats]
  return (
    <div
      className={`stackreel stackreel--marquee ${className}`}
      aria-hidden="true"
      style={{ '--marquee-dur': `${duration}s` }}
    >
      <div className="stackreel__belt">
        {belt.map((s, i) => (
          <StatCard
            key={`${s.label}-${i}`}
            s={s}
            panel={PANELS[(panelOffset + (i % stats.length)) % PANELS.length]}
          />
        ))}
      </div>
    </div>
  )
}

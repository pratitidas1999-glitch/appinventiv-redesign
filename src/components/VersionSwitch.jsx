import { useTheme } from '../ThemeContext'

/* Floating v1 / v2 hero switch — lets a reviewer flip between the saved
   original and the fixed version on the same page. */
const OPTIONS = [
  { id: 'pastel', label: 'v1', desc: 'Original' },
  { id: 'pastel2', label: 'v2', desc: 'Fixed' },
]

export default function VersionSwitch() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="vswitch" role="radiogroup" aria-label="Hero version">
      <span className="vswitch__cap">Hero</span>
      <div className="vswitch__seg">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={theme === o.id}
            className={`vswitch__btn${theme === o.id ? ' is-active' : ''}`}
            onClick={() => setTheme(o.id)}
          >
            <span className="vswitch__label">{o.label}</span>
            <span className="vswitch__desc">{o.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

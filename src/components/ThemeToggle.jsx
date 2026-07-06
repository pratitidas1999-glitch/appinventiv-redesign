import { useTheme } from '../ThemeContext'

const LABELS = {
  pixel: { name: 'Pixel', desc: '16-bit meadow' },
  voxel: { name: 'Voxel', desc: 'Isometric world' },
}

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()
  return (
    <div className="toggle" role="radiogroup" aria-label="Design direction">
      <span className="toggle__cap">Design direction — pick one</span>
      <div className="toggle__seg">
        {themes.map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={theme === t}
            className={`toggle__btn${theme === t ? ' is-active' : ''}`}
            onClick={() => setTheme(t)}
          >
            <span className="toggle__name">{LABELS[t].name}</span>
            <span className="toggle__desc">{LABELS[t].desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

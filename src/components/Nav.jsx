import { useEffect, useState } from 'react'

/* the desktop sections — the first six carry a dropdown caret */
const NAV_LINKS = [
  { label: 'InventivAI', href: '#ai', caret: true },
  { label: 'About', href: '#about', caret: true },
  { label: 'Services', href: '#services', caret: true },
  { label: 'Industries', href: '#industries', caret: true },
  { label: 'Portfolio', href: '#work', caret: true },
  { label: 'Resources', href: '#resources', caret: true },
  { label: 'Explore Appinventiv Digital', href: '#explore', caret: false },
]

function Caret() {
  return (
    <svg className="nav__caret" width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Phone() {
  return (
    <svg className="nav__phone" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

/* Minimal, theme-adaptive nav. On mobile the links collapse behind a hamburger
   toggle that drops a panel under the pill. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container nav__inner">
        <a className="nav__logo" href="#top" onClick={close}>
          appinventiv<span className="nav__mark">/</span>
        </a>
        <nav className="nav__links" id="nav-menu">
          {NAV_LINKS.map((l) => (
            <a href={l.href} key={l.label} onClick={close}>
              {l.label}{l.caret && <Caret />}
            </a>
          ))}
          {/* CTA inside the dropdown on mobile only (hidden on desktop) */}
          <a href="#contact" className="btn btn-primary nav__menu-cta" onClick={close}>
            <Phone /> Contact Us
          </a>
        </nav>
        <a href="#contact" className="btn btn-primary nav__cta" onClick={close}>
          <Phone /> Contact Us
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

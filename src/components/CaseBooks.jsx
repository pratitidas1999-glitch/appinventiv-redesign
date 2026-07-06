import { useEffect, useRef, useState } from 'react'
import { AV_CASES } from '../data'
import { asset } from '../asset'

/* =========================================================================
   CASE BOOKS — premium saturated hardcovers (brand purple / rust / plum),
   shown three at a time in a slider. Prev/next arrows below slide through the
   rest. Each cover carries an editorial meta row, the client logo + name, a
   one-line brief and two proof stats; on hover a book lifts and its cover
   swings open on the left spine.
   ========================================================================= */

const VISIBLE = 3

/* monogram stand-in until real client logos are dropped in */
function initials(name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

/* pick legible ink for a given cover colour from its perceived luminance, so
   any brand hex (light or dark) stays readable without hand-tuning */
function inkFor(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return L > 0.6 ? '#161514' : '#fdfbf5'
}

function Book({ c }) {
  const ink = inkFor(c.color)
  return (
    <article className="cbook">
      <div className="cbook__stage">
        <div className="cbook__lift">
          {/* inside page revealed as the cover opens */}
          <div className="cbook__page">
            <span className="cbook__page-eyebrow">{c.client}</span>
            <span className="cbook__page-read">Read case study →</span>
          </div>

          {/* front cover — the CLIENT's brand colour, swings open on the spine */}
          <div
            className="cbook__cover"
            style={{ '--paper': c.color, '--coverink': ink }}
          >
            <div className="cbook__cover-face">
              {/* darker band down the left edge = the bound fold */}
              <span className="cbook__fold" aria-hidden="true" />

              {/* title — the client name */}
              <h3 className="cbook__title">{c.client}</h3>

              <span className="cbook__rule" aria-hidden="true" />

              {/* body — the one-line brief */}
              <p className="cbook__body">{c.text}</p>

              {/* framed image — the client artwork, contained inside the plate */}
              <div className="cbook__plate">
                {c.image
                  ? <img className="cbook__plate-img" src={asset(c.image)} alt="" />
                  : <span className="cbook__plate-mono">{initials(c.client)}</span>}
              </div>

              {/* proof stats — or a one-line project descriptor when a case
                  has no published metrics (no invented numbers) */}
              {c.stats ? (
                <div className="cbook__stats">
                  {c.stats.map((s) => (
                    <div className="cbook__stat" key={s.label}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="cbook__note">{c.note}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'prev' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  )
}

export default function CaseBooks() {
  const items = AV_CASES.items
  const maxIndex = Math.max(0, items.length - VISIBLE)
  const [index, setIndex] = useState(0)
  const viewportRef = useRef(null)

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches

  /* one step in a direction: mobile scrolls the native strip by a book,
     desktop steps the transform track */
  const nudge = (dir) => {
    if (isMobile()) {
      const vp = viewportRef.current
      const book = vp?.querySelector('.cbook')
      const step = book ? book.offsetWidth + 24 : (vp?.clientWidth ?? 0) * 0.8
      vp?.scrollBy({ left: dir * step, behavior: 'smooth' })
    } else {
      setIndex((v) => Math.min(maxIndex, Math.max(0, v + dir)))
    }
  }

  /* idle "peek" (touch layouts): the centred book jumps open, holds a beat,
     then settles back onto the rack. Runs on a keyframe animation so it always
     returns to rest — any interaction pauses it and it resumes once idle. */
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    if (!isMobile()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const PEEK_MS = 2300
    let cycle, resume, hold
    const clearPeek = () =>
      vp.querySelectorAll('.cbook.is-peeking').forEach((el) => el.classList.remove('is-peeking'))
    /* run the jump-open-settle animation on one book, then let it come home */
    const peekBook = (b) => {
      if (!b) return
      clearPeek()
      clearTimeout(hold)
      b.classList.add('is-peeking')
      hold = setTimeout(() => b.classList.remove('is-peeking'), PEEK_MS)
    }
    const centeredBook = () => {
      const books = [...vp.querySelectorAll('.cbook')]
      if (!books.length) return null
      const mid = vp.scrollLeft + vp.clientWidth / 2
      let best = null
      let bestD = Infinity
      for (const b of books) {
        const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid)
        if (d < bestD) { bestD = d; best = b }
      }
      return best
    }
    const startIdle = () => { clearInterval(cycle); cycle = setInterval(() => peekBook(centeredBook()), 4200) }
    const stopIdle = () => { clearInterval(cycle); clearTimeout(hold); clearPeek() }
    const onInteract = () => {
      stopIdle()
      clearTimeout(resume)
      resume = setTimeout(startIdle, 2600)
    }
    /* press a book → it peeks too. A real scroll/swipe fires no click, so a
       drag through the strip won't trigger it — only a genuine tap. */
    const onTap = (e) => peekBook(e.target.closest('.cbook'))

    vp.addEventListener('scroll', onInteract, { passive: true })
    vp.addEventListener('pointerdown', onInteract)
    vp.addEventListener('click', onTap)
    startIdle()
    return () => {
      stopIdle()
      clearTimeout(resume)
      vp.removeEventListener('scroll', onInteract)
      vp.removeEventListener('pointerdown', onInteract)
      vp.removeEventListener('click', onTap)
    }
  }, [])

  return (
    <div className="cbooks">
      <div className="cbooks__viewport" ref={viewportRef}>
        <div className="cbooks__track" style={{ '--i': index }}>
          {items.map((c, i) => (
            <Book c={c} i={i} key={c.client} />
          ))}
        </div>
      </div>

      {/* side arrows — flank the books; the primary control on touch */}
      <button
        type="button" className="cbooks__side cbooks__side--prev"
        onClick={() => nudge(-1)} aria-label="Previous case study"
      >
        <Arrow dir="prev" />
      </button>
      <button
        type="button" className="cbooks__side cbooks__side--next"
        onClick={() => nudge(1)} aria-label="Next case study"
      >
        <Arrow dir="next" />
      </button>

      {/* wooden rack the books rest on */}
      <div className="cbooks__shelf" aria-hidden="true" />

      {/* prev / next below the shelf (desktop) */}
      <div className="cbooks__nav">
        <button
          type="button" className="cbooks__arrow"
          onClick={() => setIndex((v) => Math.max(0, v - VISIBLE))}
          disabled={index === 0} aria-label="Previous case studies"
        >
          <Arrow dir="prev" />
        </button>
        <button
          type="button" className="cbooks__arrow"
          onClick={() => setIndex((v) => Math.min(maxIndex, v + VISIBLE))}
          disabled={index === maxIndex} aria-label="Next case studies"
        >
          <Arrow dir="next" />
        </button>
      </div>
    </div>
  )
}

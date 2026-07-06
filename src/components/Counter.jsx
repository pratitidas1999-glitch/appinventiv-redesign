import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/* Counts up from 0 to `value` the first time it scrolls into view. */
export default function Counter({ value, prefix = '', suffix = '', duration = 1700 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="figure">
      {prefix}
      {Math.round(display).toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

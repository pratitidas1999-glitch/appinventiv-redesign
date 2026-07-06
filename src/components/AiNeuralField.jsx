import { useEffect, useRef } from 'react'

/* =========================================================================
   AI NEURAL FIELD — a cursor-reactive canvas.
   Abstract nodes drift on a dark field, linking to neighbours by proximity;
   signal pulses (rust / purple) travel the edges. The pointer lights links to
   nearby nodes, nudges them, and casts a warm glow. Purely aesthetic — it
   depicts "an intelligent system" and asserts no data. Respects reduced-motion.
   ========================================================================= */
export default function AiNeuralField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    let nodes = [], signals = []
    const mouse = { x: -9999, y: -9999, on: false }
    const TAU = Math.PI * 2
    const linkDist = () => Math.min(200, Math.max(128, w / 8.5))

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(64, Math.max(24, (w * h) / 21000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() < 0.16 ? 2.6 : 1.5, hot: Math.random() < 0.15,
      }))
      signals = []
    }

    const spawn = () => {
      if (nodes.length < 2) return
      const i = (Math.random() * nodes.length) | 0
      let best = -1, bd = Infinity
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = dx * dx + dy * dy
        if (d < bd) { bd = d; best = j }
      }
      if (best >= 0) signals.push({ a: i, b: best, t: 0, s: 0.006 + Math.random() * 0.012, rust: Math.random() < 0.5 })
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      const ld2 = linkDist() ** 2

      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy
        if (p.x <= 0 || p.x >= w) p.vx *= -1
        if (p.y <= 0 || p.y >= h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y))
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy, R = 140
          if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * 0.8; p.x += dx / d * f; p.y += dy / d * f }
        }
      }

      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy
          if (d2 < ld2) {
            ctx.strokeStyle = `rgba(255,255,255,${((1 - d2 / ld2) * 0.15).toFixed(3)})`
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }

      if (mouse.on) {
        const R = 180
        for (const p of nodes) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            ctx.strokeStyle = `rgba(214,96,46,${((1 - Math.sqrt(d2) / R) * 0.55).toFixed(3)})`
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
          }
        }
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 130)
        g.addColorStop(0, 'rgba(214,96,46,0.12)'); g.addColorStop(1, 'rgba(214,96,46,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 130, 0, TAU); ctx.fill()
      }

      for (const s of signals) {
        s.t += s.s
        const a = nodes[s.a], b = nodes[s.b]
        if (!a || !b) continue
        const x = a.x + (b.x - a.x) * s.t, y = a.y + (b.y - a.y) * s.t
        const c = s.rust ? '224,112,58' : '124,92,255'
        const g = ctx.createRadialGradient(x, y, 0, x, y, 5.5)
        g.addColorStop(0, `rgba(${c},0.95)`); g.addColorStop(1, `rgba(${c},0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 5.5, 0, TAU); ctx.fill()
      }
      signals = signals.filter((s) => s.t <= 1 && nodes[s.a] && nodes[s.b])
      while (signals.length < 7) spawn()

      for (const p of nodes) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU)
        ctx.fillStyle = p.hot ? 'rgba(224,112,58,0.9)' : 'rgba(255,255,255,0.5)'
        ctx.fill()
      }
    }

    const loop = () => { render(); raf = requestAnimationFrame(loop) }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      mouse.on = x >= 0 && y >= 0 && x <= r.width && y <= r.height
      mouse.x = x; mouse.y = y
    }

    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    if (reduced) render()
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="ai__canvas" aria-hidden="true" />
}

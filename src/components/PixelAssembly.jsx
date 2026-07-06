import { useEffect, useRef } from 'react'

/* =========================================================================
   PIXEL ASSEMBLY — chaos → order, performed.
   Scattered pixels tumble in and snap into a clean app window built
   entirely from blocks: chrome, sidebar, copy bars, a chart, a yellow
   CTA. Loose pixels keep drifting; they avoid the cursor. Click to
   scatter everything and watch it re-engineer itself.
   ========================================================================= */

const COLS = 40
const ROWS = 30

const C = {
  chrome: '#f1ede2',
  white: '#ffffff',
  side: '#f6f2e9',
  ink: '#17161a',
  grey: '#d9d5df',
  greyDark: '#c7c2cf',
  greyLight: '#e4e0ea',
  faint: '#efedf3',
  purple: '#6c4ce0',
  lav: '#bfb2ee',
  lavSoft: '#e6dffa',
  yellow: '#ffd84d',
  yellowSoft: '#ffefaf',
}

function buildGrid() {
  const map = new Map()
  const set = (col, row, color, special) => map.set(`${col},${row}`, { color, special })
  const block = (c0, r0, c1, r1, color, special) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) set(c, r, color, special)
  }

  /* base: 2-row chrome, 9-col sidebar, white canvas */
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      set(col, row, row < 2 ? C.chrome : col < 9 ? C.side : C.white)
    }
  }

  /* ---- browser chrome: traffic dots + URL bar ---- */
  set(2, 1, C.yellow)
  set(4, 1, C.lav)
  set(6, 1, C.purple)
  block(12, 1, 28, 1, C.greyLight)
  set(13, 1, C.greyDark) /* padlock */

  /* ---- sidebar: logo, nav (one active), avatar ---- */
  block(2, 3, 3, 4, C.purple) /* logomark */
  block(5, 3, 7, 3, C.greyDark)
  set(2, 7, C.purple)
  block(4, 7, 7, 7, C.ink) /* active item */
  for (const r of [9, 11, 13]) {
    set(2, r, C.greyDark)
    block(4, r, 6, r, C.grey)
  }
  set(2, 15, C.greyDark)
  block(4, 15, 7, 15, C.grey)
  set(2, 27, C.yellow) /* avatar */
  block(4, 27, 6, 27, C.grey)

  /* ---- page header: title, subtitle, actions ---- */
  block(11, 3, 21, 3, C.ink)
  block(11, 4, 16, 4, C.grey)
  block(29, 3, 31, 4, C.greyLight) /* secondary btn */
  block(33, 3, 37, 4, C.purple) /* primary btn */

  /* ---- three stat cards ---- */
  block(11, 7, 19, 10, C.lavSoft)
  block(12, 8, 14, 8, C.ink)
  block(12, 9, 16, 9, C.greyDark)
  set(18, 8, C.purple)
  block(21, 7, 29, 10, C.yellowSoft)
  block(22, 8, 24, 8, C.ink)
  block(22, 9, 26, 9, C.greyDark)
  set(28, 8, C.yellow)
  block(31, 7, 38, 10, C.faint)
  block(32, 8, 34, 8, C.ink)
  block(32, 9, 36, 9, C.greyDark)
  set(37, 8, C.lav)

  /* ---- area line chart with gridlines (cols 11–27, rows 13–21) ---- */
  for (const r of [14, 17, 20]) {
    for (let c = 11; c <= 27; c += 2) set(c, r, C.faint)
  }
  const series = [1, 2, 2, 3, 2, 3, 4, 4, 5, 4, 5, 6, 6, 7, 6, 7, 8]
  series.forEach((hgt, i) => {
    const c = 11 + i
    const top = 21 - hgt
    set(c, top, C.purple)
    for (let r = top + 1; r <= 21; r++) set(c, r, C.lavSoft)
  })
  set(27, 13, C.yellow, 'blink') /* live endpoint */

  /* ---- bar chart (cols 29–38, rows 13–21) ---- */
  const bars = [3, 5, 4, 6, 5, 7, 6, 8, 7, 9]
  const barCols = [C.lav, C.purple, C.yellow]
  bars.forEach((hgt, i) => {
    const c = 29 + i
    for (let k = 0; k < hgt; k++) set(c, 21 - k, barCols[i % 3])
  })

  /* ---- data table: header + two rows ---- */
  block(11, 24, 38, 24, C.greyLight)
  set(11, 26, C.lav) /* avatar */
  block(13, 26, 24, 26, C.grey)
  block(26, 26, 31, 26, C.grey)
  set(36, 26, C.purple) /* status */
  set(11, 28, C.yellow)
  block(13, 28, 22, 28, C.grey)
  block(26, 28, 30, 28, C.grey)
  set(36, 28, C.yellow)

  const cells = []
  for (const [key, v] of map) {
    const [col, row] = key.split(',').map(Number)
    cells.push({ col, row, color: v.color, special: v.special })
  }
  return cells
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/* extrusion: colored pixels rise off the plane as little blocks */
const DARK = {
  [C.ink]: '#08080a',
  [C.purple]: '#4a32a8',
  [C.lav]: '#9487c9',
  [C.yellow]: '#d9ad2a',
  [C.grey]: '#b3aec0',
  [C.greyDark]: '#a29cb0',
}
const LIFT = {
  [C.ink]: 3,
  [C.purple]: 4,
  [C.yellow]: 4,
  [C.lav]: 3,
  [C.greyDark]: 2,
}

export default function PixelAssembly() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const cells = buildGrid()

    let w = 0
    let h = 0
    const resize = () => {
      w = wrap.clientWidth
      h = wrap.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    /* scatter: give every cell a wild start + staggered arrival */
    const scatter = (now, slow) => {
      for (const cell of cells) {
        cell.sxF = cell.col / COLS + (Math.random() - 0.5) * 1.9
        cell.syF = cell.row / ROWS + (Math.random() - 0.5) * 1.9
        cell.rot0 = (Math.random() - 0.5) * 4.5
        cell.delay = now + (slow ? 500 : 60) + cell.col * (slow ? 55 : 26) + Math.random() * (slow ? 700 : 380)
        cell.dur = (slow ? 950 : 700) + Math.random() * 350
      }
    }

    /* loose pixels that never settle — a handful, quiet */
    const strays = []
    for (let i = 0; i < 6; i++) {
      const depth = 0.5 + Math.random() /* 0.5 back … 1.5 front */
      strays.push({
        xF: Math.random(),
        yF: Math.random(),
        ph: Math.random() * 9,
        sp: 0.4 + Math.random() * 0.8,
        depth,
        size: (3 + Math.random() * 4) * depth,
        color: [C.purple, C.lav, C.yellow][i % 3],
      })
    }

    const mouse = { x: -999, y: -999 }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -999
      mouse.y = -999
    }
    const onClick = () => scatter(lastT, false)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('click', onClick)

    let lastT = 0
    let raf
    let started = false
    /* dramatic perspective: idle sway + cursor-driven tilt */
    const tilt = { rx: 9, ry: -16 }

    const frame = (t) => {
      lastT = t
      if (!started) {
        scatter(t, true)
        started = true
      }

      const hasMouse = mouse.x > -500
      const mxN = hasMouse ? (mouse.x / w - 0.5) * 2 : 0
      const myN = hasMouse ? (mouse.y / h - 0.5) * 2 : 0
      const ryTarget = hasMouse ? -7 + mxN * 3 : -7 + 1.2 * Math.sin(t * 0.0004)
      const rxTarget = hasMouse ? 4 - myN * 3 : 4 + Math.cos(t * 0.00047)
      tilt.ry += (ryTarget - tilt.ry) * 0.05
      tilt.rx += (rxTarget - tilt.rx) * 0.05
      wrap.style.transform = `perspective(1500px) rotateY(${tilt.ry.toFixed(2)}deg) rotateX(${tilt.rx.toFixed(2)}deg)`

      ctx.clearRect(0, 0, w, h)

      /* window geometry — right-weighted inside the square */
      const cSize = Math.floor(Math.min((w * 0.86) / COLS, (h * 0.72) / ROWS))
      const gw = cSize * COLS
      const gh = cSize * ROWS
      const ox = Math.round((w - gw) / 2 + w * 0.02)
      const oy = Math.round((h - gh) / 2)

      /* assembly progress */
      let settled = 0
      for (const cell of cells) {
        cell.p = Math.min(1, Math.max(0, (t - cell.delay) / cell.dur))
        if (cell.p >= 1) settled++
      }
      const ga = settled / cells.length

      /* soft shadow: enough to lift the card, nothing theatrical */
      if (ga > 0.35) {
        const a = (ga - 0.35) / 0.65
        ctx.save()
        ctx.shadowColor = `rgba(23,22,26,${0.18 * a})`
        ctx.shadowBlur = 54
        ctx.shadowOffsetY = 22
        ctx.shadowOffsetX = -8
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(ox, oy, gw, gh, 10)
        ctx.fill()
        ctx.restore()
      }

      /* settled pixels first, flying pixels on top */
      for (const pass of [1, 0]) {
        for (const cell of cells) {
          const done = cell.p >= 1
          if ((pass === 1) !== done) continue
          const tx = ox + cell.col * cSize
          const ty = oy + cell.row * cSize
          if (done) {
            let color = cell.color
            if (cell.special === 'blink' && Math.floor(t / 480) % 2 === 0) color = C.white
            /* extrude accents into little 3D blocks */
            const lift = LIFT[color]
            if (lift) {
              ctx.fillStyle = DARK[color]
              ctx.fillRect(tx + Math.round(lift * 0.5), ty + lift, cSize - 1, cSize - 1)
            }
            ctx.fillStyle = color
            ctx.fillRect(tx, ty, cSize - 1, cSize - 1)
          } else if (cell.p > 0) {
            const e = easeOut(cell.p)
            const px = cell.sxF * w + (tx - cell.sxF * w) * e
            const py = cell.syF * h + (ty - cell.syF * h) * e
            const s = cSize * (0.5 + 0.5 * e)
            ctx.save()
            ctx.translate(px + s / 2, py + s / 2)
            ctx.rotate(cell.rot0 * (1 - e))
            ctx.globalAlpha = 0.25 + 0.75 * e
            ctx.fillStyle = cell.color === C.white || cell.color === C.side ? C.grey : cell.color
            ctx.fillRect(-s / 2, -s / 2, s - 1, s - 1)
            ctx.restore()
          }
        }
      }

      /* frame line once assembled */
      if (ga > 0.85) {
        ctx.strokeStyle = `rgba(23,22,26,${0.14 * ((ga - 0.85) / 0.15)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(ox + 0.5, oy + 0.5, gw - 1, gh - 1, 10)
        ctx.stroke()
      }

      /* strays — ambient chaos that respects your cursor */
      for (const s of strays) {
        s.xF += 0.00016 * Math.sin(t * 0.0003 * s.sp + s.ph)
        s.yF += 0.00013 * Math.cos(t * 0.00037 * s.sp + s.ph * 2)
        let sx = s.xF * w
        let sy = s.yF * h
        const dx = sx - mouse.x
        const dy = sy - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 110 && d > 0.01) {
          s.xF += (dx / d) * 0.0022 * (1 - d / 110)
          s.yF += (dy / d) * 0.0022 * (1 - d / 110)
        }
        if (s.xF < -0.05) s.xF = 1.05
        if (s.xF > 1.05) s.xF = -0.05
        if (s.yF < -0.05) s.yF = 1.05
        if (s.yF > 1.05) s.yF = -0.05
        sx = s.xF * w
        sy = s.yF * h
        ctx.save()
        ctx.translate(sx, sy)
        ctx.rotate(Math.sin(t * 0.0004 * s.sp + s.ph) * 0.7)
        ctx.globalAlpha = 0.4 + 0.45 * (s.depth - 0.5)
        ctx.fillStyle = s.color
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size)
        ctx.restore()
      }

      raf = requestAnimationFrame(frame)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      /* static final state */
      started = true
      for (const cell of cells) {
        cell.delay = -1
        cell.dur = 1
      }
      frame(10000)
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="pastel__visual" ref={wrapRef} title="Click to re-assemble">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AV_HERO } from '../data'
import { makeCanvas, paintDitherGradient } from './sceneUtils'

/* =========================================================================
   HIMACHAL HERO — a still morning in the mountains.
   Split layout: copy lives on clean cream (no text-over-art conflicts);
   the scene sits in a framed panel. Drawn once — static pixel scenery.

   The scene: Dhauladhar-style snow peaks, pine ridges, prayer flags
   carrying the only saturated color, and an isometric laptop as the
   subject — notebook, pens and a water bottle beside it on a wooden deck.
   ========================================================================= */

const W = 320
const H = 360

const FLAG_COLORS = ['#3e7c7b', '#efe9d6', '#e05237', '#4c8a5c', '#fbbd2f', '#8a3d6b']

function drawScene(ctx) {
  /* ---- sky: soft morning teal fading to warm valley light ---- */
  paintDitherGradient(ctx, W, 216, [
    { y: 0, c: '#9ec4c1' },
    { y: 80, c: '#c6dbd2' },
    { y: 150, c: '#e7e4cc' },
    { y: 215, c: '#f2ead0' },
  ])

  /* ---- clouds: soft stacked banks ---- */
  const cloud = (cx, cy, w) => {
    ctx.fillStyle = '#f4efdf'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 3, w / 2, 4.5, 0, 0, Math.PI * 2)
    ctx.ellipse(cx - w * 0.18, cy, w / 3.4, 4, 0, 0, Math.PI * 2)
    ctx.ellipse(cx + w * 0.2, cy + 1, w / 4, 3.4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(190,196,178,0.5)'
    ctx.beginPath()
    ctx.ellipse(cx + 2, cy + 6, w / 2.4, 2, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  cloud(64, 46, 56)
  cloud(224, 30, 68)

  /* tiny far birds */
  ctx.fillStyle = '#5a7776'
  for (const [bx, by] of [[96, 64], [104, 60], [246, 70]]) {
    ctx.fillRect(bx, by, 1, 1)
    ctx.fillRect(bx - 2, by - 1, 2, 1)
    ctx.fillRect(bx + 1, by - 1, 2, 1)
  }

  /* ---- snow ranges: overlapping peaks, lit left face / shadowed right ---- */
  const BASE = 192
  const peak = (cx, hw, py, lit, shad, skewTop = 0) => {
    ctx.fillStyle = lit
    ctx.beginPath()
    ctx.moveTo(cx - hw, BASE)
    ctx.lineTo(cx + skewTop, py)
    ctx.lineTo(cx + skewTop + 2, BASE)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = shad
    ctx.beginPath()
    ctx.moveTo(cx + skewTop, py)
    ctx.lineTo(cx + hw, BASE)
    ctx.lineTo(cx + skewTop + 2, BASE)
    ctx.closePath()
    ctx.fill()
  }
  /* back range — hazier, bluer */
  peak(20, 60, 132, '#dee7e5', '#c8d5d7', 4)
  peak(105, 74, 112, '#dee7e5', '#c8d5d7', -6)
  peak(190, 68, 122, '#dbe4e2', '#c5d2d4', 5)
  peak(278, 72, 108, '#dee7e5', '#c8d5d7', -4)
  /* front range — bright snow, sharper */
  peak(-14, 58, 148, '#f2f4ec', '#c0ced4', 6)
  peak(66, 62, 98, '#f2f4ec', '#bfccd2', -7)
  peak(158, 70, 90, '#f4f6ee', '#c2d0d6', 8)
  peak(248, 58, 116, '#f0f2ea', '#bfccd2', -5)
  peak(322, 54, 130, '#f2f4ec', '#c0ced4', 6)
  /* valley haze — dithered, no hard edge */
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(242,234,208,${0.3 - i * 0.055})`
    ctx.fillRect(0, 186 - i * 3, W, 3)
  }

  /* ---- pine ridges ---- */
  const pineBand = (baseY, amp, fill, treeFill, treeH, step) => {
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.moveTo(0, H)
    for (let x = 0; x <= W; x += 4) {
      ctx.lineTo(x, baseY + amp * Math.sin(x * 0.03 + baseY))
    }
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = treeFill
    for (let x = 2; x < W; x += step) {
      const yTop = baseY + amp * Math.sin(x * 0.03 + baseY)
      const h = treeH + ((x * 7) % 5)
      ctx.beginPath()
      ctx.moveTo(x, yTop - h)
      ctx.lineTo(x + 3, yTop + 2)
      ctx.lineTo(x - 3, yTop + 2)
      ctx.closePath()
      ctx.fill()
    }
  }
  pineBand(212, 6, '#3a6357', '#2e544a', 7, 9)
  pineBand(244, 7, '#22453e', '#1b3a34', 11, 12)

  /* ---- wooden deck foreground ---- */
  ctx.fillStyle = '#b08a5e'
  ctx.fillRect(0, 268, W, H - 268)
  ctx.fillStyle = '#c79d6e'
  ctx.fillRect(0, 268, W, 2)
  ctx.fillStyle = '#96714b'
  for (let y = 282; y < H; y += 13) ctx.fillRect(0, y, W, 1)
  for (let x = 36; x < W; x += 64) {
    ctx.fillRect(x + ((x * 3) % 20), 270, 1, H - 270)
  }
  ctx.fillStyle = 'rgba(122,90,58,0.35)'
  ctx.fillRect(0, 344, W, H - 344)

  /* ---- prayer flags: two strings across the sky ---- */
  const flagString = (x0, y0, x1, y1, sag, phase) => {
    const yAt = (t) => y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag
    ctx.strokeStyle = '#7a6b58'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    for (let t = 0; t <= 1.001; t += 0.05) ctx.lineTo(x0 + (x1 - x0) * t, yAt(t))
    ctx.stroke()
    const n = Math.floor((x1 - x0) / 24)
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      const fx = Math.round(x0 + (x1 - x0) * t)
      const fy = yAt(t)
      const slope = (yAt(t + 0.02) - fy) / ((x1 - x0) * 0.02)
      const skew = (i + phase) % 2 === 0 ? 2 : -2
      const c = FLAG_COLORS[(i + phase) % FLAG_COLORS.length]
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.moveTo(fx, fy)
      ctx.lineTo(fx + 11, fy + slope * 11)
      ctx.lineTo(fx + 11 + skew, fy + slope * 11 + 9)
      ctx.lineTo(fx + skew, fy + 9)
      ctx.closePath()
      ctx.fill()
      /* bottom shade so the cloth reads as hanging */
      ctx.fillStyle = 'rgba(20,52,58,0.18)'
      ctx.beginPath()
      ctx.moveTo(fx + skew, fy + 7)
      ctx.lineTo(fx + 11 + skew, fy + slope * 11 + 7)
      ctx.lineTo(fx + 11 + skew, fy + slope * 11 + 9)
      ctx.lineTo(fx + skew, fy + 9)
      ctx.closePath()
      ctx.fill()
    }
  }
  flagString(-6, 40, 326, 96, 15, 0)
  flagString(-6, 120, 326, 48, 13, 3)

  /* ================= the subject: isometric laptop ================= */
  const cx = 138
  const cy = 250
  const pt = (ix, iz, iy) => [cx + (ix - iz) * 1.55, cy + (ix + iz) * 0.78 - iy]
  const quad = (a, b, c, d, fill) => {
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.moveTo(a[0], a[1])
    ctx.lineTo(b[0], b[1])
    ctx.lineTo(c[0], c[1])
    ctx.lineTo(d[0], d[1])
    ctx.closePath()
    ctx.fill()
  }

  /* shadow under the machine */
  ctx.fillStyle = 'rgba(90,64,38,0.4)'
  ctx.beginPath()
  ctx.ellipse(cx + 16, cy + 44, 58, 13, 0, 0, Math.PI * 2)
  ctx.fill()

  /* base slab (keyboard deck) — 60×40 iso units, 5 thick */
  const A = pt(0, 0, 5)
  const B = pt(60, 0, 5)
  const C = pt(60, 40, 5)
  const D = pt(0, 40, 5)
  quad(A, B, C, D, '#dcd5c5')
  quad(B, C, pt(60, 40, 0), pt(60, 0, 0), '#b4ac9a') /* right side */
  quad(D, C, pt(60, 40, 0), pt(0, 40, 0), '#c4bcaa') /* front side */

  /* keyboard */
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k < 11; k++) {
      const kx = 7 + k * 4.4
      const kz = 7 + r * 5
      quad(pt(kx, kz, 5.4), pt(kx + 3.4, kz, 5.4), pt(kx + 3.4, kz + 3.6, 5.4), pt(kx, kz + 3.6, 5.4), '#8e8878')
    }
  }
  /* trackpad */
  quad(pt(22, 30, 5.3), pt(40, 30, 5.3), pt(40, 38, 5.3), pt(22, 38, 5.3), '#cbc4b2')

  /* screen — hinged at the back edge, tilted up */
  const b0 = pt(0, 0, 5)
  const b1 = pt(60, 0, 5)
  const t1 = pt(60, -10, 54)
  const t0 = pt(0, -10, 54)
  /* thin back edge for depth */
  quad(pt(0, -2, 5), pt(60, -2, 5), pt(60, -12, 54), pt(0, -12, 54), '#16333a')
  quad(b0, b1, t1, t0, '#22434a')

  /* display — bilinear inset of the screen quad */
  const sp = (u, v) => {
    const top = [t0[0] + (t1[0] - t0[0]) * u, t0[1] + (t1[1] - t0[1]) * u]
    const bot = [b0[0] + (b1[0] - b0[0]) * u, b0[1] + (b1[1] - b0[1]) * u]
    return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v]
  }
  quad(sp(0.05, 0.08), sp(0.95, 0.08), sp(0.95, 0.9), sp(0.05, 0.9), '#0e272d')

  /* window chrome dots */
  const dot = (u, v, c) => {
    const [x, y] = sp(u, v)
    ctx.fillStyle = c
    ctx.fillRect(Math.round(x), Math.round(y), 2, 2)
  }
  dot(0.09, 0.13, '#e05237')
  dot(0.13, 0.13, '#fbbd2f')
  dot(0.17, 0.13, '#3e7c7b')
  ctx.fillStyle = '#7d9a98'
  const [tbx, tby] = sp(0.3, 0.13)
  ctx.fillRect(Math.round(tbx), Math.round(tby), 26, 1)

  /* uptrend chart */
  const chart = [
    [0.1, 0.72], [0.18, 0.64], [0.26, 0.68], [0.34, 0.55],
    [0.42, 0.58], [0.5, 0.44], [0.58, 0.37],
  ]
  ctx.strokeStyle = '#fbbd2f'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  chart.forEach(([u, v], i) => {
    const [x, y] = sp(u, v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  const [eu, ev] = sp(0.58, 0.37)
  ctx.fillStyle = '#fff3d6'
  ctx.fillRect(Math.round(eu) - 1, Math.round(ev) - 1, 3, 3)

  /* bars */
  const bars = [
    [0.7, 0.22, '#3e7c7b'],
    [0.76, 0.3, '#fbbd2f'],
    [0.82, 0.26, '#e05237'],
    [0.88, 0.4, '#7d9a98'],
  ]
  for (const [u, hgt, c] of bars) {
    const [x0, y0] = sp(u, 0.78)
    const [, y1] = sp(u, 0.78 - hgt)
    ctx.fillStyle = c
    ctx.fillRect(Math.round(x0), Math.round(y1), 3, Math.round(y0 - y1))
  }
  /* code dashes */
  ctx.fillStyle = '#7d9a98'
  for (const [u, v, w2] of [[0.1, 0.82, 16], [0.1, 0.86, 24], [0.4, 0.86, 12]]) {
    const [x, y] = sp(u, v)
    ctx.fillRect(Math.round(x), Math.round(y), w2, 1)
  }

  /* ---- notebook + pens, left of the laptop ---- */
  const nx = 74
  const ny = 306
  const np = (ix, iz, iy = 0) => [nx + (ix - iz) * 1.4, ny + (ix + iz) * 0.7 - iy]
  ctx.fillStyle = 'rgba(90,64,38,0.35)'
  ctx.beginPath()
  ctx.ellipse(nx + 2, ny + 22, 26, 7, 0, 0, Math.PI * 2)
  ctx.fill()
  quad(np(0, 0, 3), np(26, 0, 3), np(26, 20, 3), np(0, 20, 3), '#7a2b57')
  quad(np(0, 20, 3), np(26, 20, 3), np(26, 20, 0), np(0, 20, 0), '#5e2145')
  quad(np(26, 0, 3), np(26, 20, 3), np(26, 20, 0), np(26, 0, 0), '#efe4d2') /* page edge */
  quad(np(19, 0, 3.2), np(23, 0, 3.2), np(23, 20, 3.2), np(19, 20, 3.2), '#efe9d6') /* band */
  /* pens */
  ctx.strokeStyle = '#fbbd2f'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(nx + 34, ny + 30)
  ctx.lineTo(nx + 56, ny + 22)
  ctx.stroke()
  ctx.strokeStyle = '#e05237'
  ctx.beginPath()
  ctx.moveTo(nx + 32, ny + 35)
  ctx.lineTo(nx + 54, ny + 28)
  ctx.stroke()
  ctx.fillStyle = '#16333a'
  ctx.fillRect(nx + 55, ny + 21, 3, 2)
  ctx.fillRect(nx + 53, ny + 27, 3, 2)

  /* ---- water bottle, right of the laptop ---- */
  const bx = 242
  const by = 246
  ctx.fillStyle = 'rgba(90,64,38,0.35)'
  ctx.beginPath()
  ctx.ellipse(bx + 7, by + 54, 13, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2a5f64'
  ctx.fillRect(bx, by + 12, 15, 42)
  ctx.fillRect(bx + 4, by + 6, 7, 7)
  ctx.fillStyle = '#1e474b'
  ctx.fillRect(bx + 12, by + 12, 3, 42) /* shade edge */
  ctx.fillStyle = '#efe9d6'
  ctx.fillRect(bx + 3, by, 9, 6) /* cap */
  ctx.fillStyle = '#c9c2ae'
  ctx.fillRect(bx + 3, by + 4, 9, 2)
  ctx.fillStyle = '#efe9d6'
  ctx.fillRect(bx, by + 26, 15, 12) /* label */
  ctx.fillStyle = '#e05237'
  ctx.fillRect(bx, by + 30, 15, 2)
  ctx.fillStyle = '#7d9a98'
  ctx.fillRect(bx + 3, by + 34, 8, 1)
  ctx.fillStyle = '#4e8380'
  ctx.fillRect(bx + 2, by + 13, 2, 40) /* highlight */
}

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

export default function HimachalHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    /* static scenery — drawn exactly once */
    const buf = makeCanvas(W, H)
    drawScene(buf.getContext('2d'))
    ctx.drawImage(buf, 0, 0)
  }, [])

  return (
    <section id="top" className="hero hero--himachal">
      <div className="container himachal__grid">
        <motion.div
          className="himachal__copy"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}
        >
          <motion.span variants={rise} className="kicker">
            {AV_HERO.kicker}
          </motion.span>
          <motion.h1 variants={rise} className="hero__title display">
            {AV_HERO.title}
          </motion.h1>
          <motion.p variants={rise} className="lead hero__sub">
            {AV_HERO.sub}
          </motion.p>
          <motion.div variants={rise} className="hero__ctas">
            <a href="#contact" className="btn btn-primary">
              {AV_HERO.cta} <span className="arrow">→</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="himachal__scene"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}

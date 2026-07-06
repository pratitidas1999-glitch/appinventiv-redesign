import { useEffect, useRef } from 'react'
import SceneOverlay from './SceneOverlay'
import {
  mulberry32,
  bayerAt,
  makeCanvas,
  paintDitherGradient,
  drawSun,
  dawnStops,
  coverPointer,
} from './sceneUtils'

/* =========================================================================
   PIXEL HERO — "Calm is an engineering outcome."
   A still mountain lake at dawn. On the far shore: the built world — a
   city Appinventiv keeps running, windows lit, reflected in the water.
   On the near shore: a wooden dock, a laptop showing live dashboards,
   coffee still steaming. Drawn procedurally at 480×270, upscaled with
   image-rendering: pixelated.

   Interactive: mouse parallax · fireflies drift to the cursor · reeds
   bend away · moving over water leaves ripple trails · click the lake
   for rings · dashboards type & charts climb forever.
   ========================================================================= */

const W = 480
const H = 270
const WATERLINE = 130
const SUN_X = 388
const DOCK_CX = 330
const DOCK_TOP = 170
const PLATFORM_BOTTOM = 194

/* ------------------------------------------------------ static layers */

function ridgeFar(x) {
  return 118 - 16 * Math.abs(Math.sin(x * 0.017 + 0.6)) - 5 * Math.abs(Math.sin(x * 0.041 + 1.2))
}
function ridgeNear(x) {
  return 128 - 11 * Math.abs(Math.sin(x * 0.013 + 2.0)) - 6 * Math.abs(Math.sin(x * 0.033 + 0.7))
}

/* sky + sun + mountains + far-shore city, all above the waterline */
function buildUpper(rnd) {
  const c = makeCanvas(W, H)
  const ctx = c.getContext('2d')
  paintDitherGradient(ctx, W, WATERLINE, dawnStops(WATERLINE))

  /* far ridge — mauve silhouette */
  for (let x = 0; x < W; x++) {
    const yTop = Math.round(ridgeFar(x))
    ctx.fillStyle = '#575371'
    ctx.fillRect(x, yTop, 1, 2)
    ctx.fillStyle = '#43405f'
    ctx.fillRect(x, yTop + 2, 1, WATERLINE - yTop - 2)
  }
  /* near ridge — deep teal */
  for (let x = 0; x < W; x++) {
    const yTop = Math.round(ridgeNear(x))
    ctx.fillStyle = '#26545c'
    ctx.fillRect(x, yTop, 1, 1)
    ctx.fillStyle = '#1d434a'
    ctx.fillRect(x, yTop + 1, 1, WATERLINE - yTop - 1)
  }

  /* the morning sun, fully risen just above the ridgeline */
  drawSun(ctx, SUN_X, 117, WATERLINE)

  /* far-shore city — the systems we run, awake before you are */
  const twinkles = []
  const beacons = []
  let x = 14
  while (x < 224) {
    const bw = 8 + Math.floor(rnd() * 16)
    const bh = 7 + Math.floor(rnd() * 24)
    const top = WATERLINE - bh
    ctx.fillStyle = rnd() < 0.5 ? '#16333d' : '#1b3b47'
    ctx.fillRect(x, top, bw, bh)
    if (bh > 18 && rnd() < 0.45) {
      ctx.fillRect(x + Math.floor(bw / 2), top - 4, 1, 4)
      beacons.push({ x: x + Math.floor(bw / 2), y: top - 4, ph: rnd() * 9 })
    }
    if (rnd() < 0.35) ctx.fillRect(x + 2, top - 2, Math.max(2, bw - 8), 2)
    /* windows — bake most in (so the reflection carries them),
       keep some for live twinkling */
    for (let wy = top + 2; wy < WATERLINE - 2; wy += 4) {
      for (let wx = x + 1; wx < x + bw - 1; wx += 3) {
        const r = rnd()
        if (r < 0.3) {
          ctx.fillStyle = r < 0.08 ? '#e8a25c' : '#fbbd2f'
          ctx.fillRect(wx, wy, 1, 1)
        } else if (r < 0.4) {
          twinkles.push({ x: wx, y: wy, ph: rnd() * 20 })
        }
      }
    }
    x += bw + (rnd() < 0.3 ? 3 : 1)
  }
  /* gold waterline seam — only near the sun, dithered out */
  for (let x = SUN_X - 44; x < SUN_X + 44; x++) {
    if (x < 0 || x >= W) continue
    const d = Math.abs(x - SUN_X) / 44
    if ((1 - d) * 16 > bayerAt(x, WATERLINE - 1)) {
      ctx.fillStyle = d < 0.3 ? '#ffe9a8' : '#fbbd2f'
      ctx.fillRect(x, WATERLINE - 1, 1, 1)
    }
  }
  return { canvas: c, twinkles, beacons }
}

/* the lake — a mirrored, darkened copy of everything above it */
function buildWater(upper) {
  const c = makeCanvas(W, H - WATERLINE)
  const ctx = c.getContext('2d')
  const wh = H - WATERLINE
  ctx.save()
  ctx.translate(0, wh)
  ctx.scale(1, -wh / WATERLINE)
  ctx.drawImage(upper, 0, 0)
  ctx.restore()
  ctx.fillStyle = 'rgba(16,42,48,0.22)'
  ctx.fillRect(0, 0, W, wh)
  /* faint horizontal banding so the water reads as water even when still */
  for (let y = 0; y < wh; y += 3) {
    if (y % 6 === 0) {
      ctx.fillStyle = 'rgba(18,49,60,0.12)'
      ctx.fillRect(0, y, W, 1)
    }
  }
  return c
}

/* dock geometry: a wide viewing platform at the end of a walkway that
   runs off the bottom of the frame */
function dockHalf(y) {
  if (y < PLATFORM_BOTTOM) return 32
  return Math.round(12 + 30 * ((y - PLATFORM_BOTTOM) / (H - PLATFORM_BOTTOM)))
}

function buildDock(rnd) {
  const c = makeCanvas(W, H)
  const ctx = c.getContext('2d')
  for (let y = DOCK_TOP; y < H; y++) {
    const half = dockHalf(y)
    const plankGap = y % 7 === 0
    ctx.fillStyle = plankGap ? '#4a3226' : y % 2 ? '#6b4a37' : '#71503b'
    ctx.fillRect(DOCK_CX - half, y, half * 2, 1)
    ctx.fillStyle = '#7d5a42'
    ctx.fillRect(DOCK_CX - half, y, 1, 1)
    ctx.fillRect(DOCK_CX + half - 1, y, 1, 1)
    if (!plankGap && rnd() < 0.06) {
      ctx.fillStyle = '#5a3d2c'
      ctx.fillRect(DOCK_CX - half + 2 + Math.floor(rnd() * (half * 2 - 4)), y, 1, 1)
    }
  }
  /* platform edge caps */
  ctx.fillStyle = '#4a3226'
  ctx.fillRect(DOCK_CX - 32, DOCK_TOP - 1, 64, 1)
  ctx.fillRect(DOCK_CX - 32, PLATFORM_BOTTOM, 20, 1)
  ctx.fillRect(DOCK_CX + 12, PLATFORM_BOTTOM, 20, 1)
  /* corner + walkway posts */
  const posts = [
    [DOCK_CX - 33, DOCK_TOP],
    [DOCK_CX + 30, DOCK_TOP],
    [DOCK_CX - 17, PLATFORM_BOTTOM + 36],
    [DOCK_CX + 14, PLATFORM_BOTTOM + 36],
  ]
  for (const [px, py] of posts) {
    ctx.fillStyle = '#553a2a'
    ctx.fillRect(px, py - 8, 3, 9)
    ctx.fillStyle = '#7d5a42'
    ctx.fillRect(px, py - 9, 3, 1)
  }
  return c
}

/* small open laptop for the dock platform */
function buildLaptop() {
  const c = makeCanvas(48, 36)
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#243b41'
  ctx.fillRect(4, 0, 40, 24)
  ctx.fillStyle = '#0c242b'
  ctx.fillRect(6, 2, 36, 20)
  ctx.fillStyle = '#3d565c'
  ctx.fillRect(23, 1, 1, 1)
  ctx.fillStyle = '#1c3036'
  ctx.fillRect(2, 24, 44, 2)
  for (let r = 0; r < 7; r++) {
    ctx.fillStyle = r < 5 ? '#cbbfa8' : '#9a8f7b'
    ctx.fillRect(4 - r, 26 + r, 40 + r * 2, 1)
  }
  ctx.fillStyle = '#8a8071'
  for (let ky = 0; ky < 2; ky++) {
    for (let kx = 0; kx < 12; kx++) {
      ctx.fillRect(6 + kx * 3 + ky, 28 + ky * 3, 2, 2)
    }
  }
  return { canvas: c, dispX: 6, dispY: 2, dispW: 36, dispH: 20 }
}

export default function PixelHero() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const rnd = mulberry32(20260702)
    const upper = buildUpper(rnd)
    const water = buildWater(upper.canvas)
    const dock = buildDock(rnd)
    const laptop = buildLaptop()

    const LAPX = DOCK_CX - 24
    const LAPY = DOCK_TOP - 19

    /* reeds on both banks */
    const reeds = []
    const bankLeft = (x) => 246 + (x / 92) * 20
    const bankRight = (x) => 246 + ((W - x) / 92) * 20
    for (let i = 0; i < 34; i++) {
      const left = i < 19
      const x = left ? 2 + Math.floor(rnd() * 86) : 394 + Math.floor(rnd() * 82)
      const base = (left ? bankLeft(x) : bankRight(x)) + 2 + rnd() * 6
      reeds.push({
        x,
        y: Math.min(H - 2, Math.floor(base)),
        h: 10 + Math.floor(rnd() * 15),
        c: rnd() < 0.5 ? '#1e4a40' : '#28584a',
        tail: rnd() < 0.45,
        ph: rnd() * 6,
      })
    }

    /* fireflies */
    const flies = []
    for (let i = 0; i < 12; i++) {
      flies.push({
        x: rnd() < 0.5 ? rnd() * 120 : 360 + rnd() * 120,
        y: 190 + rnd() * 65,
        ph: rnd() * 10,
        sp: 0.6 + rnd() * 0.8,
      })
    }

    /* dashboard content — line chart points */
    const chartPts = []
    for (let i = 0; i < 11; i++) {
      chartPts.push(2 + i * 0.9 + 1.8 * Math.sin(i * 1.1 + 2))
    }

    const ripples = []
    let lastTrail = 0
    let nextAmbient = 2500
    let birds = []
    let nextFlock = 6000
    let lastT = 0

    const mouse = { tx: W * 0.55, ty: H * 0.42, x: W * 0.55, y: H * 0.42, in: false }

    const overWater = (x, y) =>
      y > WATERLINE + 4 && y < H - 6 && !(Math.abs(x - DOCK_CX) < 48 && y > DOCK_TOP - 6) &&
      !(x < 95 && y > bankLeft(x) - 2) && !(x > 385 && y > bankRight(x) - 2)

    function onMove(e) {
      const p = coverPointer(e, canvas, W, H)
      mouse.tx = p.x
      mouse.ty = p.y
      mouse.in = true
      if (overWater(p.x, p.y) && lastT - lastTrail > 380) {
        ripples.push({ x: p.x, y: p.y, born: lastT, max: 10 })
        lastTrail = lastT
      }
    }
    function onLeave() {
      mouse.in = false
      mouse.tx = W * 0.55
      mouse.ty = H * 0.42
    }
    function onClick(e) {
      const p = coverPointer(e, canvas, W, H)
      if (overWater(p.x, p.y)) {
        ripples.push({ x: p.x, y: p.y, born: lastT, max: 30 })
        ripples.push({ x: p.x, y: p.y, born: lastT + 260, max: 22 })
      }
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('click', onClick)

    function drawScreen(t, lx, ly) {
      const dx = lx + laptop.dispX
      const dy = ly + laptop.dispY
      /* warm glow bleeding off the display */
      for (let gy = -3; gy < laptop.dispH + 5; gy++) {
        for (let gx = -4; gx < laptop.dispW + 8; gx++) {
          if (gx >= 0 && gx < laptop.dispW && gy >= 0 && gy < laptop.dispH) continue
          const ex = Math.max(0, Math.max(-gx, gx - laptop.dispW))
          const ey = Math.max(0, Math.max(-gy, gy - laptop.dispH))
          const d = Math.max(ex, ey)
          if (d < 4 && (4 - d) * 4 > bayerAt(dx + gx, dy + gy)) {
            ctx.fillStyle = 'rgba(251,189,47,0.14)'
            ctx.fillRect(dx + gx, dy + gy, 1, 1)
          }
        }
      }
      const cycle = t % 12000
      /* header chrome */
      ctx.fillStyle = '#f45140'
      ctx.fillRect(dx + 2, dy + 2, 2, 2)
      ctx.fillStyle = '#e9d9a6'
      ctx.fillRect(dx + 6, dy + 2, 8, 1)
      ctx.fillStyle = '#7fb6a0'
      ctx.fillRect(dx + laptop.dispW - 8, dy + 2, 6, 1)
      /* uptrend line chart, revealed over the cycle */
      const reveal = Math.min(chartPts.length, Math.floor(cycle / 380))
      ctx.fillStyle = '#fbbd2f'
      for (let i = 0; i < reveal; i++) {
        const cxp = dx + 3 + i * 2
        const cyp = dy + 16 - Math.round(chartPts[i])
        ctx.fillRect(cxp, cyp, 1, 1)
        if (i > 0) {
          const prev = dy + 16 - Math.round(chartPts[i - 1])
          const lo = Math.min(prev, cyp)
          const hi = Math.max(prev, cyp)
          for (let yy = lo + 1; yy < hi; yy++) ctx.fillRect(cxp - 1, yy, 1, 1)
        }
      }
      if (reveal > 0 && reveal < chartPts.length && Math.floor(t / 300) % 2 === 0) {
        const cxp = dx + 3 + (reveal - 1) * 2
        const cyp = dy + 16 - Math.round(chartPts[reveal - 1])
        ctx.fillStyle = '#ffe9a8'
        ctx.fillRect(cxp - 1, cyp - 1, 3, 3)
      }
      /* bars */
      const barGrow = Math.min(1, Math.max(0, (cycle - 4200) / 1600))
      const hts = [4, 7, 10]
      const cols = ['#fbbd2f', '#f45140', '#f25f88']
      for (let b = 0; b < 3; b++) {
        const bh = Math.round(hts[b] * barGrow)
        if (bh > 0) {
          ctx.fillStyle = cols[b]
          ctx.fillRect(dx + 27 + b * 3, dy + 16 - bh, 2, bh)
        }
      }
      /* status line typing + green check when "deployed" */
      const tw = Math.max(0, Math.min(22, (cycle - 6800) * 0.02))
      ctx.fillStyle = '#e9d9a6'
      ctx.fillRect(dx + 3, dy + 18, Math.round(tw), 1)
      if (cycle > 9400) {
        ctx.fillStyle = '#7fb6a0'
        ctx.fillRect(dx + 28, dy + 17, 1, 1)
        ctx.fillRect(dx + 29, dy + 18, 1, 1)
        ctx.fillRect(dx + 30, dy + 17, 1, 1)
        ctx.fillRect(dx + 31, dy + 16, 1, 1)
      } else if (Math.floor(t / 420) % 2 === 0) {
        ctx.fillStyle = '#fbbd2f'
        ctx.fillRect(dx + 4 + Math.round(tw), dy + 17, 2, 2)
      }
    }

    function frame(t) {
      lastT = t
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      const nx = (mouse.x / W - 0.5) * 2
      const ny = (mouse.y / H - 0.5) * 2
      const off = (f) => Math.round(-nx * f)
      const offY = (f) => Math.round(-ny * f * 0.35)

      /* --- above the waterline --- */
      ctx.drawImage(upper.canvas, off(3), offY(2))

      /* twinkling city windows + tower beacons */
      const uOff = off(3)
      const uOffY = offY(2)
      for (const wd of upper.twinkles) {
        if (Math.sin(t * 0.00024 + wd.ph * 3.1) > -0.55) {
          ctx.fillStyle = '#fbbd2f'
          ctx.fillRect(wd.x + uOff, wd.y + uOffY, 1, 1)
        }
      }
      for (const b of upper.beacons) {
        if (Math.sin(t * 0.0025 + b.ph) > 0.55) {
          ctx.fillStyle = '#f25f88'
          ctx.fillRect(b.x + uOff, b.y + uOffY, 1, 1)
        }
      }

      /* satellite gliding over — quiet infrastructure */
      const sp = (t % 26000) / 26000
      const satX = sp * (W + 80) - 40
      const satY = 22 + sp * 26
      ctx.fillStyle = 'rgba(223,232,232,0.4)'
      ctx.fillRect(satX - 3, satY + 1, 3, 1)
      ctx.fillStyle = '#dfe8e8'
      ctx.fillRect(satX, satY, 1, 1)
      if (Math.floor(t / 900) % 3 === 0) {
        ctx.fillStyle = '#f25f88'
        ctx.fillRect(satX, satY - 1, 1, 1)
      }

      /* birds */
      if (t > nextFlock && birds.length === 0) {
        const by = 50 + Math.random() * 40
        birds = [0, 1, 2].map((i) => ({ x: -10 - i * 9, y: by + (i % 2) * 4, ph: i }))
      }
      birds = birds.filter((b) => b.x < W + 12)
      if (birds.length === 0 && t > nextFlock) nextFlock = t + 14000 + Math.random() * 9000
      for (const b of birds) {
        b.x += 0.32
        const flap = Math.floor(t / 260 + b.ph) % 2 === 0
        ctx.fillStyle = '#12262b'
        ctx.fillRect(b.x, b.y, 1, 1)
        ctx.fillRect(b.x - 1, b.y + (flap ? -1 : 0), 1, 1)
        ctx.fillRect(b.x + 1, b.y + (flap ? -1 : 0), 1, 1)
      }

      /* --- the lake: mirrored world, living rows --- */
      for (let y = 0; y < H - WATERLINE; y++) {
        const depth = y / (H - WATERLINE)
        const shift = Math.round(
          1.8 * Math.sin(t * 0.0011 + y * 0.35) * depth + 0.7 * Math.sin(t * 0.0021 + y * 0.13)
        )
        ctx.drawImage(water, 0, y, W, 1, shift + off(2), WATERLINE + y, W, 1)
      }

      /* sun's glitter path on the water */
      for (let y = WATERLINE + 2; y < 244; y += 2) {
        const depth = (y - WATERLINE) / 114
        const spread = 2 + depth * 16
        const gate = Math.sin(t * 0.0035 + y * 2.3) + Math.sin(y * 13.7)
        if (gate > 0.75 - depth * 0.5) {
          const gx = SUN_X + Math.round(Math.sin(y * 0.6 + t * 0.0008) * spread)
          ctx.fillStyle = gate > 1.3 ? '#ffe9a8' : depth > 0.5 ? '#f0975c' : '#fbbd2f'
          ctx.fillRect(gx, y, gate > 1.5 ? 2 : 1, 1)
        }
      }

      /* drifting dawn mist */
      for (let m = 0; m < 3; m++) {
        const mw = 90 + m * 40
        const mx = ((t * (0.004 + m * 0.0016) + m * 210) % (W + mw)) - mw
        const my = 135 + m * 8
        ctx.fillStyle = `rgba(244,230,201,${0.075 - m * 0.012})`
        ctx.fillRect(Math.round(mx), my, mw, 2 + (m % 2))
      }

      /* ripples */
      if (t > nextAmbient) {
        const ax = 20 + Math.random() * 440
        const ay = 142 + Math.random() * 100
        if (overWater(ax, ay)) ripples.push({ x: ax, y: ay, born: t, max: 18 })
        nextAmbient = t + 3200 + Math.random() * 2600
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        const age = t - rp.born
        if (age < 0) continue
        const r = age * 0.016
        if (r > rp.max) {
          ripples.splice(i, 1)
          continue
        }
        const alpha = 0.55 * (1 - r / rp.max)
        ctx.fillStyle = `rgba(255,243,214,${alpha})`
        for (let a = 0; a < Math.PI * 2; a += 0.16) {
          ctx.fillRect(
            Math.round(rp.x + Math.cos(a) * r),
            Math.round(rp.y + Math.sin(a) * r * 0.32),
            1,
            1
          )
        }
      }

      /* --- the dock and its stillness --- */
      const dOff = off(7)
      const dOffY = offY(4)
      ctx.drawImage(dock, dOff, dOffY)

      const lx = LAPX + dOff
      const ly = LAPY + dOffY
      /* laptop shadow on the planks */
      ctx.fillStyle = 'rgba(20,12,8,0.45)'
      ctx.fillRect(lx + 1, ly + 34, 46, 2)
      ctx.drawImage(laptop.canvas, lx, ly)
      drawScreen(t, lx, ly)

      /* mug + steam — front-left corner of the platform */
      const mx0 = DOCK_CX - 26 + dOff
      const my0 = DOCK_TOP + 15 + dOffY
      ctx.fillStyle = '#b94663'
      ctx.fillRect(mx0, my0, 8, 7)
      ctx.fillStyle = '#d96a85'
      ctx.fillRect(mx0, my0, 2, 7)
      ctx.fillStyle = '#4a2e24'
      ctx.fillRect(mx0 + 1, my0, 6, 1)
      ctx.fillStyle = '#b94663'
      ctx.fillRect(mx0 + 8, my0 + 2, 1, 3)
      for (let k = 0; k < 2; k++) {
        for (let s = 0; s < 10; s++) {
          const wob = Math.sin(t * 0.002 + k * 2.4 + s * 0.55)
          if (wob > 0.25) {
            ctx.fillStyle = `rgba(244,230,201,${0.5 * (1 - s / 11)})`
            ctx.fillRect(mx0 + 2 + k * 3 + Math.round(wob), my0 - 2 - s, 1, 1)
          }
        }
      }

      /* lantern on the platform's rear-right post — pixel warmth */
      const lnX = DOCK_CX + 31 + dOff
      const lnY = DOCK_TOP - 16 + dOffY
      const pulse = 0.85 + 0.15 * Math.sin(t * 0.0016)
      for (let gy = -6; gy <= 8; gy++) {
        for (let gx = -7; gx <= 7; gx++) {
          const d = Math.sqrt(gx * gx + gy * gy)
          if (d > 2.5 && d < 8 && (8 - d) * 2.2 * pulse > bayerAt(lnX + gx, lnY + gy)) {
            ctx.fillStyle = 'rgba(251,189,47,0.18)'
            ctx.fillRect(lnX + gx, lnY + 2 + gy, 1, 1)
          }
        }
      }
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(lnX - 2, lnY - 1, 5, 1)
      ctx.fillRect(lnX - 2, lnY + 5, 5, 1)
      ctx.fillRect(lnX - 2, lnY, 1, 5)
      ctx.fillRect(lnX + 2, lnY, 1, 5)
      ctx.fillStyle = pulse > 0.95 ? '#ffe9a8' : '#fbbd2f'
      ctx.fillRect(lnX - 1, lnY, 3, 5)
      ctx.fillStyle = '#553a2a'
      ctx.fillRect(lnX - 1, lnY + 6, 3, 10)
      /* lantern reflection — broken gold column */
      for (let y = DOCK_TOP + 4; y < DOCK_TOP + 34; y += 2) {
        if (Math.sin(t * 0.003 + y * 1.9) > 0.4) {
          ctx.fillStyle = 'rgba(251,189,47,0.3)'
          ctx.fillRect(lnX + Math.round(Math.sin(y * 0.8 + t * 0.001) * 2) + 14, y, 1, 1)
        }
      }

      /* --- near banks + reeds --- */
      const rOff = off(11)
      const rOffY = offY(6)
      ctx.fillStyle = '#122824'
      for (let x = 0; x < 95; x++) {
        const yTop = Math.round(bankLeft(x))
        ctx.fillRect(x + rOff, yTop + rOffY, 1, H - yTop)
      }
      for (let x = 385; x < W; x++) {
        const yTop = Math.round(bankRight(x))
        ctx.fillRect(x + rOff, yTop + rOffY, 1, H - yTop)
      }
      for (const rd of reeds) {
        const bx = rd.x + rOff
        const by = rd.y + rOffY
        let bend = Math.sin(t * 0.0011 + rd.ph) * 1.6
        if (mouse.in) {
          const dxm = bx - mouse.x
          const adx = Math.abs(dxm)
          if (adx < 24 && Math.abs(by - rd.h / 2 - mouse.y) < 34) {
            bend += Math.sign(dxm || 1) * (24 - adx) * 0.14
          }
        }
        ctx.fillStyle = rd.c
        for (let i = 0; i < rd.h; i++) {
          ctx.fillRect(bx + Math.round(bend * Math.pow(i / rd.h, 2)), by - i, 1, 1)
        }
        if (rd.tail) {
          ctx.fillStyle = '#6e4b37'
          ctx.fillRect(bx + Math.round(bend) - 1, by - rd.h - 3, 2, 4)
        }
      }

      /* fireflies */
      for (const fl of flies) {
        fl.x += 0.22 * Math.sin(t * 0.0003 * fl.sp + fl.ph)
        fl.y += 0.16 * Math.cos(t * 0.00037 * fl.sp + fl.ph * 2)
        if (mouse.in) {
          const dx2 = mouse.x - fl.x
          const dy2 = mouse.y - 16 - fl.y
          const d = Math.hypot(dx2, dy2)
          if (d < 90 && d > 4) {
            fl.x += (dx2 / d) * 0.5 * (1 - d / 90)
            fl.y += (dy2 / d) * 0.5 * (1 - d / 90)
          }
        }
        if (fl.x < -4) fl.x = W + 4
        if (fl.x > W + 4) fl.x = -4
        fl.y = Math.max(150, Math.min(262, fl.y))
        const pl = 0.5 + 0.5 * Math.sin(t * 0.004 * fl.sp + fl.ph * 5)
        if (pl < 0.22) continue
        const ix = Math.round(fl.x)
        const iy = Math.round(fl.y)
        ctx.fillStyle = `rgba(251,189,47,${0.28 * pl})`
        ctx.fillRect(ix - 1, iy - 1, 3, 3)
        ctx.fillStyle = `rgba(255,233,168,${0.5 + 0.5 * pl})`
        ctx.fillRect(ix, iy, 1, 1)
      }

      raf = requestAnimationFrame(frame)
    }

    let raf
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      frame(6200)
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <section id="top" className="hero scenehero scenehero--pixel" ref={sectionRef}>
      <canvas
        ref={canvasRef}
        className="scenehero__canvas"
        width={W}
        height={H}
        aria-hidden="true"
      />
      <SceneOverlay />
    </section>
  )
}

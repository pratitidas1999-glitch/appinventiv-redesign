/* Shared helpers for the procedural pixel/voxel hero scenes. */

/* deterministic rng so the world is identical on every visit */
export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

export const bayerAt = (x, y) => BAYER[((x % 4) + 4) % 4][((y % 4) + 4) % 4]

export function hexRgb(c) {
  if (c[0] === '#') {
    return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
  }
  /* also accept "rgb(r,g,b)" so shades can be re-shaded */
  return c.match(/\d+/g).map(Number)
}

export function shade(color, f) {
  const [r, g, b] = hexRgb(color)
  const cl = (v) => Math.max(0, Math.min(255, Math.round(v)))
  return `rgb(${cl(r * f)},${cl(g * f)},${cl(b * f)})`
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

/* ordered-dither vertical gradient — the retro sky */
export function paintDitherGradient(ctx, w, h, stops) {
  const img = ctx.createImageData(w, h)
  const d = img.data
  for (let y = 0; y < h; y++) {
    let i = 0
    while (i < stops.length - 1 && stops[i + 1].y <= y) i++
    const a = stops[i]
    const b = stops[Math.min(i + 1, stops.length - 1)]
    const span = Math.max(1, b.y - a.y)
    const f = Math.min(1, Math.max(0, (y - a.y) / span))
    const ca = hexRgb(a.c)
    const cb = hexRgb(b.c)
    for (let x = 0; x < w; x++) {
      const cc = f * 16 > BAYER[x % 4][y % 4] ? cb : ca
      const o = (y * w + x) * 4
      d[o] = cc[0]
      d[o + 1] = cc[1]
      d[o + 2] = cc[2]
      d[o + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

/* rising sun disc with dithered warm halo, clipped at horizonY */
export function drawSun(ctx, sx, sy, horizonY) {
  for (let dy = -26; dy <= 26; dy++) {
    for (let dx = -26; dx <= 26; dx++) {
      const x = sx + dx
      const y = sy + dy
      if (y >= horizonY || x < 0) continue
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= 7) {
        ctx.fillStyle = '#ffe9a8'
        ctx.fillRect(x, y, 1, 1)
      } else if (dist <= 12) {
        ctx.fillStyle = '#fbbd2f'
        ctx.fillRect(x, y, 1, 1)
      } else if (dist <= 24) {
        const t = (dist - 12) / 12
        if ((1 - t) * 16 > bayerAt(x, y)) {
          ctx.fillStyle = t < 0.45 ? '#f0975c' : '#d2604f'
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }
}

/* morning sky ramp — soft daylight teal warming into sunrise gold */
export function dawnStops(horizonY) {
  const H = horizonY
  return [
    { y: 0, c: '#2c6b72' },
    { y: Math.round(H * 0.25), c: '#3a7d80' },
    { y: Math.round(H * 0.5), c: '#569490' },
    { y: Math.round(H * 0.64), c: '#7fb0a0' },
    { y: Math.round(H * 0.76), c: '#ecdcae' },
    { y: Math.round(H * 0.84), c: '#f7c67e' },
    { y: Math.round(H * 0.9), c: '#f79a5b' },
    { y: Math.round(H * 0.95), c: '#f45140' },
    { y: H - 1, c: '#fbbd2f' },
  ]
}

export function makeStars(rnd, w, maxY, n) {
  const stars = []
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.floor(rnd() * w),
      y: Math.floor(rnd() * maxY),
      ph: rnd() * 10,
      sp: 0.0012 + rnd() * 0.002,
      big: rnd() < 0.08,
    })
  }
  return stars
}

export function drawStars(ctx, stars, t) {
  for (const s of stars) {
    /* stars fade toward the horizon (dawn is eating them) */
    const fade = 1 - s.y / 130
    const tw = (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)) * Math.max(0.15, fade)
    if (tw < 0.3) continue
    ctx.fillStyle = tw > 0.7 ? '#fff3d6' : 'rgba(255,243,214,0.5)'
    ctx.fillRect(s.x, s.y, 1, 1)
    if (s.big && tw > 0.65) {
      ctx.fillStyle = 'rgba(255,243,214,0.35)'
      ctx.fillRect(s.x - 1, s.y, 1, 1)
      ctx.fillRect(s.x + 1, s.y, 1, 1)
      ctx.fillRect(s.x, s.y - 1, 1, 1)
      ctx.fillRect(s.x, s.y + 1, 1, 1)
    }
  }
}

/* map a pointer event into internal canvas coords under object-fit: cover */
export function coverPointer(e, canvas, w, h) {
  const r = canvas.getBoundingClientRect()
  const scale = Math.max(r.width / w, r.height / h)
  const ox = (r.width - w * scale) / 2
  const oy = (r.height - h * scale) / 2
  return {
    x: (e.clientX - r.left - ox) / scale,
    y: (e.clientY - r.top - oy) / scale,
  }
}

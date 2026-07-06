import { useEffect, useRef } from 'react'
import SceneOverlay from './SceneOverlay'
import {
  mulberry32,
  makeCanvas,
  paintDitherGradient,
  drawSun,
  dawnStops,
  coverPointer,
  shade,
} from './sceneUtils'

/* =========================================================================
   VOXEL HERO — the same lakeside dawn, as a floating block diorama.
   A voxel lake at golden hour: the far edge carries the built world
   (block towers, windows lit), a wooden dock reaches into the water with
   a laptop running its quiet dashboards, reeds on the near shore.
   Rendered isometrically at 420×236 and upscaled pixelated.

   Interactive: the diorama yaws with the mouse · click the water and a
   wave rolls through the blocks · hovering lifts the water gently ·
   the whole island assembles block-by-block on load.
   ========================================================================= */

const W = 420
const H = 236
const N = 14
const C = (N - 1) / 2
const S = 10 /* block screen size */
const VYH = 7.5 /* vertical unit in px */
const CX = W * 0.6
const CY = 130

export default function VoxelHero() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const rnd = mulberry32(19870615)

    /* ------- backdrop: dawn sky above a dark still horizon ------- */
    const backdrop = makeCanvas(W, H)
    {
      const b = backdrop.getContext('2d')
      paintDitherGradient(b, W, 148, dawnStops(148))
      drawSun(b, 296, 140, 148)
      paintDitherGradient(b, W, H - 148, [
        { y: 0, c: '#2a5d60' },
        { y: 30, c: '#1d474d' },
        { y: H - 149, c: '#16383e' },
      ])
      /* shift lower gradient down */
      const low = b.getImageData(0, 0, W, H - 148)
      b.putImageData(low, 0, 148)
      paintDitherGradient(b, W, 148, dawnStops(148))
      drawSun(b, 386, 134, 148)
    }

    /* ------------------------- world data ------------------------- */
    const blocks = []
    const waterCells = []
    const isCity = (x, z) => z < 2 && x > 2 && x < 13
    const isMountain = (x, z) => x < 2 && z < 2
    const isShore = (x, z) => x < 3 && z > 10

    const dist = (x, z) => Math.hypot(x - C, z - C)

    function add(bl) {
      bl.delay = dist(bl.x, bl.z) * 90 + bl.y * 34 + rnd() * 160
      blocks.push(bl)
    }

    const vary = (hex, amt) => shade(hex, 1 + (rnd() - 0.5) * amt)

    for (let x = 0; x < N; x++) {
      for (let z = 0; z < N; z++) {
        /* floating-island underside rim */
        const onEdge = x === 0 || z === 0 || x === N - 1 || z === N - 1
        if (onEdge) {
          add({ x, y: 0, z, sx: 1, sy: 1, sz: 1, base: vary('#152f33', 0.12), kind: 'rock' })
          if ((x + z) % 3 === 0) {
            add({ x, y: -1, z, sx: 1, sy: 1, sz: 1, base: vary('#10262b', 0.14), kind: 'rock' })
          }
        }

        if (isMountain(x, z)) {
          const hM = 5 - (x + z) * 2 + Math.floor(rnd() * 2)
          for (let y = 1; y <= 2 + hM; y++) {
            const snow = x === 0 && z === 0 && y === 2 + hM
            add({
              x, y, z, sx: 1, sy: 1, sz: 1,
              base: snow ? '#c9beb4' : vary('#1d434a', 0.14),
              kind: 'rock',
            })
          }
          continue
        }

        if (isCity(x, z)) {
          /* stone quay + towers — the far shore, already awake */
          add({ x, y: 1, z, sx: 1, sy: 1, sz: 1, base: vary('#2c4650', 0.1), kind: 'quay' })
          if (rnd() < 0.72) {
            const hT = 2 + Math.floor(rnd() * 5)
            for (let y = 2; y < 2 + hT; y++) {
              add({
                x, y, z, sx: 1, sy: 1, sz: 1,
                base: vary(rnd() < 0.5 ? '#16333d' : '#1b3b47', 0.1),
                kind: 'tower',
                windows: true,
                ph: rnd() * 9,
              })
            }
            if (rnd() < 0.3) {
              add({ x: x + 0.4, y: 2 + hT, z: z + 0.4, sx: 0.2, sy: 0.8, sz: 0.2, base: '#16333d', kind: 'antenna', ph: rnd() * 9 })
            }
          }
          continue
        }

        if (isShore(x, z)) {
          add({ x, y: 1, z, sx: 1, sy: 1, sz: 1, base: vary('#8a795c', 0.1), kind: 'sand' })
          add({ x, y: 2, z, sx: 1, sy: 1, sz: 1, base: vary('#2f6b55', 0.12), kind: 'grass' })
          if (rnd() < 0.4) {
            add({
              x: x + 0.3 + rnd() * 0.3, y: 3, z: z + 0.3 + rnd() * 0.3,
              sx: 0.14, sy: 0.9 + rnd() * 0.7, sz: 0.14,
              base: rnd() < 0.5 ? '#1e4a40' : '#28584a', kind: 'reed', ph: rnd() * 6,
            })
          }
          if (rnd() < 0.3) {
            add({
              x: x + 0.35, y: 3, z: z + 0.35, sx: 0.3, sy: 0.3, sz: 0.3,
              base: rnd() < 0.5 ? '#f25f88' : '#fbbd2f', kind: 'flower',
            })
          }
          continue
        }

        /* water */
        const cell = {
          x, y: 1, z, sx: 1, sy: 1, sz: 1,
          base: vary('#2e7d85', 0.1), kind: 'water',
          ph: rnd() * 6, lift: 0,
        }
        add(cell)
        waterCells.push(cell)
      }
    }

    /* dock: planks from the front edge to mid-lake, on posts */
    for (let z = 13; z >= 9; z--) {
      add({ x: 8.75, y: 2.12, z, sx: 1.5, sy: 0.18, sz: 1, base: vary('#6b4a37', 0.1), kind: 'dock' })
    }
    for (const pz of [9.2, 12.6]) {
      add({ x: 8.6, y: 1.4, z: pz, sx: 0.24, sy: 0.75, sz: 0.24, base: '#553a2a', kind: 'post' })
      add({ x: 10.15, y: 1.4, z: pz, sx: 0.24, sy: 0.75, sz: 0.24, base: '#553a2a', kind: 'post' })
    }
    /* laptop at the dock's end */
    add({ x: 8.75, y: 2.27, z: 9.4, sx: 1.5, sy: 0.12, sz: 1.0, base: '#cbbfa8', kind: 'deck' })
    add({ x: 8.75, y: 2.39, z: 9.3, sx: 1.5, sy: 1.15, sz: 0.12, base: '#243b41', kind: 'screen' })
    /* mug */
    add({ x: 10.45, y: 2.27, z: 9.7, sx: 0.32, sy: 0.36, sz: 0.32, base: '#b94663', kind: 'mug' })
    /* lantern post at dock end */
    add({ x: 10.2, y: 2.27, z: 10.4, sx: 0.2, sy: 1.1, sz: 0.2, base: '#553a2a', kind: 'post' })
    add({ x: 10.12, y: 3.4, z: 10.32, sx: 0.36, sy: 0.4, sz: 0.36, base: '#fbbd2f', kind: 'lantern' })

    /* fireflies (screen-space) */
    const flies = []
    for (let i = 0; i < 9; i++) {
      flies.push({ x: rnd() * W, y: 130 + rnd() * 70, ph: rnd() * 10, sp: 0.6 + rnd() * 0.8 })
    }

    const waves = []
    const mouse = { tx: 0, ty: 0, x: 0, y: 0, in: false }
    let lastT = 0
    let hoverCell = null

    /* chart for the laptop screen face */
    const chartPts = []
    for (let i = 0; i < 12; i++) chartPts.push(0.15 + i * 0.055 + 0.1 * Math.sin(i * 1.2))

    function proj(yaw) {
      const vx = { x: Math.cos(yaw) * S, y: Math.sin(yaw) * S * 0.5 }
      const vz = { x: -Math.sin(yaw) * S, y: Math.cos(yaw) * S * 0.5 }
      const ox = CX - C * (vx.x + vz.x)
      const oy = CY - C * (vx.y + vz.y)
      return { vx, vz, ox, oy }
    }

    function P(pr, fx, fy, fz) {
      return {
        x: pr.ox + fx * pr.vx.x + fz * pr.vz.x,
        y: pr.oy + fx * pr.vx.y + fz * pr.vz.y - fy * VYH,
      }
    }

    function poly(pts, fill) {
      ctx.fillStyle = fill
      ctx.beginPath()
      ctx.moveTo(Math.round(pts[0].x), Math.round(pts[0].y))
      for (let i = 1; i < pts.length; i++) ctx.lineTo(Math.round(pts[i].x), Math.round(pts[i].y))
      ctx.closePath()
      ctx.fill()
    }

    function drawBlock(pr, b, t, lift) {
      const x0 = b.x
      const z0 = b.z
      const y0 = b.y + (lift || 0)
      const x1 = x0 + b.sx
      const y1 = y0 + b.sy
      const z1 = z0 + b.sz
      let topC = shade(b.base, 1.18)
      const rightC = shade(b.base, 0.8)
      const frontC = shade(b.base, 0.6)

      if (b.kind === 'water') {
        /* breathing light on the surface + sunrise sparkle toward the back-right */
        const breathe = 1.1 + 0.12 * Math.sin(t * 0.0011 + b.ph)
        topC = shade(b.base, breathe)
      }
      if (b.kind === 'lantern') {
        topC = '#ffe9a8'
      }

      const t0 = P(pr, x0, y1, z0)
      const t1 = P(pr, x1, y1, z0)
      const t2 = P(pr, x1, y1, z1)
      const t3 = P(pr, x0, y1, z1)
      poly([t0, t1, t2, t3], topC)
      /* +x face */
      poly([t1, t2, P(pr, x1, y0, z1), P(pr, x1, y0, z0)], rightC)
      /* +z face */
      poly([t3, t2, P(pr, x1, y0, z1), P(pr, x0, y0, z1)], frontC)

      /* extras per kind */
      if (b.kind === 'water') {
        const gate = Math.sin(t * 0.0032 + b.ph * 4 + b.x * 1.3) + (b.x / N) * 0.9 - (b.z / N) * 0.4
        if (gate > 1.05) {
          const cpt = P(pr, x0 + 0.3 + 0.4 * Math.sin(b.ph + t * 0.001), y1, z0 + 0.5)
          ctx.fillStyle = gate > 1.35 ? '#ffe9a8' : '#fbbd2f'
          ctx.fillRect(Math.round(cpt.x), Math.round(cpt.y), gate > 1.5 ? 2 : 1, 1)
        }
      }
      if (b.windows) {
        /* lit windows on the +z face */
        for (let wy = 0.2; wy < 0.9; wy += 0.35) {
          for (let wx = 0.2; wx < 0.9; wx += 0.3) {
            const on = Math.sin(t * 0.00035 + b.ph * 3 + wx * 9 + wy * 7) > -0.3
            if (!on) continue
            const wpt = P(pr, x0 + wx, y0 + wy, z1)
            ctx.fillStyle = (wx + wy) % 0.6 < 0.3 ? '#fbbd2f' : '#e8a25c'
            ctx.fillRect(Math.round(wpt.x), Math.round(wpt.y), 1, 1)
          }
        }
      }
      if (b.kind === 'antenna') {
        if (Math.sin(t * 0.0025 + b.ph) > 0.55) {
          const bp = P(pr, x0 + b.sx / 2, y1 + 0.15, z0 + b.sz / 2)
          ctx.fillStyle = '#f25f88'
          ctx.fillRect(Math.round(bp.x), Math.round(bp.y), 1, 1)
        }
      }
      if (b.kind === 'screen') {
        /* dashboard on the +z face */
        const TL = P(pr, x0, y1, z1)
        const TR = P(pr, x1, y1, z1)
        const BL = P(pr, x0, y0, z1)
        const pt = (u, v) => ({
          x: TL.x + (TR.x - TL.x) * u + (BL.x - TL.x) * v,
          y: TL.y + (TR.y - TL.y) * u + (BL.y - TL.y) * v,
        })
        /* display fill */
        poly([pt(0.06, 0.08), pt(0.94, 0.08), pt(0.94, 0.92), pt(0.06, 0.92)], '#0c242b')
        const cycle = t % 12000
        const reveal = Math.min(chartPts.length, Math.floor(cycle / 380))
        for (let i = 0; i < reveal; i++) {
          const p2 = pt(0.12 + i * 0.06, 0.78 - chartPts[i])
          ctx.fillStyle = '#fbbd2f'
          ctx.fillRect(Math.round(p2.x), Math.round(p2.y), 1, 1)
        }
        if (reveal > 0 && reveal < chartPts.length && Math.floor(t / 300) % 2 === 0) {
          const p2 = pt(0.12 + (reveal - 1) * 0.06, 0.78 - chartPts[reveal - 1])
          ctx.fillStyle = '#ffe9a8'
          ctx.fillRect(Math.round(p2.x) - 1, Math.round(p2.y) - 1, 2, 2)
        }
        const hdr = pt(0.12, 0.16)
        ctx.fillStyle = '#f45140'
        ctx.fillRect(Math.round(hdr.x), Math.round(hdr.y), 2, 1)
        if (cycle > 9000) {
          const ck = pt(0.8, 0.24)
          ctx.fillStyle = '#7fb6a0'
          ctx.fillRect(Math.round(ck.x), Math.round(ck.y), 2, 2)
        }
      }
      if (b.kind === 'lantern') {
        const cpt = P(pr, x0 + b.sx / 2, y0 + b.sy / 2, z0 + b.sz / 2)
        const pulse = 0.8 + 0.2 * Math.sin(t * 0.0016)
        const g = ctx.createRadialGradient(cpt.x, cpt.y, 1, cpt.x, cpt.y, 12)
        g.addColorStop(0, `rgba(251,189,47,${0.34 * pulse})`)
        g.addColorStop(1, 'rgba(251,189,47,0)')
        ctx.fillStyle = g
        ctx.fillRect(cpt.x - 12, cpt.y - 12, 24, 24)
      }
    }

    function onMove(e) {
      const p = coverPointer(e, canvas, W, H)
      mouse.tx = p.x
      mouse.ty = p.y
      mouse.in = true
    }
    function onLeave() {
      mouse.in = false
      mouse.tx = W / 2
      mouse.ty = H / 2
    }
    function onClick(e) {
      const p = coverPointer(e, canvas, W, H)
      /* nearest water cell to the click */
      const yaw = currentYaw
      const pr = proj(yaw)
      let best = null
      let bestD = 18
      for (const wc of waterCells) {
        const c2 = P(pr, wc.x + 0.5, wc.y + 1, wc.z + 0.5)
        const d = Math.hypot(c2.x - p.x, c2.y - p.y)
        if (d < bestD) {
          bestD = d
          best = wc
        }
      }
      if (best) waves.push({ wx: best.x, wz: best.z, t0: lastT })
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('click', onClick)

    let currentYaw = Math.PI / 4
    let raf
    let startT = null

    function frame(t) {
      if (startT === null) startT = t
      const life = t - startT
      lastT = t
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const nx = (mouse.x / W - 0.5) * 2
      const yawTarget = Math.PI / 4 + nx * 0.16
      currentYaw += (yawTarget - currentYaw) * 0.06
      const pr = proj(currentYaw)

      ctx.drawImage(backdrop, 0, 0)

      /* hover: find water cell under cursor */
      hoverCell = null
      if (mouse.in) {
        let bestD = 14
        for (const wc of waterCells) {
          const c2 = P(pr, wc.x + 0.5, wc.y + 1, wc.z + 0.5)
          const d = Math.hypot(c2.x - mouse.x, c2.y - mouse.y)
          if (d < bestD) {
            bestD = d
            hoverCell = wc
          }
        }
      }

      /* depth sort (yaw changes every frame) */
      const sorted = blocks.slice().sort((a, b) => {
        const ka = a.x * pr.vx.y + a.z * pr.vz.y
        const kb = b.x * pr.vx.y + b.z * pr.vz.y
        return ka - kb || a.y - b.y
      })

      for (const b of sorted) {
        /* assembly: blocks drop in */
        let lift = 0
        const e = Math.min(1, Math.max(0, (life - b.delay) / 650))
        if (e <= 0) continue
        const f = 1 - Math.pow(1 - e, 3)
        lift += (1 - f) * 24

        if (b.kind === 'water') {
          lift += 0.1 * Math.sin(t * 0.0012 + (b.x + b.z) * 0.7)
          for (const wv of waves) {
            const d = Math.hypot(b.x - wv.wx, b.z - wv.wz)
            const phase = (t - wv.t0) * 0.006 - d * 0.85
            if (phase > 0 && phase < Math.PI) {
              lift += 0.5 * Math.sin(phase) * Math.max(0, 1 - d * 0.12)
            }
          }
          const target = b === hoverCell ? 0.22 : 0
          b.lift += (target - b.lift) * 0.15
          lift += b.lift
        }
        if (b.kind === 'reed') {
          /* sway */
          b.swayX = 0.06 * Math.sin(t * 0.0013 + b.ph)
          const sx0 = b.x
          b.x = sx0 + b.swayX
          drawBlock(pr, b, t, lift)
          b.x = sx0
          continue
        }
        drawBlock(pr, b, t, lift)
      }
      /* drop finished waves */
      for (let i = waves.length - 1; i >= 0; i--) {
        if (t - waves[i].t0 > 6000) waves.splice(i, 1)
      }

      /* fireflies */
      for (const fl of flies) {
        fl.x += 0.2 * Math.sin(t * 0.0003 * fl.sp + fl.ph)
        fl.y += 0.15 * Math.cos(t * 0.00037 * fl.sp + fl.ph * 2)
        if (mouse.in) {
          const dx2 = mouse.x - fl.x
          const dy2 = mouse.y - 14 - fl.y
          const d = Math.hypot(dx2, dy2)
          if (d < 80 && d > 4) {
            fl.x += (dx2 / d) * 0.45 * (1 - d / 80)
            fl.y += (dy2 / d) * 0.45 * (1 - d / 80)
          }
        }
        fl.y = Math.max(110, Math.min(210, fl.y))
        if (fl.x < -4) fl.x = W + 4
        if (fl.x > W + 4) fl.x = -4
        const pl = 0.5 + 0.5 * Math.sin(t * 0.004 * fl.sp + fl.ph * 5)
        if (pl < 0.25) continue
        const ix = Math.round(fl.x)
        const iy = Math.round(fl.y)
        ctx.fillStyle = `rgba(251,189,47,${0.26 * pl})`
        ctx.fillRect(ix - 1, iy - 1, 3, 3)
        ctx.fillStyle = `rgba(255,233,168,${0.5 + 0.5 * pl})`
        ctx.fillRect(ix, iy, 1, 1)
      }

      raf = requestAnimationFrame(frame)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      startT = -9000
      frame(0)
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
    <section id="top" className="hero scenehero scenehero--voxel" ref={sectionRef}>
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

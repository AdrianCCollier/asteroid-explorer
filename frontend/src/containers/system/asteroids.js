// Stars generated once at module scope — stable across resizes
const STARS = Array.from({ length: 420 }, () => ({
  x: Math.random(),
  y: Math.random(),
  radius: 0.2 + Math.random() * 1.6,
  twinkleOffset: Math.random() * Math.PI * 2,
  twinkleSpeed: 0.04 + Math.random() * 0.08,
  brightness: 0.25 + Math.random() * 0.75,
  color: Math.random() < 0.12
    ? (Math.random() < 0.5 ? '#b0d8ff' : '#ffe8c0')
    : '#ffffff',
}))

// Static dust particles (tiny, no animation)
const DUST = Array.from({ length: 200 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.3 + Math.random() * 0.6,
  a: 0.04 + Math.random() * 0.12,
}))

// Nebula cloud definitions
const NEBULA_CLOUDS = [
  { cx: 0.78, cy: 0.22, r: 0.32, color: '70,0,140',   alpha: 0.055 },
  { cx: 0.52, cy: 0.72, r: 0.26, color: '0,50,120',   alpha: 0.045 },
  { cx: 0.10, cy: 0.38, r: 0.22, color: '0,90,70',    alpha: 0.038 },
  { cx: 0.65, cy: 0.05, r: 0.18, color: '20,60,160',  alpha: 0.04  },
]

// time increases by 0.25/frame @ ~60fps  ≈  15 units/sec
// Speed reference:
//   0.08  ×15  ≈ 1.2 rad/sec ≈ 0.19 Hz  (stars)
//   0.12  ×15  ≈ 1.8 rad/sec ≈ 0.29 Hz  (ship bob)
//   0.15  ×15  ≈ 2.3 rad/sec ≈ 0.36 Hz  (asteroid glow base)
//   0.20  ×15  ≈ 3.0 rad/sec ≈ 0.48 Hz  (pulse ring)

const ASTEROID_DEFS = [
  { src: './assets/Ryugu.png',    name: 'Ryugu',  levelIndex: 0, x: 0.30, y: 0.60, scale: 15,   depth: 0.75, glowPhaseOffset: 0,   difficulty: 1 },
  { src: './assets/Vesta.png',    name: 'Vesta',  levelIndex: 1, x: 0.50, y: 0.26, scale: 2.5,  depth: 0.9,  glowPhaseOffset: 1.2, difficulty: 2 },
  { src: './assets/16Psyche.png', name: 'Psyche', levelIndex: 2, x: 0.62, y: 0.42, scale: 2.75, depth: 1.0,  glowPhaseOffset: 2.4, difficulty: 3 },
  { src: './assets/Ceres.png',    name: 'Ceres',  levelIndex: 3, x: 0.84, y: 0.52, scale: 1.8,  depth: 0.85, glowPhaseOffset: 0.8, difficulty: 4 },
]

const LABEL_COLORS = ['#00d2ff', '#7ec8ff', '#a0ffe8', '#ff8c5a']

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
  })
}

// ─── Nebula clouds ────────────────────────────────────────────────────────────
function drawNebula(ctx, w, h) {
  ctx.save()
  NEBULA_CLOUDS.forEach(({ cx, cy, r, color, alpha }) => {
    const x = w * cx
    const y = h * cy
    const radius = Math.min(w, h) * r
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, `rgba(${color},${alpha})`)
    grad.addColorStop(0.5, `rgba(${color},${alpha * 0.4})`)
    grad.addColorStop(1, `rgba(${color},0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  })
  ctx.restore()
}

// ─── Starfield ────────────────────────────────────────────────────────────────
function drawStarfield(ctx, w, h, time) {
  ctx.save()

  // Static dust layer
  DUST.forEach(d => {
    ctx.globalAlpha = d.a
    ctx.fillStyle = '#c8e0ff'
    ctx.beginPath()
    ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2)
    ctx.fill()
  })

  // Twinkling stars
  STARS.forEach(star => {
    const alpha = star.brightness * (0.35 + 0.65 * ((Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2))
    ctx.globalAlpha = alpha
    ctx.fillStyle = star.color
    ctx.beginPath()
    ctx.arc(star.x * w, star.y * h, star.radius, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.globalAlpha = 1
  ctx.restore()
}

// ─── Path Lines ───────────────────────────────────────────────────────────────
function drawPathLines(ctx, w, h, bossKills, time) {
  const nodes = [
    { x: w / 9, y: h / 2 },
    ...ASTEROID_DEFS.map(a => ({ x: w * a.x, y: h * a.y })),
  ]

  ctx.save()
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i]
    const to   = nodes[i + 1]

    if (i < bossKills) {
      // Completed — solid double-pass glow
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#00d2ff'
      ctx.lineWidth = 7
      ctx.setLineDash([])
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke()

      ctx.globalAlpha = 0.7
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke()

    } else if (i === bossKills) {
      // Active — marching dashes
      ctx.globalAlpha = 0.9
      ctx.strokeStyle = 'rgba(0, 220, 255, 0.85)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 6])
      ctx.lineDashOffset = -(time * 0.7) % 14
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke()
      ctx.setLineDash([])

      // Directional arrow at midpoint
      const midX = (from.x + to.x) / 2
      const midY = (from.y + to.y) / 2
      const angle = Math.atan2(to.y - from.y, to.x - from.x)
      ctx.save()
      ctx.translate(midX, midY)
      ctx.rotate(angle)
      ctx.globalAlpha = 0.75
      ctx.fillStyle = 'rgba(0, 220, 255, 0.9)'
      ctx.beginPath()
      ctx.moveTo(-5, -3.5)
      ctx.lineTo(5, 0)
      ctx.lineTo(-5, 3.5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

    } else {
      // Locked — dim static dashes
      ctx.globalAlpha = 0.18
      ctx.strokeStyle = 'rgba(90, 100, 130, 0.9)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 9])
      ctx.lineDashOffset = 0
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke()
      ctx.setLineDash([])
    }
  }
  ctx.globalAlpha = 1
  ctx.restore()
}

// ─── Level Badge ─────────────────────────────────────────────────────────────
function drawLevelBadge(ctx, px, py, size, index, isCompleted, isLocked, isCurrent) {
  const bx = px + size / 2 + Math.max(6, size * 0.08)
  const by = py - size / 2 + Math.max(6, size * 0.08)
  const r  = Math.max(10, Math.min(16, size * 0.18))

  ctx.save()

  if (isLocked)          ctx.fillStyle = 'rgba(30, 35, 60, 0.92)'
  else if (isCompleted)  ctx.fillStyle = 'rgba(0, 160, 80, 0.92)'
  else if (isCurrent)    ctx.fillStyle = 'rgba(0, 80, 160, 0.92)'
  else                   ctx.fillStyle = 'rgba(0, 40, 80, 0.92)'

  ctx.beginPath()
  ctx.arc(bx, by, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.lineWidth = 1.5
  if (isLocked)          ctx.strokeStyle = 'rgba(80, 90, 130, 0.6)'
  else if (isCompleted)  ctx.strokeStyle = 'rgba(0, 255, 130, 0.7)'
  else if (isCurrent)    ctx.strokeStyle = 'rgba(0, 210, 255, 0.9)'
  else                   ctx.strokeStyle = 'rgba(0, 150, 200, 0.5)'
  ctx.stroke()

  ctx.font = `bold ${Math.round(r * 0.9)}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (isLocked) {
    ctx.fillStyle = 'rgba(120, 130, 160, 0.9)'
    ctx.fillText('\u{1F512}', bx, by)
  } else if (isCompleted) {
    ctx.fillStyle = '#ffffff'
    ctx.fillText('\u2713', bx, by)
  } else if (index === 3) {
    ctx.font = `bold ${Math.round(r * 0.7)}px monospace`
    ctx.fillStyle = '#ffaa00'
    ctx.fillText('!', bx, by)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillText(String(index + 1), bx, by)
  }

  ctx.restore()

  // "BOSS" tag for Ceres
  if (index === 3 && !isLocked) {
    const tagW = 36, tagH = 14
    const tx = px + size / 2 - tagW / 2
    const ty = py + size / 2 + 6

    ctx.save()
    ctx.fillStyle = 'rgba(180, 50, 0, 0.9)'
    ctx.beginPath()
    ctx.roundRect(tx, ty, tagW, tagH, 3)
    ctx.fill()
    ctx.font = 'bold 9px monospace'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = '0.12em'
    ctx.fillText('BOSS', tx + tagW / 2, ty + tagH / 2)
    ctx.restore()
  }
}

// ─── Always-visible asteroid name tag ────────────────────────────────────────
function drawAsteroidNameTag(ctx, px, py, size, name, color, isLocked, isCurrent, time) {
  ctx.save()

  const pulse = isCurrent ? (0.55 + 0.45 * ((Math.sin(time * 0.15) + 1) / 2)) : 1
  ctx.globalAlpha = isLocked ? 0.22 : 0.65 * pulse

  const label = name.toUpperCase()
  ctx.font = 'bold 11px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  const textW = ctx.measureText(label).width
  const lx = px
  const ly = py + size / 2 + (isCurrent ? 28 : 22)

  // Underline / scan line
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.globalAlpha = isLocked ? 0.12 : 0.28 * pulse
  ctx.beginPath()
  ctx.moveTo(lx - textW / 2 - 4, ly - 3)
  ctx.lineTo(lx + textW / 2 + 4, ly - 3)
  ctx.stroke()

  ctx.globalAlpha = isLocked ? 0.22 : 0.65 * pulse
  ctx.fillStyle = color
  ctx.shadowBlur = isCurrent ? 8 : 0
  ctx.shadowColor = color
  ctx.fillText(label, lx, ly)

  ctx.restore()
}

// ─── Pulsing ring around active level ────────────────────────────────────────
function drawCurrentRing(ctx, px, py, radius, time) {
  const pulse = (Math.sin(time * 0.20) + 1) / 2

  ctx.save()
  ctx.shadowBlur = 16
  ctx.shadowColor = 'rgba(0, 255, 200, 0.55)'
  ctx.strokeStyle = `rgba(0, 255, 200, ${0.38 + 0.4 * pulse})`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(px, py, radius + 6 + pulse * 5, 0, Math.PI * 2)
  ctx.stroke()

  ctx.shadowBlur = 0
  ctx.strokeStyle = `rgba(0, 255, 200, ${0.1 + 0.12 * pulse})`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(px, py, radius + 14 + pulse * 5, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

// ─── Ship indicator ───────────────────────────────────────────────────────────
function drawShipIndicator(ctx, w, h, shipImages, time, bossKills) {
  const frames = shipImages.filter(Boolean)
  if (frames.length === 0) return

  const frameIndex = Math.floor(time / 6) % Math.max(1, frames.length)
  const img = frames[frameIndex]
  if (!img) return

  let px, py
  if (bossKills === 0) {
    px = w / 9 + 52
    py = h / 2 - 70
  } else {
    const asteroid = ASTEROID_DEFS[Math.min(bossKills - 1, ASTEROID_DEFS.length - 1)]
    const size = 256 / asteroid.scale
    px = w * asteroid.x + size / 2 + 14
    py = h * asteroid.y - size / 2 - 28
  }

  py += Math.sin(time * 0.12) * 4

  ctx.save()
  ctx.shadowBlur = 16
  ctx.shadowColor = 'rgba(0, 210, 255, 0.7)'
  ctx.drawImage(img, px, py, 44, 44)
  ctx.restore()
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
function drawVignette(ctx, w, h) {
  ctx.save()
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, Math.max(w, h) * 0.78)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  grad.addColorStop(1, 'rgba(0, 0, 10, 0.72)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

// ─── Scanlines ────────────────────────────────────────────────────────────────
function drawScanlines(ctx, w, h) {
  ctx.save()
  ctx.globalAlpha = 0.018
  ctx.fillStyle = '#000000'
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2)
  }
  ctx.globalAlpha = 1
  ctx.restore()
}

// ─── HUD (bottom of screen, clears header zone) ───────────────────────────────
function drawHUD(ctx, w, h, bossKills) {
  ctx.save()
  ctx.font = '10px monospace'

  const y = h - 18

  // Bottom-left: sector
  ctx.globalAlpha = 0.38
  ctx.fillStyle = '#00d2ff'
  ctx.textAlign = 'left'
  ctx.fillText('SYS: INNER BELT SECTOR', 16, y)

  // Bottom-right: mission progress
  ctx.textAlign = 'right'
  ctx.fillText(`MISSIONS CLEARED: ${bossKills} / 4`, w - 16, y)

  // Bottom-center: select prompt
  ctx.globalAlpha = 0.32
  ctx.font = 'bold 10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('\u25c4  SELECT DESTINATION  \u25ba', w / 2, y)

  ctx.globalAlpha = 1
  ctx.restore()
}

// ─── Main animation loop ──────────────────────────────────────────────────────
function runMapAnimation(ctx, w, h, images, shipImages, bgImg, earthImg, mapStateRef) {
  let time = 0
  let frameId

  const draw = () => {
    const bossKills    = mapStateRef.current.bossKills
    const hoveredIndex = mapStateRef.current.hoveredIndex

    // 1. Background
    ctx.drawImage(bgImg, 0, 0, w, h)

    // 2. Nebula clouds (behind stars)
    drawNebula(ctx, w, h)

    // 3. Stars + dust
    drawStarfield(ctx, w, h, time)

    // 4. Earth
    ctx.drawImage(earthImg, w / 9 - 128, h / 2 - 128, 256, 256)

    // 5. Path lines
    drawPathLines(ctx, w, h, bossKills, time)

    // 6. Asteroids
    images.forEach((img, index) => {
      if (!img) return
      const asteroid    = ASTEROID_DEFS[index]
      const size        = 256 / asteroid.scale
      const px          = w * asteroid.x
      const py          = h * asteroid.y
      const isLocked    = asteroid.levelIndex > bossKills
      const isCompleted = asteroid.levelIndex < bossKills
      const isCurrent   = asteroid.levelIndex === bossKills
      const isHovered   = hoveredIndex === index && !isLocked

      const oscillation = (Math.sin(time * 0.15 * asteroid.depth + asteroid.glowPhaseOffset) + 1) / 2

      if (isCurrent) {
        drawCurrentRing(ctx, px, py, size / 2, time)
      }

      ctx.save()

      if (isLocked) {
        ctx.filter = 'grayscale(85%) brightness(38%)'
      }

      const baseGlow = isHovered
        ? 40 + 8 * oscillation
        : (0.3 + 0.7 * oscillation) * 18 * asteroid.depth

      // Outer soft bloom
      ctx.shadowBlur  = baseGlow * 2.8
      ctx.shadowColor = isHovered
        ? 'rgba(0, 255, 210, 0.18)'
        : `rgba(0, 180, 255, ${0.12 * asteroid.depth})`
      ctx.drawImage(img, px - size / 2, py - size / 2, size, size)

      // Mid bloom
      ctx.shadowBlur  = baseGlow * 1.3
      ctx.shadowColor = isHovered
        ? 'rgba(0, 255, 210, 0.45)'
        : `rgba(0, 210, 255, ${0.32 * asteroid.depth})`
      ctx.drawImage(img, px - size / 2, py - size / 2, size, size)

      // Close bright edge
      ctx.shadowBlur  = baseGlow * 0.55
      ctx.shadowColor = isHovered
        ? 'rgba(140, 255, 230, 0.9)'
        : `rgba(150, 230, 255, ${0.58 * asteroid.depth})`
      ctx.drawImage(img, px - size / 2, py - size / 2, size, size)

      ctx.restore()

      // Level badge
      drawLevelBadge(ctx, px, py, size, index, isCompleted, isLocked, isCurrent)

      // Always-visible name tag
      drawAsteroidNameTag(ctx, px, py, size, asteroid.name, LABEL_COLORS[index], isLocked, isCurrent, time)

      // Hover pill label
      if (isHovered) {
        ctx.save()
        ctx.shadowBlur = 0
        ctx.filter     = 'none'

        const num    = `0${index + 1}`.slice(-2)
        const label  = `ZONE ${num} \u2014 ${asteroid.name.toUpperCase()}`
        ctx.font     = 'bold 12px monospace'
        const textW  = ctx.measureText(label).width
        const lx     = px
        const ly     = py - size / 2 - 26

        ctx.fillStyle = 'rgba(0, 8, 24, 0.9)'
        ctx.beginPath()
        ctx.roundRect(lx - textW / 2 - 10, ly - 14, textW + 20, 20, 5)
        ctx.fill()

        ctx.strokeStyle = `${LABEL_COLORS[index]}88`
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle   = LABEL_COLORS[index]
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.shadowBlur  = 6
        ctx.shadowColor = LABEL_COLORS[index]
        ctx.fillText(label, lx, ly)

        ctx.restore()
      }
    })

    // 7. Ship indicator
    drawShipIndicator(ctx, w, h, shipImages, time, bossKills)

    // 8. Vignette
    drawVignette(ctx, w, h)

    // 9. Scanlines
    drawScanlines(ctx, w, h)

    // 10. HUD (bottom strip, clear of header)
    drawHUD(ctx, w, h, bossKills)

    time += 0.25
    frameId = requestAnimationFrame(draw)
  }

  frameId = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(frameId)
}

// ─── Entry point ──────────────────────────────────────────────────────────────
async function drawAsteroids(ctx, canvasH, canvasW, mapStateRef) {
  const [bgImg, earthImg, ...rest] = await Promise.all([
    loadImage('./assets/Background.jpg'),
    loadImage('./assets/Earth.png'),
    ...ASTEROID_DEFS.map(a => loadImage(a.src)),
    loadImage('./assets/Ship_Flying1.png'),
    loadImage('./assets/Ship_Flying2.png'),
    loadImage('./assets/Ship_Flying3.png'),
  ])

  const asteroidImages = rest.slice(0, 4)
  const shipImages     = rest.slice(4, 7)

  return runMapAnimation(ctx, canvasW, canvasH, asteroidImages, shipImages, bgImg, earthImg, mapStateRef)
}

export default drawAsteroids

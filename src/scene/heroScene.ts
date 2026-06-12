import {
  CanvasTexture,
  Clock,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Plane,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * Hero accent: a live seating chart, the thing a ticket-resale monitor
 * actually watches. Three tiers (floor, mezzanine, balcony) stack above a
 * stage bar on one strict column grid, rendered dead flat and front-on so
 * every seat is a crisp, axis-aligned packet mark — the site's brand
 * square. The market runs continuously: listings pop in mid blue, a
 * polling sweep brushes each tier, and every few seconds a contiguous run
 * of seats gets sniped — it flashes, then settles deep navy. The pointer
 * is demand: seats under it swell and warm.
 *
 * The canvas is hidden below 64rem; the loop pauses when the tab is hidden
 * or the hero scrolls away; reduced-motion gets a composed still frame. A
 * stats hook reports real numbers from the simulation for the DOM ticker.
 */

const PALETTE = {
  empty: 0xe7ecf2, // bare seat: one quiet tone, no noise
  listed: 0x8fb8e0, // mid sky: inventory on the market
  grabbed: 0x24416b, // deep navy: ours now
  flash: 0x5b9bd5, // the moment of the catch
  heat: 0x5b9bd5, // demand under the cursor: the same clear blue, stronger
  stage: 0x14181f, // ink, used at very low opacity
  panel: 0xf3f6fa, // tier card fill, like the site's cards
  panelEdge: 0xdde4ec, // tier card hairline
}

/** the venue: tiers of rows stacked over the stage, one shared column grid
    with a center aisle splitting each tier into two banks */
const COLS = 12
const COL_PITCH = 0.5
const ROW_PITCH = 0.5
const SEAT_SIZE = 0.36
const AISLE = 0.45
const TIERS = [
  { rows: 4, y0: 1.05, label: 'FLOOR' },
  { rows: 3, y0: 3.85, label: 'MEZZANINE' },
  { rows: 3, y0: 6.15, label: 'BALCONY' },
]
const SEAT_COUNT = TIERS.reduce((n, tier) => n + tier.rows * COLS, 0)

const enum SeatState {
  Empty,
  Listed,
  Grabbed,
}

interface Seat {
  state: SeatState
  x: number
  y: number
  /** boot reveal delay, seconds */
  revealAt: number
  /** scale pulse animation clock, -1 when idle */
  pulseT: number
  /** when a grabbed seat releases back to the market (elapsed seconds) */
  releaseAt: number
  /** current displayed color, eased toward target every frame */
  color: Color
  /** cursor demand 0..1, eased */
  heat: number
  /** sweep highlight 0..1, decays */
  sweep: number
  tier: number
  row: number
  col: number
}

export interface HeroSceneStats {
  /** seats currently listed on the market */
  listings: number
  /** seats grabbed since boot */
  grabbed: number
}

export interface HeroSceneHooks {
  onStats?: (stats: HeroSceneStats) => void
}

export function initHeroScene(canvas: HTMLCanvasElement, hooks: HeroSceneHooks = {}): () => void {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  // straight-on orthographic: the chart is a flat graphic, not a 3D set.
  // Framed so the chart sits between the header and the stats row.
  const CY = 2.87 // vertical center of the composition
  const FRUSTUM = 6.0
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 50)
  camera.position.set(0, CY, 10)
  camera.lookAt(0, CY, 0)

  const group = new Group()
  scene.add(group)

  /* ---- seats on the grid, two banks per tier around the aisle ---- */
  const seats: Seat[] = []
  const xLeft = -((COLS - 1) * COL_PITCH + AISLE) / 2
  const seatX = (c: number) => xLeft + c * COL_PITCH + (c >= COLS / 2 ? AISLE : 0)
  TIERS.forEach((tier, t) => {
    for (let r = 0; r < tier.rows; r++) {
      for (let c = 0; c < COLS; c++) {
        seats.push({
          state: Math.random() < 0.42 ? SeatState.Listed : SeatState.Empty,
          x: seatX(c),
          y: tier.y0 + r * ROW_PITCH,
          revealAt: 0.1 + t * 0.22 + r * 0.07 + c * 0.018,
          pulseT: -1,
          releaseAt: Infinity,
          color: new Color(PALETTE.empty),
          heat: 0,
          sweep: 0,
          tier: t,
          row: r,
          col: c,
        })
      }
    }
  })
  // some seats start already grabbed, so the navy reads immediately
  for (const seat of seats) {
    if (seat.state === SeatState.Listed && Math.random() < 0.16) {
      seat.state = SeatState.Grabbed
      seat.releaseAt = 8 + Math.random() * 20
    }
  }
  const tierStart = (t: number) =>
    TIERS.slice(0, t).reduce((n, tier) => n + tier.rows * COLS, 0)

  /* ---- seat geometry: the packet mark, flat and axis-aligned ---- */
  const roundedSquare = (() => {
    const half = SEAT_SIZE / 2
    const radius = SEAT_SIZE * 0.28
    const shape = new Shape()
    shape.moveTo(-half + radius, -half)
    shape.lineTo(half - radius, -half)
    shape.quadraticCurveTo(half, -half, half, -half + radius)
    shape.lineTo(half, half - radius)
    shape.quadraticCurveTo(half, half, half - radius, half)
    shape.lineTo(-half + radius, half)
    shape.quadraticCurveTo(-half, half, -half, half - radius)
    shape.lineTo(-half, -half + radius)
    shape.quadraticCurveTo(-half, -half, -half + radius, -half)
    return new ShapeGeometry(shape, 8)
  })()

  const seatMat = new MeshBasicMaterial({ color: 0xffffff })
  const mesh = new InstancedMesh(roundedSquare, seatMat, SEAT_COUNT)
  mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  mesh.frustumCulled = false
  group.add(mesh)

  const stateColor = {
    [SeatState.Empty]: new Color(PALETTE.empty),
    [SeatState.Listed]: new Color(PALETTE.listed),
    [SeatState.Grabbed]: new Color(PALETTE.grabbed),
  }
  const flashColor = new Color(PALETTE.flash)
  const heatColor = new Color(PALETTE.heat)
  const tmpColor = new Color()

  /* ---- shared rounded-rect builder for panels and the stage bar ---- */
  const disposables: Array<{ dispose: () => void }> = []
  const roundedRect = (w: number, h: number, r: number) => {
    const shape = new Shape()
    shape.moveTo(-w / 2 + r, -h / 2)
    shape.lineTo(w / 2 - r, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    shape.lineTo(w / 2, h / 2 - r)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    shape.lineTo(-w / 2 + r, h / 2)
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
    shape.lineTo(-w / 2, -h / 2 + r)
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
    return new ShapeGeometry(shape, 8)
  }
  const addRect = (
    w: number,
    h: number,
    r: number,
    color: number,
    opacity: number,
    x: number,
    y: number,
    z: number,
  ) => {
    const geo = roundedRect(w, h, r)
    const mat = new MeshBasicMaterial({ color, transparent: true, opacity })
    const m = new Mesh(geo, mat)
    m.position.set(x, y, z)
    group.add(m)
    disposables.push(geo, mat)
    return m
  }

  /* ---- mono labels, drawn once to canvas textures in the site's font ---- */
  const addLabel = (text: string, x: number, y: number, opacity: number, anchorLeft = true) => {
    const px = 96 // glyph size on the texture; world height stays small
    const pad = 24
    const measure = document.createElement('canvas').getContext('2d')!
    measure.font = `600 ${px}px "JetBrains Mono", ui-monospace, monospace`
    const textW = measure.measureText(text).width + text.length * px * 0.14
    const cw = Math.ceil(textW + pad * 2)
    const ch = Math.ceil(px * 1.5)
    const c2d = document.createElement('canvas')
    c2d.width = cw
    c2d.height = ch
    const ctx = c2d.getContext('2d')!
    ctx.font = `600 ${px}px "JetBrains Mono", ui-monospace, monospace`
    ctx.fillStyle = '#4b5869'
    ctx.textBaseline = 'middle'
    let cx = pad
    for (const ch2 of text) {
      ctx.fillText(ch2, cx, ch / 2)
      cx += ctx.measureText(ch2).width + px * 0.14 // letterspacing by hand
    }
    const tex = new CanvasTexture(c2d)
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = 4
    const worldH = 0.24
    const worldW = worldH * (cw / ch)
    const geo = new PlaneGeometry(worldW, worldH)
    const mat = new MeshBasicMaterial({ map: tex, transparent: true, opacity })
    const m = new Mesh(geo, mat)
    m.position.set(anchorLeft ? x + worldW / 2 : x, y, 0.02)
    group.add(m)
    disposables.push(geo, mat, tex)
    return m
  }

  /* ---- tier panels: the site's card language behind each bank ---- */
  const chartW = (COLS - 1) * COL_PITCH + AISLE + SEAT_SIZE
  const PANEL_PAD = 0.34
  const panelW = chartW + PANEL_PAD * 2
  for (const tier of TIERS) {
    const seatsH = (tier.rows - 1) * ROW_PITCH + SEAT_SIZE
    const panelH = seatsH + PANEL_PAD * 2 + 0.34 // headroom for the label
    const cy = tier.y0 + ((tier.rows - 1) * ROW_PITCH) / 2 - 0.06
    addRect(panelW + 0.04, panelH + 0.04, 0.34, PALETTE.panelEdge, 0.9, 0, cy, -0.03)
    addRect(panelW, panelH, 0.32, PALETTE.panel, 0.92, 0, cy, -0.02)
    addLabel(tier.label, -panelW / 2 + 0.3, cy + panelH / 2 - 0.34, 0.75)
  }

  /* ---- the stage: one quiet ink bar the whole chart points at ---- */
  const stage = (() => {
    const bar = addRect(3.4, 0.44, 0.22, PALETTE.stage, 0.1, 0, 0, 0)
    addLabel('STAGE', 0, 0, 0.5, false)
    return bar
  })()
  void stage

  /* ---- pointer: slight parallax + demand ---- */
  const pointer = new Vector2()
  const raycaster = new Raycaster()
  const chartPlane = new Plane(new Vector3(0, 0, 1), 0)
  const demand = new Vector3()
  let elapsed = 0
  let pointerAt = -Infinity

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    if (raycaster.ray.intersectPlane(chartPlane, demand)) pointerAt = elapsed
  }
  const parallaxEnabled = !prefersReduced && matchMedia('(pointer: fine)').matches
  if (parallaxEnabled) window.addEventListener('pointermove', onPointerMove, { passive: true })

  const demandActive = () => parallaxEnabled && elapsed - pointerAt < 2

  /* ---- the market simulation ---- */
  let listings = seats.filter((seat) => seat.state === SeatState.Listed).length
  let grabbedTotal = 0
  let nextListingAt = 0.5
  let nextSnipeAt = 2.3 + Math.random() * 1
  const sweepAt = TIERS.map((_, t) => 1.6 + t * 1.9)
  const sweepX = TIERS.map(() => -Infinity)

  const listRandomSeat = () => {
    const empties = seats.filter((seat) => seat.state === SeatState.Empty)
    if (empties.length === 0) return
    const seat = empties[Math.floor(Math.random() * empties.length)]
    seat.state = SeatState.Listed
    seat.pulseT = 0
    listings++
  }

  const snipe = () => {
    // find a contiguous run of listed seats in a row and take it; a real
    // monitor doesn't give up because the first row it checked was thin
    for (let attempt = 0; attempt < 8; attempt++) {
      const t = Math.floor(Math.random() * TIERS.length)
      const row = Math.floor(Math.random() * TIERS[t].rows)
      const base = tierStart(t) + row * COLS
      const runs: Array<{ start: number; len: number }> = []
      let runStart = -1
      for (let c = 0; c <= COLS; c++) {
        // a run cannot span the aisle: close any open run at the gap, then
        // the right bank may start its own
        if (c === COLS / 2 && runStart >= 0) {
          runs.push({ start: runStart, len: c - runStart })
          runStart = -1
        }
        const listed = c < COLS && seats[base + c].state === SeatState.Listed
        if (listed && runStart < 0) runStart = c
        if (!listed && runStart >= 0) {
          runs.push({ start: runStart, len: c - runStart })
          runStart = -1
        }
      }
      const candidates = runs.filter((r) => r.len >= 2)
      if (candidates.length === 0) continue
      const run = candidates[Math.floor(Math.random() * candidates.length)]
      const take = Math.min(run.len, 2 + Math.floor(Math.random() * 5))
      for (let c = run.start; c < run.start + take; c++) {
        const seat = seats[base + c]
        seat.state = SeatState.Grabbed
        seat.pulseT = -0.07 * (c - run.start) // left-to-right ripple
        seat.releaseAt = elapsed + 14 + Math.random() * 18
        listings--
        grabbedTotal++
      }
      return
    }
    listRandomSeat() // market was thin everywhere; it moves on
  }

  /* ---- stats for the DOM ticker ---- */
  let statsAt = 0
  const tickStats = () => {
    if (elapsed - statsAt < 0.5) return
    statsAt = elapsed
    hooks.onStats?.({ listings, grabbed: grabbedTotal })
  }

  /* ---- per-frame seat update ---- */
  const tmpMat = new Matrix4()
  const unitQuat = new Quaternion()
  const tmpPos = new Vector3()
  const tmpScale = new Vector3()

  const composeSeat = (seat: Seat, index: number, boot: number) => {
    // boot reveal: rows pop in from the stage upward
    const reveal = prefersReduced ? 1 : Math.max(0, Math.min(1, (boot - seat.revealAt) / 0.3))
    let scale = reveal < 1 ? reveal * (2 - reveal) : 1 // ease-out

    if (seat.pulseT >= 0 && seat.pulseT < 0.45) {
      scale *= 1 + Math.sin((seat.pulseT / 0.45) * Math.PI) * 0.32
    }
    scale *= 1 + seat.heat * 0.16

    tmpPos.set(seat.x, seat.y, 0)
    tmpScale.setScalar(Math.max(0.0001, scale))
    tmpMat.compose(tmpPos, unitQuat, tmpScale)
    mesh.setMatrixAt(index, tmpMat)

    // color: state base → sweep brighten → flash pulse → demand heat
    tmpColor.copy(stateColor[seat.state])
    if (seat.sweep > 0) tmpColor.lerp(flashColor, seat.sweep * 0.4)
    if (seat.pulseT >= 0 && seat.pulseT < 0.45) {
      tmpColor.lerp(flashColor, Math.sin((seat.pulseT / 0.45) * Math.PI))
    }
    // grabbed seats keep their navy under the cursor; they only swell
    if (seat.heat > 0 && seat.state !== SeatState.Grabbed) {
      tmpColor.lerp(heatColor, seat.heat * 0.55)
    }
    seat.color.lerp(tmpColor, prefersReduced ? 1 : 0.25)
    mesh.setColorAt(index, seat.color)
  }

  const updateSeats = (dt: number, boot: number) => {
    const active = demandActive()
    for (let i = 0; i < SEAT_COUNT; i++) {
      const seat = seats[i]

      if (seat.pulseT >= 0) {
        seat.pulseT += dt
        if (seat.pulseT > 0.6) seat.pulseT = -1
      }
      if (seat.sweep > 0) seat.sweep = Math.max(0, seat.sweep - dt * 2.2)

      // grabbed inventory cycles back onto the market
      if (seat.state === SeatState.Grabbed && elapsed >= seat.releaseAt) {
        seat.state = SeatState.Empty
        seat.releaseAt = Infinity
      }

      // demand follows the cursor
      const dx = seat.x - demand.x
      const dy = seat.y - demand.y
      const dSq = dx * dx + dy * dy
      const targetHeat = active && dSq < 1.7 ? 1 - Math.sqrt(dSq) / 1.31 : 0
      seat.heat += (Math.max(0, targetHeat) - seat.heat) * Math.min(1, dt * 8)

      composeSeat(seat, i, boot)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  const runMarket = () => {
    if (elapsed >= nextListingAt) {
      listRandomSeat()
      nextListingAt = elapsed + 0.25 + Math.random() * 0.5
    }
    if (elapsed >= nextSnipeAt) {
      snipe()
      nextSnipeAt = elapsed + 3 + Math.random() * 2.5
    }
    // the polling sweep: a soft band crossing each tier left to right
    for (let t = 0; t < TIERS.length; t++) {
      if (elapsed >= sweepAt[t]) {
        sweepX[t] = xLeft - 1
        sweepAt[t] = elapsed + 5.5 + Math.random() * 3
      }
      if (sweepX[t] > -Infinity) {
        sweepX[t] += 8.5 * (1 / 60)
        const start = tierStart(t)
        const count = TIERS[t].rows * COLS
        for (let i = start; i < start + count; i++) {
          const d = Math.abs(seats[i].x - sweepX[t])
          if (d < 0.6) seats[i].sweep = Math.max(seats[i].sweep, 1 - d / 0.6)
        }
        if (sweepX[t] > -xLeft + 1) sweepX[t] = -Infinity
      }
    }
  }

  /* ---- sizing ---- */
  const host = canvas.parentElement ?? canvas
  const resize = () => {
    const w = host.clientWidth || 1
    const h = host.clientHeight || 1
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.left = -FRUSTUM * aspect
    camera.right = FRUSTUM * aspect
    camera.top = FRUSTUM
    camera.bottom = -FRUSTUM
    camera.updateProjectionMatrix()
    if (!running) renderer.render(scene, camera)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(host)

  /* ---- render loop, paused when hidden or offscreen ---- */
  const clock = new Clock()
  let raf = 0
  let running = false
  let inView = true

  const frame = () => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), 0.05)
    elapsed += dt

    // barely-there parallax: the chart should feel pinned, not floaty
    if (parallaxEnabled) {
      camera.position.x += (pointer.x * 0.15 - camera.position.x) * 0.04
      camera.position.y += (CY + pointer.y * 0.1 - camera.position.y) * 0.04
    }

    runMarket()
    updateSeats(dt, elapsed)
    tickStats()
    renderer.render(scene, camera)
  }

  const setRunning = (on: boolean) => {
    if (prefersReduced) return
    if (on && !running) {
      running = true
      clock.getDelta() // swallow the pause so dt stays small
      raf = requestAnimationFrame(frame)
    } else if (!on && running) {
      running = false
      cancelAnimationFrame(raf)
    }
  }

  const onVisibility = () => setRunning(!document.hidden && inView)
  document.addEventListener('visibilitychange', onVisibility)

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      inView = entry.isIntersecting
    }
    setRunning(!document.hidden && inView)
  })
  io.observe(canvas)

  resize()
  if (prefersReduced) {
    // a composed still frame: everything revealed, no motion
    updateSeats(0, Infinity)
    renderer.render(scene, camera)
  } else {
    // the canvas fades in over the first rendered frames; the timeout
    // backstops occluded tabs where rAF is throttled
    updateSeats(0, 0)
    canvas.style.opacity = '0'
    canvas.style.transition = 'opacity 0.9s ease'
    const reveal = () => {
      canvas.style.opacity = '1'
    }
    requestAnimationFrame(reveal)
    setTimeout(reveal, 400)
    setRunning(true)
  }

  return () => {
    setRunning(false)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    if (parallaxEnabled) window.removeEventListener('pointermove', onPointerMove)
    mesh.dispose()
    roundedSquare.dispose()
    seatMat.dispose()
    for (const resource of disposables) resource.dispose()
    renderer.dispose()
  }
}

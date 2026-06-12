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
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * Hero accent: "Instrument" — one console panel of the live monitoring
 * system, center-right of the hero. Three sections share a single white
 * card with internal hairlines: a big rolling requests-per-second counter
 * with a scrolling sparkline, a sample of the monitor fleet blinking its
 * heartbeat polls, and an alert counter that files each find into a grid
 * of navy packets.
 *
 * The panel is a real object in space: it rests at a committed tilt toward
 * the headline, the pointer steers a true perspective parallax, and
 * hovering a section highlights it and accelerates its activity. Type is
 * drawn on 2x canvas textures so it stays crisp; every number on screen
 * comes from the animation itself. The loop pauses when the tab is hidden
 * or the hero scrolls away, and reduced-motion visitors get one composed
 * still.
 */

export interface HeroSceneStats {
  /** requests per second shown on the big counter */
  rps: number
  /** alerts filed since boot */
  alerts: number
}

export interface HeroSceneHooks {
  onStats?: (stats: HeroSceneStats) => void
}

const INK = '#14181f'
const SLATE = '#4b5869'
const BRAND = '#3d5a80'
const SKY = '#5b9bd5'
const NAVY = '#2b4a73'
const PANEL_FILL = '#ffffff'
const HAIRLINE = '#dde4ec'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

const PANEL_W = 432
const SECTION_H = 152
const PANEL_H = SECTION_H * 3
const RADIUS = 16
const PAD = 26
/** css-px y offsets of the three section centers from the panel center */
const SECTION_OFFSETS = [-SECTION_H, 0, SECTION_H]
/** canvas-2d textures draw at 2x and minify, which keeps the type crisp */
const TEXT_SCALE = 2

const BAR_COUNT = 40
const BAR_PITCH = 5
const BAR_RIGHT = PANEL_W / 2 - PAD - 1
/** shared baseline (css px below the section center) for numeral and bars */
const BASELINE_1 = 44
const MON_COUNT = 14
const MON_PITCH = 26
const MON_X0 = -PANEL_W / 2 + PAD + 7
const MON_Y = 22
const CELL_COUNT = 18
const CELL_PITCH = 22
const GRID_W = 6 * 14 + 5 * 8
const CELL_X0 = PANEL_W / 2 - PAD - GRID_W + 7
const CELL_Y0 = -4
const BASELINE_3 = 47

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
  // perspective camera tuned so 1 world unit = 1 css px at the panel's
  // plane: layout math reads like CSS, but the tilt and parallax are real
  const FOV = 23
  const camera = new PerspectiveCamera(FOV, 1, 100, 6000)
  // a telemetry console is a precise, axis-aligned object: it rests flat
  // and shows its depth when the visitor moves — pointer parallax rotates
  // it, hover lifts it, the shadow sells the elevation
  const TILT_Y = 0
  const TILT_X = 0

  const cluster = new Group()
  scene.add(cluster)
  const clusterBase = { x: 0, y: 0 }
  let viewW = 0
  let viewH = 0

  const m4 = new Matrix4()
  const q = new Quaternion()
  const vPos = new Vector3()
  const vScl = new Vector3()
  const tmpColor = new Color()
  const skyC = new Color(SKY)
  const navyC = new Color(NAVY)
  const inkC = new Color(INK)
  const paleC = new Color('#e8eef5')

  /* ---- live state: every figure on screen comes from here ---- */
  let elapsed = 0
  let rpsValue = 0
  let rpsShown = 0
  let lastNumeralAt = -1
  let wanderTarget = 598 + Math.random() * 26
  let nextWanderAt = 0
  let sampleIn = 0.18
  // boot with plausible history so the sparkline never starts flat: a
  // breathing baseline with texture and a gentle rise into the present —
  // the tail must never read as traffic dying under a healthy number
  const fakeSample = (i: number) =>
    588 +
    (i / BAR_COUNT) * 26 +
    Math.sin(i * 0.55) * 20 +
    Math.sin(i * 0.17 + 2) * 12 +
    (Math.random() - 0.5) * 24
  const samples = Array.from({ length: BAR_COUNT }, (_, i) => fakeSample(i))
  const monTimer = Array.from({ length: MON_COUNT }, () => 0.2 + Math.random() * 1.8)
  const monFlash = Array.from({ length: MON_COUNT }, () => (Math.random() < 0.3 ? Math.random() : 0))
  // "this session" means what it says: finds start at zero and arrive in
  // an early burst so the grid populates while the visitor is still here
  let alerts = 0
  let alertIn = 1.2 + Math.random()
  let popSlot = -1
  let popK = 1
  let numFlash = 0

  /* ---- crisp text: canvas-2d drawn at 2x onto plane-mapped textures ---- */
  interface Panel {
    mesh: Mesh
    mat: MeshBasicMaterial
    redraw: () => void
    dispose: () => void
  }
  const panels: Panel[] = []

  const makePanel = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): Panel => {
    const el = document.createElement('canvas')
    el.width = w * TEXT_SCALE
    el.height = h * TEXT_SCALE
    const ctx = el.getContext('2d')
    const tex = new CanvasTexture(el)
    tex.colorSpace = SRGBColorSpace
    const mat = new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    const geo = new PlaneGeometry(w, h)
    const mesh = new Mesh(geo, mat)
    const redraw = () => {
      if (!ctx) return
      ctx.setTransform(TEXT_SCALE, 0, 0, TEXT_SCALE, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      draw(ctx)
      tex.needsUpdate = true
    }
    redraw()
    const panel = {
      mesh,
      mat,
      redraw,
      dispose: () => {
        geo.dispose()
        mat.dispose()
        tex.dispose()
      },
    }
    panels.push(panel)
    return panel
  }

  /* ---- the console base: one card, three sections, internal hairlines.
     All static furniture (labels, metas, placeholders) bakes in here. ---- */
  const sectionLabel = (
    ctx: CanvasRenderingContext2D,
    label: string,
    topY: number,
    meta?: string,
  ) => {
    ctx.fillStyle = BRAND
    ctx.fillRect(PAD, topY + 27, 5, 5)
    ctx.fillStyle = SLATE
    ctx.font = `500 11px ${MONO}`
    ctx.letterSpacing = '1.6px'
    ctx.fillText(label, PAD + 12, topY + 35)
    ctx.letterSpacing = '0px'
    if (meta) {
      ctx.font = `400 11px ${MONO}`
      ctx.textAlign = 'right'
      ctx.fillText(meta, PANEL_W - PAD, topY + 35)
      ctx.textAlign = 'left'
    }
  }

  const consoleBase = makePanel(PANEL_W, PANEL_H, (ctx) => {
    ctx.beginPath()
    ctx.roundRect(0.5, 0.5, PANEL_W - 1, PANEL_H - 1, RADIUS)
    ctx.fillStyle = PANEL_FILL
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = HAIRLINE
    ctx.stroke()
    // internal section dividers, inset like a console's rule lines
    for (const yy of [SECTION_H, SECTION_H * 2]) {
      ctx.beginPath()
      ctx.moveTo(22, yy + 0.5)
      ctx.lineTo(PANEL_W - 22, yy + 0.5)
      ctx.stroke()
    }
    sectionLabel(ctx, 'REQUESTS / SEC', 0)
    sectionLabel(ctx, 'MONITORS', SECTION_H, 'showing 14 of 285')
    // "finds", not "alerts": on a resale monitor a hit is a win, and the
    // label should read as good news at a glance. "this session" is the
    // truth: the counter starts at zero when the page loads.
    sectionLabel(ctx, 'FINDS', SECTION_H * 2, 'this session')
    // the page's real numbers are stamped and honest; the console says
    // plainly that it is not one of them
    ctx.fillStyle = SLATE
    ctx.font = `400 10px ${MONO}`
    ctx.letterSpacing = '0.5px'
    ctx.textAlign = 'right'
    ctx.fillText('simulated feed', PANEL_W - PAD, PANEL_H - 13)
    ctx.textAlign = 'left'
    ctx.letterSpacing = '0px'
    // alert grid placeholders
    ctx.strokeStyle = HAIRLINE
    for (let n = 0; n < CELL_COUNT; n++) {
      const x = PANEL_W / 2 + CELL_X0 + (n % 6) * CELL_PITCH - 7
      const y = SECTION_H * 2 + SECTION_H / 2 + CELL_Y0 + Math.floor(n / 6) * CELL_PITCH - 7
      ctx.beginPath()
      ctx.roundRect(x + 0.5, y + 0.5, 13, 13, 4)
      ctx.stroke()
    }
  })

  // one soft shadow under the one console: elevation, cheaply
  const shadowSprite = (() => {
    const padPx = 46
    const el = document.createElement('canvas')
    el.width = (PANEL_W + padPx * 2) / 2
    el.height = (PANEL_H + padPx * 2) / 2
    const ctx = el.getContext('2d')
    if (ctx) {
      ctx.filter = 'blur(13px)'
      ctx.fillStyle = '#0c1320'
      ctx.beginPath()
      ctx.roundRect(padPx / 2, padPx / 2, PANEL_W / 2, PANEL_H / 2, RADIUS / 2)
      ctx.fill()
    }
    const tex = new CanvasTexture(el)
    tex.colorSpace = SRGBColorSpace
    return { tex, w: PANEL_W + padPx * 2, h: PANEL_H + padPx * 2 }
  })()
  const shadowMat = new MeshBasicMaterial({
    map: shadowSprite.tex,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  })
  const shadow = new Mesh(new PlaneGeometry(shadowSprite.w, shadowSprite.h), shadowMat)
  shadow.position.set(8, -16, -18)
  shadow.renderOrder = -1
  cluster.add(shadow)

  consoleBase.mesh.renderOrder = 0
  cluster.add(consoleBase.mesh)

  /* ---- section hover highlights + activity state ---- */
  interface Section {
    group: Group
    hover: number
    highlightMat: MeshBasicMaterial
  }
  const sections: Section[] = []
  const highlightGeo = new PlaneGeometry(PANEL_W - 14, SECTION_H - 14)
  for (let i = 0; i < 3; i++) {
    const group = new Group()
    group.position.set(0, -SECTION_OFFSETS[i], 6)
    const highlightMat = new MeshBasicMaterial({
      color: SKY,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const highlight = new Mesh(highlightGeo, highlightMat)
    highlight.position.z = -2
    highlight.renderOrder = 0.5
    group.add(highlight)
    cluster.add(group)
    sections.push({ group, hover: 0, highlightMat })
  }

  /* ---- section 1: the big rolling req/s numeral + scrolling sparkline ---- */
  const rpsPanel = makePanel(220, 84, (ctx) => {
    ctx.fillStyle = INK
    ctx.font = `500 64px ${MONO}`
    ctx.fillText(String(rpsShown), 0, 62)
  })
  rpsPanel.mesh.position.set(-PANEL_W / 2 + PAD + 110, -(BASELINE_1 - 62 + 40), 4)
  rpsPanel.mesh.renderOrder = 1
  sections[0].group.add(rpsPanel.mesh)

  const barGeo = new PlaneGeometry(2, 1)
  barGeo.translate(0, 0.5, 0) // scale grows the bar up from its baseline
  const barMat = new MeshBasicMaterial({ transparent: true, opacity: 0.92, depthWrite: false })
  const barMesh = new InstancedMesh(barGeo, barMat, BAR_COUNT)
  barMesh.frustumCulled = false
  barMesh.renderOrder = 1
  barMesh.instanceMatrix.setUsage(DynamicDrawUsage)
  for (let j = 0; j < BAR_COUNT; j++) {
    barMesh.setColorAt(j, j === BAR_COUNT - 1 ? skyC : tmpColor.set(BRAND))
  }
  sections[0].group.add(barMesh)

  const layoutBars = () => {
    for (let j = 0; j < BAR_COUNT; j++) {
      const v = samples[j]
      const h = Math.min(46, Math.max(6, 5 + ((v - 545) / 110) * 40))
      // the newest bar is the current value: wider, so the chart visibly
      // connects to the big numeral beside it
      const wide = j === BAR_COUNT - 1 ? 1.8 : 1
      m4.compose(
        vPos.set(BAR_RIGHT - (BAR_COUNT - 1 - j) * BAR_PITCH, -BASELINE_1, 4),
        q,
        vScl.set(wide, h, 1),
      )
      barMesh.setMatrixAt(j, m4)
    }
    barMesh.instanceMatrix.needsUpdate = true
  }
  layoutBars()

  /* ---- shared packet-square sprite for monitors and alert cells ---- */
  const squareEl = document.createElement('canvas')
  squareEl.width = 64
  squareEl.height = 64
  const squareCtx = squareEl.getContext('2d')
  if (squareCtx) {
    squareCtx.beginPath()
    squareCtx.roundRect(0, 0, 64, 64, 18)
    squareCtx.fillStyle = '#ffffff'
    squareCtx.fill()
  }
  const squareTex = new CanvasTexture(squareEl)
  squareTex.colorSpace = SRGBColorSpace
  const squareMat = new MeshBasicMaterial({ map: squareTex, transparent: true, depthWrite: false })
  const squareGeo = new PlaneGeometry(14, 14)

  /* ---- section 2: heartbeat polls across a sample of the fleet ---- */
  const monMesh = new InstancedMesh(squareGeo, squareMat, MON_COUNT)
  monMesh.frustumCulled = false
  monMesh.renderOrder = 1
  monMesh.instanceMatrix.setUsage(DynamicDrawUsage)
  sections[1].group.add(monMesh)

  /* ---- section 3: alert counter + the grid the finds file into ---- */
  const alertPanel = makePanel(160, 70, (ctx) => {
    ctx.fillStyle = '#ffffff' // tinted by the material so the flash is free
    ctx.font = `500 48px ${MONO}`
    ctx.fillText(String(alerts), 0, 52)
  })
  alertPanel.mat.color.set(INK)
  alertPanel.mesh.position.set(-PANEL_W / 2 + PAD + 80, -(BASELINE_3 - 52 + 33), 4)
  alertPanel.mesh.renderOrder = 1
  sections[2].group.add(alertPanel.mesh)

  const cellMesh = new InstancedMesh(squareGeo, squareMat, CELL_COUNT)
  cellMesh.frustumCulled = false
  cellMesh.renderOrder = 1
  cellMesh.instanceMatrix.setUsage(DynamicDrawUsage)
  sections[2].group.add(cellMesh)

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const updateCells = () => {
    const filled = Math.min(alerts, CELL_COUNT)
    const k = easeOutCubic(Math.min(1, popK))
    for (let n = 0; n < CELL_COUNT; n++) {
      const isPop = n === popSlot && popK < 1
      const on = n < filled
      const sc = on ? (isPop ? 1 + 0.6 * (1 - k) * (1 - k) : 1) : 0.0001
      m4.compose(
        vPos.set(CELL_X0 + (n % 6) * CELL_PITCH, -(CELL_Y0 + Math.floor(n / 6) * CELL_PITCH), 4),
        q,
        vScl.set(sc, sc, 1),
      )
      cellMesh.setMatrixAt(n, m4)
      if (isPop) tmpColor.copy(skyC).lerp(navyC, k)
      else tmpColor.copy(navyC)
      cellMesh.setColorAt(n, tmpColor)
    }
    cellMesh.instanceMatrix.needsUpdate = true
    if (cellMesh.instanceColor) cellMesh.instanceColor.needsUpdate = true
  }

  /* ---- pointer: section hover and true parallax ---- */
  const pointerClient = { x: 0, y: 0 }
  const pointerNorm = { x: 0, y: 0 }
  let pointerHas = false
  let hovered = -1
  let parX = 0
  let parY = 0
  let lift = 0

  const onPointerMove = (e: PointerEvent) => {
    pointerClient.x = e.clientX
    pointerClient.y = e.clientY
    pointerNorm.x = (e.clientX / window.innerWidth) * 2 - 1
    pointerNorm.y = (e.clientY / window.innerHeight) * 2 - 1
    pointerHas = true
  }
  const parallaxEnabled = !prefersReduced && matchMedia('(pointer: fine)').matches
  if (parallaxEnabled) window.addEventListener('pointermove', onPointerMove, { passive: true })

  const updateHover = () => {
    hovered = -1
    if (!pointerHas) return
    const rect = canvas.getBoundingClientRect()
    const lx = pointerClient.x - rect.left
    const ly = pointerClient.y - rect.top
    if (lx < 0 || ly < 0 || lx > rect.width || ly > rect.height) return
    const s = cluster.scale.x
    const dx = lx - (clusterBase.x + parX)
    const dy = ly - (clusterBase.y + parY)
    if (Math.abs(dx) > (PANEL_W / 2) * s) return
    for (let i = 0; i < sections.length; i++) {
      if (Math.abs(dy - SECTION_OFFSETS[i] * s) <= (SECTION_H / 2) * s) hovered = i
    }
  }

  /* ---- stats hook: the console's own numbers ---- */
  let statsAt = 0
  const tickStats = () => {
    if (prefersReduced) return
    if (elapsed - statsAt < 0.5) return
    statsAt = elapsed
    hooks.onStats?.({ rps: rpsValue, alerts })
  }

  /* ---- one tick of the console ---- */
  const step = (dt: number) => {
    elapsed += dt

    let maxHover = 0
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const goal = hovered === i ? 1 : 0
      section.hover += (goal - section.hover) * Math.min(1, dt * 6)
      maxHover = Math.max(maxHover, section.hover)
      section.highlightMat.opacity = 0.05 * section.hover
      section.group.position.z = 6 + 6 * section.hover
    }
    // the whole console lifts slightly toward the camera under attention
    lift += (18 * maxHover - lift) * Math.min(1, dt * 6)
    shadowMat.opacity = 0.16 - 0.04 * maxHover

    // requests/sec: spin up, then a lively smoothed walk; hover widens the
    // jitter like a load spike. The wander retargets often enough that the
    // sparkline always breathes.
    if (elapsed >= nextWanderAt) {
      wanderTarget = 565 + Math.random() * 80
      nextWanderAt = elapsed + 1.1 + Math.random() * 1.2
    }
    const boot = Math.min(1, elapsed / 1.6)
    const target = wanderTarget * easeOutCubic(boot)
    const amp = 170 * (1 + 1.6 * sections[0].hover)
    rpsValue += (target - rpsValue) * Math.min(1, dt * 2.4) + (Math.random() - 0.5) * dt * amp
    rpsValue = Math.min(680, Math.max(0, rpsValue))

    const shown = Math.round(rpsValue)
    if (shown !== rpsShown && elapsed - lastNumeralAt >= 0.125) {
      rpsShown = shown
      lastNumeralAt = elapsed
      rpsPanel.redraw()
    }

    sampleIn -= dt * (1 + 0.7 * sections[0].hover)
    if (sampleIn <= 0) {
      sampleIn += 0.18
      samples.shift()
      // sampled with its own texture so neighbours never flatline together
      samples.push(rpsValue + (Math.random() - 0.5) * 24)
      layoutBars()
    }

    // monitors: every packet polls on its own cadence; hover raises tempo
    for (let i = 0; i < MON_COUNT; i++) {
      monTimer[i] -= dt * (1 + 1.3 * sections[1].hover)
      if (monTimer[i] <= 0) {
        monFlash[i] = 1
        monTimer[i] = 0.6 + Math.random() * 1.4
      }
      monFlash[i] *= Math.exp(-dt * 4.5)
      tmpColor.copy(paleC).lerp(skyC, Math.min(1, monFlash[i] * 1.15))
      monMesh.setColorAt(i, tmpColor)
      const ms = 1 + 0.14 * monFlash[i]
      m4.compose(vPos.set(MON_X0 + i * MON_PITCH, -MON_Y, 4), q, vScl.set(ms, ms, 1))
      monMesh.setMatrixAt(i, m4)
    }
    monMesh.instanceMatrix.needsUpdate = true
    if (monMesh.instanceColor) monMesh.instanceColor.needsUpdate = true

    // alerts: a find every few seconds; the numeral flashes and the packet
    // files into the grid, recycling the oldest slot once full
    alertIn -= dt * (1 + 2.2 * sections[2].hover)
    if (alertIn <= 0) {
      alerts++
      alertIn = alerts < 3 ? 1.2 + Math.random() * 1.2 : 4 + Math.random() * 3
      popSlot = (alerts - 1) % CELL_COUNT
      popK = 0
      numFlash = 1
      alertPanel.redraw()
    }
    if (popK < 1) popK = Math.min(1, popK + dt / 0.45)
    numFlash *= Math.exp(-dt * 3)
    alertPanel.mat.color.copy(inkC).lerp(skyC, Math.min(1, numFlash * 0.9))
    alertPanel.mesh.scale.setScalar(1 + 0.1 * numFlash)
    updateCells()

    tickStats()
  }

  /* ---- sizing: the console centers in the band between the css fade
     mask on the canvas's left edge and the right margin, clear of the
     header and the stats row ---- */
  const host = canvas.parentElement ?? canvas
  const placeCluster = () => {
    const bob = prefersReduced ? 0 : Math.sin(elapsed * 0.7) * 2
    cluster.position.set(
      clusterBase.x + parX - viewW / 2,
      viewH / 2 - (clusterBase.y + parY) + bob,
      lift,
    )
    cluster.rotation.y = TILT_Y + (parallaxEnabled ? pointerNorm.x * 0.05 : 0)
    cluster.rotation.x = TILT_X - (parallaxEnabled ? pointerNorm.y * 0.035 : 0)
  }
  const layout = (w: number, h: number) => {
    viewW = w
    viewH = h
    // measure the stats divider and stay clear of it (shadow included),
    // instead of trusting viewport math that drifts with content
    let bottomBound = Math.min(h - 210, 596)
    const statsEl = document.querySelector('.hero-stats')
    if (statsEl) {
      const hostTop = host.getBoundingClientRect().top
      const statsTop = statsEl.getBoundingClientRect().top
      bottomBound = Math.min(bottomBound, Math.max(300, statsTop - hostTop - 30))
    }
    const sW = (w * 0.66 - PAD) / PANEL_W
    const sV = (bottomBound - 92) / PANEL_H
    const s = Math.max(0.2, Math.min(1, sW, sV))
    const top = 92 + Math.max(0, (bottomBound - 92 - PANEL_H * s) / 2)
    const fadeSafe = w * 0.26 + (PANEL_W / 2) * s + 10
    const rightMost = w - PAD - 16 - (PANEL_W / 2) * s
    clusterBase.x = Math.round(Math.min(rightMost, Math.max(w * 0.5, fadeSafe)))
    clusterBase.y = Math.round(top + (PANEL_H * s) / 2)
    cluster.scale.setScalar(s)
    placeCluster()
  }
  const resize = () => {
    const w = host.clientWidth || 1
    const h = host.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // distance at which one world unit projects to exactly one css pixel
    camera.position.z = h / 2 / Math.tan((FOV * Math.PI) / 360)
    camera.updateProjectionMatrix()
    layout(w, h)
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

    updateHover()
    if (parallaxEnabled && pointerHas) {
      const k = Math.min(1, dt * 3)
      parX += (pointerNorm.x * 5 - parX) * k
      parY += (pointerNorm.y * 4 - parY) * k
    }

    step(dt)
    placeCluster()
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

  let disposed = false
  resize()
  step(0)

  // the page requests JetBrains Mono itself, so this almost always resolves
  // immediately; it backstops a first paint before the face is ready
  if (document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
      if (disposed) return
      for (const p of panels) p.redraw()
      if (!running) renderer.render(scene, camera)
    })
  }

  if (prefersReduced) {
    // simulate ~10s so the still frame shows a composed, plausible state
    for (let i = 0; i < 170; i++) step(1 / 16)
    placeCluster()
    renderer.render(scene, camera)
  } else {
    // the canvas fades in over the first rendered frames; the timeout
    // backstops occluded tabs where rAF is throttled
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
    disposed = true
    setRunning(false)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    if (parallaxEnabled) window.removeEventListener('pointermove', onPointerMove)
    for (const p of panels) p.dispose()
    for (const section of sections) section.highlightMat.dispose()
    highlightGeo.dispose()
    shadow.geometry.dispose()
    shadowMat.dispose()
    shadowSprite.tex.dispose()
    barGeo.dispose()
    barMat.dispose()
    squareGeo.dispose()
    squareMat.dispose()
    squareTex.dispose()
    renderer.dispose()
  }
}

import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three'

/**
 * Hero accent: a sparse, light-toned monitoring graph. Service nodes are
 * linked into a network, "request" packets hop node-to-node along real
 * edges, and a faint wireframe core turns at the center. It sits in the
 * hero's right-hand whitespace (the canvas is hidden below 64rem), and the
 * loop pauses whenever the tab is hidden or the hero scrolls away.
 *
 * The graph tells the monitoring story instead of just decorating: packets
 * leave fading trails; every few seconds one of them "finds" something,
 * turns deep navy, races down the backbone into the core, and the core
 * pulses; the pointer acts as load, pulling traffic toward the nearest
 * cluster and heating it up. A stats hook reports real numbers from the
 * animation (hops per second, alerts landed) for the DOM ticker.
 */

const PALETTE = {
  node: 0x3d5a80, // the original site's b'dazzled blue
  line: 0x14181f, // ink, used at very low opacity
  packet: 0x5b9bd5, // sky blue: requests in flight
  core: 0x2b4a73, // deep navy
  bg: 0xf7f9fb, // page background: trails fade toward it
}

interface Packet {
  from: number
  to: number
  t: number
  speed: number
}

interface AlertRun {
  /** index of the hijacked packet */
  idx: number
  /** waypoints from where it was, down the backbone, into the core */
  legs: Vector3[]
  /** current leg */
  leg: number
  /** progress along the current leg */
  t: number
}

export interface HeroSceneStats {
  /** packet hops per second, smoothed */
  rate: number
  /** alerts that reached the core since boot */
  alerts: number
}

export interface HeroSceneHooks {
  onStats?: (stats: HeroSceneStats) => void
}

export function initHeroScene(canvas: HTMLCanvasElement, hooks: HeroSceneHooks = {}): () => void {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const CLUSTERS = 5
  const MEMBERS_PER_CLUSTER = 9
  // centers + core ports + members
  const NODE_COUNT = CLUSTERS * 2 + CLUSTERS * MEMBERS_PER_CLUSTER
  const PACKET_COUNT = 26
  // trail ring buffer: ~half a second of motion at a sample every 3 frames
  const TRAIL_POINTS = 10
  const TRAIL_EVERY = 3

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(48, 1, 0.1, 120)
  camera.position.set(0, 0, 24)
  const lookTarget = new Vector3(0, 0, 0)

  const group = new Group()
  group.rotation.z = 0.16
  scene.add(group)

  /* ---- topology: service clusters around the core, joined by a backbone.
     Index layout: [0, CLUSTERS) cluster centers · [CLUSTERS, 2*CLUSTERS)
     core ports · the rest are cluster members. ---- */
  const nodePos = new Float32Array(NODE_COUNT * 3)
  const setNode = (i: number, x: number, y: number, z: number) => {
    nodePos[i * 3] = x
    nodePos[i * 3 + 1] = y
    nodePos[i * 3 + 2] = z
  }
  const nodeVec = (i: number, out: Vector3) =>
    out.set(nodePos[i * 3], nodePos[i * 3 + 1], nodePos[i * 3 + 2])

  for (let c = 0; c < CLUSTERS; c++) {
    const angle = (c / CLUSTERS) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
    const radius = 7.2 + Math.random() * 1.1
    const cx = Math.cos(angle) * radius
    // alternate above/below the core so the ring reads as a constellation,
    // not a flat belt
    const cy = (c % 2 === 0 ? 1 : -1) * (1.1 + Math.random() * 1.5)
    const cz = Math.sin(angle) * radius
    setNode(c, cx, cy, cz)

    // the cluster's port on the core's surface
    const len = Math.hypot(cx, cy, cz)
    setNode(CLUSTERS + c, (cx / len) * 3.1, (cy / len) * 2.4, (cz / len) * 3.1)

    // members huddle around their center
    for (let m = 0; m < MEMBERS_PER_CLUSTER; m++) {
      const i = CLUSTERS * 2 + c * MEMBERS_PER_CLUSTER + m
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.8 + Math.random() * 1.2
      setNode(
        i,
        cx + r * Math.sin(phi) * Math.cos(theta),
        cy + r * Math.cos(phi) * 0.75,
        cz + r * Math.sin(phi) * Math.sin(theta),
      )
    }
  }

  const clusterOf = (i: number): number => {
    if (i < CLUSTERS) return i
    if (i < CLUSTERS * 2) return i - CLUSTERS
    return Math.floor((i - CLUSTERS * 2) / MEMBERS_PER_CLUSTER)
  }

  /* ---- node clouds. Vertex colors so the pointer can heat one cluster
     without touching the others. ---- */
  const baseNode = new Color(PALETTE.node)
  const baseCore = new Color(PALETTE.core)
  const heatColor = new Color(PALETTE.packet)

  const memberCount = CLUSTERS * MEMBERS_PER_CLUSTER
  const memberPos = nodePos.subarray(CLUSTERS * 2 * 3)
  const memberColors = new Float32Array(memberCount * 3)
  for (let i = 0; i < memberCount; i++) baseNode.toArray(memberColors, i * 3)
  const memberGeo = new BufferGeometry()
  memberGeo.setAttribute('position', new BufferAttribute(memberPos, 3))
  memberGeo.setAttribute('color', new BufferAttribute(memberColors, 3))
  const memberMat = new PointsMaterial({
    vertexColors: true,
    size: 0.14,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  })
  const nodes = new Points(memberGeo, memberMat)
  nodes.frustumCulled = false
  group.add(nodes)

  const anchorCount = CLUSTERS * 2
  const anchorColors = new Float32Array(anchorCount * 3)
  for (let i = 0; i < anchorCount; i++) baseCore.toArray(anchorColors, i * 3)
  const anchorGeo = new BufferGeometry()
  anchorGeo.setAttribute('position', new BufferAttribute(nodePos.subarray(0, anchorCount * 3), 3))
  anchorGeo.setAttribute('color', new BufferAttribute(anchorColors, 3))
  const anchorMat = new PointsMaterial({
    vertexColors: true,
    size: 0.24,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  })
  const anchors = new Points(anchorGeo, anchorMat)
  anchors.frustumCulled = false
  group.add(anchors)

  /* ---- edges ---- */
  const adjacency: number[][] = Array.from({ length: NODE_COUNT }, () => [])
  const edgeKeys = new Set<number>()
  const localEdges: [number, number][] = []
  const backboneEdges: [number, number][] = []

  const distSq = (a: number, b: number) => {
    const dx = nodePos[a * 3] - nodePos[b * 3]
    const dy = nodePos[a * 3 + 1] - nodePos[b * 3 + 1]
    const dz = nodePos[a * 3 + 2] - nodePos[b * 3 + 2]
    return dx * dx + dy * dy + dz * dz
  }

  const addEdge = (a: number, b: number, list: [number, number][]) => {
    const key = Math.min(a, b) * NODE_COUNT + Math.max(a, b)
    if (a === b || edgeKeys.has(key)) return
    edgeKeys.add(key)
    adjacency[a].push(b)
    adjacency[b].push(a)
    list.push([a, b])
  }

  for (let c = 0; c < CLUSTERS; c++) {
    // backbone: center → its core port, ports ring the core
    addEdge(c, CLUSTERS + c, backboneEdges)
    addEdge(CLUSTERS + c, CLUSTERS + ((c + 1) % CLUSTERS), backboneEdges)

    // local mesh: every member → its center, plus its nearest sibling
    for (let m = 0; m < MEMBERS_PER_CLUSTER; m++) {
      const i = CLUSTERS * 2 + c * MEMBERS_PER_CLUSTER + m
      addEdge(i, c, localEdges)
      let nearest = -1
      let best = Infinity
      for (let n = 0; n < MEMBERS_PER_CLUSTER; n++) {
        if (n === m) continue
        const j = CLUSTERS * 2 + c * MEMBERS_PER_CLUSTER + n
        const d = distSq(i, j)
        if (d < best) {
          best = d
          nearest = j
        }
      }
      if (nearest !== -1) addEdge(i, nearest, localEdges)
    }
  }

  const buildLines = (list: [number, number][], color: number, opacity: number) => {
    const pos = new Float32Array(list.length * 6)
    list.forEach(([a, b], i) => {
      pos.set(nodePos.subarray(a * 3, a * 3 + 3), i * 6)
      pos.set(nodePos.subarray(b * 3, b * 3 + 3), i * 6 + 3)
    })
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(pos, 3))
    const mat = new LineBasicMaterial({ color, transparent: true, opacity })
    const segments = new LineSegments(geo, mat)
    group.add(segments)
    return { geo, mat }
  }

  const local = buildLines(localEdges, PALETTE.line, 0.16)
  const backbone = buildLines(backboneEdges, PALETTE.node, 0.4)

  /* ---- packets: requests hopping across the graph ---- */
  const packets: Packet[] = []
  for (let i = 0; i < PACKET_COUNT; i++) {
    const from = Math.floor(Math.random() * NODE_COUNT)
    const neighbours = adjacency[from]
    const to = neighbours[Math.floor(Math.random() * neighbours.length)]
    packets.push({
      from,
      to,
      t: Math.random(),
      speed: 0.3 + Math.random() * 0.5,
    })
  }

  const basePacket = new Color(PALETTE.packet)
  const alertPacket = new Color(PALETTE.core)
  const packetPos = new Float32Array(PACKET_COUNT * 3)
  const packetColors = new Float32Array(PACKET_COUNT * 3)
  for (let i = 0; i < PACKET_COUNT; i++) basePacket.toArray(packetColors, i * 3)
  const packetGeo = new BufferGeometry()
  packetGeo.setAttribute('position', new BufferAttribute(packetPos, 3))
  packetGeo.setAttribute('color', new BufferAttribute(packetColors, 3))
  const packetMat = new PointsMaterial({
    vertexColors: true,
    size: 0.3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  })
  const packetPoints = new Points(packetGeo, packetMat)
  packetPoints.frustumCulled = false
  group.add(packetPoints)

  /* ---- trails: a short fading tail behind every packet. Colors are baked
     as a gradient toward the page background, which reads as alpha on the
     solid light backdrop. ---- */
  const trailRing = new Float32Array(PACKET_COUNT * TRAIL_POINTS * 3)
  const segsPerPacket = TRAIL_POINTS - 1
  const trailSegPos = new Float32Array(PACKET_COUNT * segsPerPacket * 6)
  const trailSegColor = new Float32Array(PACKET_COUNT * segsPerPacket * 6)

  const writeTrailGradient = (packetIndex: number, tint: Color) => {
    const bg = new Color(PALETTE.bg)
    for (let k = 0; k < segsPerPacket; k++) {
      const strengthNear = (1 - k / segsPerPacket) * 0.85
      const strengthFar = (1 - (k + 1) / segsPerPacket) * 0.85
      const near = bg.clone().lerp(tint, strengthNear)
      const far = bg.clone().lerp(tint, strengthFar)
      const o = (packetIndex * segsPerPacket + k) * 6
      near.toArray(trailSegColor, o)
      far.toArray(trailSegColor, o + 3)
    }
  }
  for (let i = 0; i < PACKET_COUNT; i++) writeTrailGradient(i, basePacket)

  const trailGeo = new BufferGeometry()
  trailGeo.setAttribute('position', new BufferAttribute(trailSegPos, 3))
  trailGeo.setAttribute('color', new BufferAttribute(trailSegColor, 3))
  const trailMat = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  })
  const trails = new LineSegments(trailGeo, trailMat)
  trails.frustumCulled = false
  group.add(trails)

  // collapse a packet's whole tail onto its current position (no streak)
  const seedTrail = (i: number) => {
    for (let k = 0; k < TRAIL_POINTS; k++) {
      trailRing.set(packetPos.subarray(i * 3, i * 3 + 3), (i * TRAIL_POINTS + k) * 3)
    }
  }

  const sampleTrails = () => {
    for (let i = 0; i < PACKET_COUNT; i++) {
      const base = i * TRAIL_POINTS * 3
      // shift the ring one slot toward the tail, newest in front
      trailRing.copyWithin(base + 3, base, base + (TRAIL_POINTS - 1) * 3)
      trailRing.set(packetPos.subarray(i * 3, i * 3 + 3), base)
      for (let k = 0; k < segsPerPacket; k++) {
        const o = (i * segsPerPacket + k) * 6
        trailSegPos.set(trailRing.subarray(base + k * 3, base + k * 3 + 3), o)
        trailSegPos.set(trailRing.subarray(base + (k + 1) * 3, base + (k + 1) * 3 + 3), o + 3)
      }
    }
    trailGeo.getAttribute('position').needsUpdate = true
  }

  const smoothstep = (t: number) => t * t * (3 - 2 * t)

  /* ---- pointer: parallax + load. The cursor pulls traffic toward the
     nearest cluster and heats it up. ---- */
  const pointer = { x: 0, y: 0 }
  const cursorLocal = new Vector3()
  const tmpVec = new Vector3()
  let pointerAt = -Infinity // elapsed seconds of last pointer move
  let elapsed = 0

  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    pointerAt = elapsed
  }
  const parallaxEnabled = !prefersReduced && matchMedia('(pointer: fine)').matches
  if (parallaxEnabled) window.addEventListener('pointermove', onPointerMove, { passive: true })

  const pointerActive = () => parallaxEnabled && elapsed - pointerAt < 2.5

  const updateCursorLocal = () => {
    // project the pointer onto the z=0 plane in world space, then into the
    // rotating group's local space so it can be compared with node positions
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    tmpVec.set(pointer.x * halfH * camera.aspect, -pointer.y * halfH, 0)
    cursorLocal.copy(group.worldToLocal(tmpVec))
  }

  /* ---- cluster heat ---- */
  let heatedCluster = -1
  let heatLevel = 0

  const paintCluster = (cluster: number, heat: number) => {
    if (cluster < 0) return
    const memberTint = baseNode.clone().lerp(heatColor, heat * 0.9)
    for (let m = 0; m < MEMBERS_PER_CLUSTER; m++) {
      memberTint.toArray(memberColors, (cluster * MEMBERS_PER_CLUSTER + m) * 3)
    }
    const anchorTint = baseCore.clone().lerp(heatColor, heat * 0.9)
    anchorTint.toArray(anchorColors, cluster * 3) // center
    anchorTint.toArray(anchorColors, (CLUSTERS + cluster) * 3) // port
    memberGeo.getAttribute('color').needsUpdate = true
    anchorGeo.getAttribute('color').needsUpdate = true
  }

  const updateHeat = (dt: number) => {
    let target = -1
    if (pointerActive()) {
      updateCursorLocal()
      let best = 49 // only react within distance 7 of a cluster center
      for (let c = 0; c < CLUSTERS; c++) {
        const d = nodeVec(c, tmpVec).distanceToSquared(cursorLocal)
        if (d < best) {
          best = d
          target = c
        }
      }
    }
    if (target !== heatedCluster) {
      paintCluster(heatedCluster, 0) // cool the old cluster instantly
      heatedCluster = target
    }
    const goal = target >= 0 ? 1 : 0
    const next = heatLevel + (goal - heatLevel) * Math.min(1, dt * 5)
    if (Math.abs(next - heatLevel) > 0.005) {
      heatLevel = next
      paintCluster(heatedCluster, heatLevel)
    } else {
      heatLevel = next
    }
  }

  /* ---- stats for the DOM ticker ---- */
  let hops = 0
  let alertsFound = 0
  let smoothedRate = 0
  let statsAt = 0

  const tickStats = () => {
    if (elapsed - statsAt < 0.5) return
    const instant = hops / (elapsed - statsAt)
    smoothedRate = smoothedRate === 0 ? instant : smoothedRate * 0.6 + instant * 0.4
    hops = 0
    statsAt = elapsed
    hooks.onStats?.({ rate: smoothedRate, alerts: alertsFound })
  }

  /* ---- packets in flight ---- */
  const updatePackets = (dt: number, speedScale = 1, skip = -1) => {
    const biased = pointerActive()
    for (let i = 0; i < packets.length; i++) {
      if (i === skip) continue
      const p = packets[i]
      p.t += dt * p.speed * speedScale
      while (p.t >= 1) {
        p.t -= 1
        hops++
        const arrived = p.to
        const neighbours = adjacency[arrived]
        let next: number
        if (biased && Math.random() < 0.65) {
          // under load, traffic drifts toward the cursor
          next = neighbours[0]
          let best = Infinity
          for (const n of neighbours) {
            const d = nodeVec(n, tmpVec).distanceToSquared(cursorLocal)
            if (d < best) {
              best = d
              next = n
            }
          }
        } else {
          next = neighbours[Math.floor(Math.random() * neighbours.length)]
          // avoid bouncing straight back when the node has other options
          if (next === p.from && neighbours.length > 1) {
            next = neighbours[(neighbours.indexOf(next) + 1) % neighbours.length]
          }
        }
        p.from = arrived
        p.to = next
        p.speed = 0.3 + Math.random() * 0.5
      }
      const k = smoothstep(p.t)
      const a = p.from * 3
      const b = p.to * 3
      packetPos[i * 3] = nodePos[a] + (nodePos[b] - nodePos[a]) * k
      packetPos[i * 3 + 1] = nodePos[a + 1] + (nodePos[b + 1] - nodePos[a + 1]) * k
      packetPos[i * 3 + 2] = nodePos[a + 2] + (nodePos[b + 2] - nodePos[a + 2]) * k
    }
    packetGeo.getAttribute('position').needsUpdate = true
  }

  /* ---- alerts: a packet finds something and races it into the core ---- */
  let alert: AlertRun | null = null
  let nextAlertAt = 3.5 + Math.random() * 2
  let corePulse = 0

  const startAlert = () => {
    const idx = Math.floor(Math.random() * PACKET_COUNT)
    const node = packets[idx].to
    const cluster = clusterOf(node)
    const legs: Vector3[] = [new Vector3(packetPos[idx * 3], packetPos[idx * 3 + 1], packetPos[idx * 3 + 2])]
    if (node >= CLUSTERS * 2) legs.push(nodeVec(cluster, new Vector3())) // member → its center
    const isPort = node >= CLUSTERS && node < CLUSTERS * 2
    if (!isPort) legs.push(nodeVec(CLUSTERS + cluster, new Vector3())) // → the cluster's core port
    legs.push(new Vector3(0, 0, 0)) // → into the core
    alert = { idx, legs, leg: 0, t: 0 }
    alertPacket.toArray(packetColors, idx * 3)
    packetGeo.getAttribute('color').needsUpdate = true
    writeTrailGradient(idx, alertPacket)
    trailGeo.getAttribute('color').needsUpdate = true
  }

  const finishAlert = () => {
    if (!alert) return
    const idx = alert.idx
    corePulse = 1
    alertsFound++
    // respawn the packet somewhere fresh, back in regular livery, with its
    // trail collapsed onto the new spot so nothing streaks across the scene
    const from = Math.floor(Math.random() * NODE_COUNT)
    const neighbours = adjacency[from]
    packets[idx] = { from, to: neighbours[Math.floor(Math.random() * neighbours.length)], t: 0, speed: 0.3 + Math.random() * 0.5 }
    packetPos.set(nodePos.subarray(from * 3, from * 3 + 3), idx * 3)
    seedTrail(idx)
    basePacket.toArray(packetColors, idx * 3)
    packetGeo.getAttribute('color').needsUpdate = true
    writeTrailGradient(idx, basePacket)
    trailGeo.getAttribute('color').needsUpdate = true
    alert = null
    nextAlertAt = elapsed + 4 + Math.random() * 3
  }

  const updateAlert = (dt: number) => {
    if (!alert) {
      if (elapsed >= nextAlertAt) startAlert()
      return
    }
    const idx = alert.idx
    alert.t += dt * 1.5
    while (alert.t >= 1) {
      alert.t -= 1
      alert.leg++
      if (alert.leg >= alert.legs.length - 1) {
        finishAlert()
        return
      }
    }
    const a = alert.legs[alert.leg]
    const b = alert.legs[alert.leg + 1]
    const k = smoothstep(alert.t)
    packetPos[idx * 3] = a.x + (b.x - a.x) * k
    packetPos[idx * 3 + 1] = a.y + (b.y - a.y) * k
    packetPos[idx * 3 + 2] = a.z + (b.z - a.z) * k
  }

  /* ---- the core service at the center of the graph ---- */
  const coreGeo = new WireframeGeometry(new IcosahedronGeometry(2.9, 1))
  const coreMat = new LineBasicMaterial({
    color: PALETTE.node,
    transparent: true,
    opacity: 0.22,
  })
  const core = new LineSegments(coreGeo, coreMat)
  group.add(core)

  const innerGeo = new WireframeGeometry(new IcosahedronGeometry(1.45, 0))
  const innerMat = new LineBasicMaterial({
    color: PALETTE.core,
    transparent: true,
    opacity: 0.55,
  })
  const inner = new LineSegments(innerGeo, innerMat)
  group.add(inner)

  /* ---- sizing ---- */
  const host = canvas.parentElement ?? canvas
  const resize = () => {
    const w = host.clientWidth || 1
    const h = host.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
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
  let frameCount = 0

  const frame = () => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), 0.05)
    elapsed += dt
    frameCount++

    group.rotation.y += dt * 0.04
    core.rotation.y -= dt * 0.1
    core.rotation.x += dt * 0.04
    inner.rotation.y += dt * 0.25

    if (parallaxEnabled) {
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03
      camera.position.y += (-pointer.y * 0.8 - camera.position.y) * 0.03
    }
    camera.lookAt(lookTarget)

    updateHeat(dt)

    // boot-up: traffic ramps from a trickle to full flow over the first
    // seconds, so the network reads as coming online with the hero intro
    const boot = smoothstep(Math.min(1, elapsed / 2.5))
    const load = 1 + heatLevel * 0.45
    updateAlert(dt)
    updatePackets(dt, (0.25 + 0.75 * boot) * load, alert ? alert.idx : -1)
    if (frameCount % TRAIL_EVERY === 0) sampleTrails()

    // the core settles after an alert lands
    corePulse *= Math.exp(-dt * 3)
    const pulse = 1 + Math.sin(elapsed * 1.2) * 0.05 + corePulse * 0.3
    inner.scale.setScalar(pulse)
    coreMat.opacity = 0.22 + corePulse * 0.3
    innerMat.opacity = 0.55 + corePulse * 0.35

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
  updatePackets(0)
  for (let i = 0; i < PACKET_COUNT; i++) seedTrail(i)
  if (prefersReduced) {
    // a still frame keeps the depth without the motion
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
    setRunning(false)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    if (parallaxEnabled) window.removeEventListener('pointermove', onPointerMove)
    for (const geo of [memberGeo, anchorGeo, local.geo, backbone.geo, packetGeo, trailGeo, coreGeo, innerGeo])
      geo.dispose()
    for (const mat of [memberMat, anchorMat, local.mat, backbone.mat, packetMat, trailMat, coreMat, innerMat])
      mat.dispose()
    renderer.dispose()
  }
}

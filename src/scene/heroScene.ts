import {
  BufferAttribute,
  BufferGeometry,
  Clock,
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
 */

const PALETTE = {
  node: 0x3d5a80, // the original site's b'dazzled blue
  line: 0x14181f, // ink, used at very low opacity
  packet: 0x5b9bd5, // sky blue: requests in flight
  core: 0x2b4a73, // deep navy
}

interface Packet {
  from: number
  to: number
  t: number
  speed: number
}

export function initHeroScene(canvas: HTMLCanvasElement): () => void {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const CLUSTERS = 5
  const MEMBERS_PER_CLUSTER = 9
  // centers + core ports + members
  const NODE_COUNT = CLUSTERS * 2 + CLUSTERS * MEMBERS_PER_CLUSTER
  const PACKET_COUNT = 26

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

  // members: small dots · centers and ports: slightly larger anchors
  const memberPos = nodePos.subarray(CLUSTERS * 2 * 3)
  const memberGeo = new BufferGeometry()
  memberGeo.setAttribute('position', new BufferAttribute(memberPos, 3))
  const memberMat = new PointsMaterial({
    color: PALETTE.node,
    size: 0.14,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  const nodes = new Points(memberGeo, memberMat)
  group.add(nodes)

  const anchorGeo = new BufferGeometry()
  anchorGeo.setAttribute(
    'position',
    new BufferAttribute(nodePos.subarray(0, CLUSTERS * 2 * 3), 3),
  )
  const anchorMat = new PointsMaterial({
    color: PALETTE.core,
    size: 0.24,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  })
  const anchors = new Points(anchorGeo, anchorMat)
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

  const buildLines = (
    list: [number, number][],
    color: number,
    opacity: number,
  ) => {
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

  const local = buildLines(localEdges, PALETTE.line, 0.13)
  const backbone = buildLines(backboneEdges, PALETTE.node, 0.32)

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

  const packetPos = new Float32Array(PACKET_COUNT * 3)
  const packetGeo = new BufferGeometry()
  packetGeo.setAttribute('position', new BufferAttribute(packetPos, 3))
  const packetMat = new PointsMaterial({
    color: PALETTE.packet,
    size: 0.28,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  })
  const packetPoints = new Points(packetGeo, packetMat)
  group.add(packetPoints)

  const smoothstep = (t: number) => t * t * (3 - 2 * t)

  const updatePackets = (dt: number, speedScale = 1) => {
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i]
      p.t += dt * p.speed * speedScale
      while (p.t >= 1) {
        p.t -= 1
        const arrived = p.to
        const neighbours = adjacency[arrived]
        let next = neighbours[Math.floor(Math.random() * neighbours.length)]
        // avoid bouncing straight back when the node has other options
        if (next === p.from && neighbours.length > 1) {
          next = neighbours[(neighbours.indexOf(next) + 1) % neighbours.length]
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

  /* ---- pointer parallax (fine pointers, full-motion only) ---- */
  const pointer = { x: 0, y: 0 }
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  const parallaxEnabled = !prefersReduced && matchMedia('(pointer: fine)').matches
  if (parallaxEnabled) window.addEventListener('pointermove', onPointerMove, { passive: true })

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
  let elapsed = 0
  let raf = 0
  let running = false
  let inView = true

  const frame = () => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), 0.05)
    elapsed += dt

    group.rotation.y += dt * 0.04
    core.rotation.y -= dt * 0.1
    core.rotation.x += dt * 0.04
    inner.rotation.y += dt * 0.25
    const pulse = 1 + Math.sin(elapsed * 1.2) * 0.05
    inner.scale.setScalar(pulse)

    if (parallaxEnabled) {
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03
      camera.position.y += (-pointer.y * 0.8 - camera.position.y) * 0.03
    }
    camera.lookAt(lookTarget)

    // boot-up: traffic ramps from a trickle to full flow over the first
    // seconds, so the network reads as coming online with the hero intro
    const boot = smoothstep(Math.min(1, elapsed / 2.5))
    updatePackets(dt, 0.25 + 0.75 * boot)
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
    // a still frame keeps the depth without the motion
    updatePackets(0)
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
    for (const geo of [memberGeo, anchorGeo, local.geo, backbone.geo, packetGeo, coreGeo, innerGeo])
      geo.dispose()
    for (const mat of [memberMat, anchorMat, local.mat, backbone.mat, packetMat, coreMat, innerMat])
      mat.dispose()
    renderer.dispose()
  }
}

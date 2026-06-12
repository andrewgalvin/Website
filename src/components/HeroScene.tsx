import { useEffect, useRef, useState } from 'react'

/**
 * The Three.js scene is a progressive enhancement: it lives in its own lazy
 * chunk, loads at browser idle, and only on viewports wide enough to show it
 * (the canvas is display:none below 64rem, so phones never pay for the
 * download). If WebGL is unavailable the hero simply stays typographic.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let dispose: (() => void) | undefined
    let idleId: number | undefined
    let timeoutId: number | undefined

    const start = () => {
      import('../scene/heroScene')
        .then(({ initHeroScene }) => {
          if (cancelled) return
          dispose = initHeroScene(canvas)
        })
        .catch(() => setFailed(true))
    }
    const schedule = () => {
      if (typeof requestIdleCallback === 'function') {
        idleId = requestIdleCallback(start, { timeout: 1500 })
      } else {
        timeoutId = setTimeout(start, 300)
      }
    }

    const wide = matchMedia('(min-width: 64rem)')
    // if the viewport later grows past the breakpoint, load the scene then
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) return
      wide.removeEventListener('change', onChange)
      schedule()
    }
    if (wide.matches) {
      schedule()
    } else {
      wide.addEventListener('change', onChange)
    }

    return () => {
      cancelled = true
      wide.removeEventListener('change', onChange)
      if (idleId !== undefined) cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      dispose?.()
    }
  }, [failed])

  return (
    <div className="hero-scene" aria-hidden="true">
      {!failed && <canvas id="hero-canvas" ref={canvasRef} />}
    </div>
  )
}

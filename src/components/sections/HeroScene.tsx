import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * The Three.js scene is a progressive enhancement: it lives in its own lazy
 * chunk, loads at browser idle, and only on viewports wide enough to show it
 * (the canvas is display:none below 64rem, so phones never pay for the
 * download). If WebGL is unavailable the hero simply stays typographic.
 *
 * Once loaded, the scene stays mounted across breakpoint changes (CSS hides
 * the canvas when narrow) and is disposed only on unmount.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{ loaded: boolean; dispose?: () => void }>({ loaded: false })
  const [failed, setFailed] = useState(false)
  const wide = useMediaQuery('(min-width: 64rem)')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !wide || failed || sceneRef.current.loaded) return

    let cancelled = false
    let idleId: number | undefined
    let timeoutId: number | undefined

    const start = () => {
      import('@/scene/heroScene')
        .then(({ initHeroScene }) => {
          if (cancelled) return
          sceneRef.current.loaded = true
          sceneRef.current.dispose = initHeroScene(canvas)
        })
        .catch(() => setFailed(true))
    }
    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(start, { timeout: 1500 })
    } else {
      timeoutId = setTimeout(start, 300)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined) cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [wide, failed])

  // dispose the renderer only when the component actually unmounts
  useEffect(() => {
    const scene = sceneRef.current
    return () => scene.dispose?.()
  }, [])

  return (
    <div className="hero-scene" aria-hidden="true">
      {!failed && <canvas id="hero-canvas" ref={canvasRef} />}
    </div>
  )
}

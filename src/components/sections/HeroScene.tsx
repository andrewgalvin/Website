import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * The Three.js scene is a progressive enhancement: it lives in its own lazy
 * chunk, loads at browser idle, and only on viewports wide enough to show it
 * (the canvas is display:none below 64rem, so phones never pay for the
 * download). If WebGL is unavailable the hero simply stays typographic.
 *
 * Once loaded, the scene stays mounted across breakpoint changes (CSS hides
 * the canvas when narrow) and is disposed only on unmount. The ticker is
 * written imperatively from the scene's stats hook — real numbers from the
 * animation, no React re-renders.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tickerRef = useRef<HTMLParagraphElement>(null)
  // set exactly once, when the scene finishes loading; presence means loaded
  const disposeRef = useRef<(() => void) | null>(null)
  const [failed, setFailed] = useState(false)
  const wide = useMediaQuery('(min-width: 64rem)')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !wide || failed || disposeRef.current) return

    let cancelled = false
    let idleId: number | undefined
    let timeoutId: number | undefined

    const start = () => {
      import('@/scene/heroScene')
        .then(({ initHeroScene }) => {
          if (cancelled) return
          disposeRef.current = initHeroScene(canvas, {
            onStats: ({ listings, grabbed }) => {
              if (tickerRef.current) {
                tickerRef.current.textContent = `▪ listings ${listings} · grabbed ${grabbed}`
              }
            },
          })
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
    return () => disposeRef.current?.()
  }, [])

  return (
    <div className="hero-scene" aria-hidden="true">
      {!failed && <canvas id="hero-canvas" ref={canvasRef} />}
      {!failed && <p className="hero-ticker" ref={tickerRef} />}
    </div>
  )
}

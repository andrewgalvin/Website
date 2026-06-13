import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

/**
 * Animates a number toward `target`: counts up from 0 on mount, then eases
 * from the current value to a new target when live data updates it (so a
 * live stat visibly ticks when it changes). Honors prefers-reduced-motion
 * by snapping to the target. Replaces the GSAP counter for the hero stats,
 * which now carry live values React owns.
 */
export function useCountUp(target: number, durationMs = 1100): number {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [shown, setShown] = useState(reduced ? target : 0)
  const shownRef = useRef(shown)
  shownRef.current = shown

  useEffect(() => {
    if (reduced) {
      setShown(target)
      return
    }
    const from = shownRef.current
    if (from === target) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(from + (target - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, reduced, durationMs])

  return shown
}

/**
 * One formatter for stat counters, shared by the initial render (Hero), the
 * reduced-motion final value, and every animation frame (animations.ts) —
 * if these derived the text independently, the count-up could end on a
 * different string than the one first painted.
 */
export const formatCount = (value: number, decimals?: number, suffix?: string): string =>
  value.toFixed(decimals ?? 0) + (suffix ?? '')

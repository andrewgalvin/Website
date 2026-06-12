/** Joins truthy class names: cx('base', cond && 'modifier'). */
export const cx = (...parts: Array<string | false | undefined>): string =>
  parts.filter(Boolean).join(' ')

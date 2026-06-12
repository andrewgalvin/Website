import type { ReactNode } from 'react'

/**
 * Renders a content string where *single asterisks* mark emphasis, e.g.
 * "ships *fast*" → ships <em>fast</em>. Keeps YAML free of HTML. Unbalanced
 * markers fall back to the raw string.
 */
export function withEmphasis(text: string): ReactNode {
  const parts = text.split('*')
  if (parts.length < 3 || parts.length % 2 === 0) return text
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))
}

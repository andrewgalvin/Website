/**
 * Server-side proxy for the GitHub contribution calendar. The browser can't
 * hold a token, and the calendar (which includes PRIVATE contribution counts)
 * needs one — so this function holds GITHUB_TOKEN and returns only the shape
 * the heatmap needs: totals and per-day counts. Repo names, commit messages,
 * and org names never cross this boundary, so nokiny-org stays unnamed.
 *
 * Env:
 *   GITHUB_TOKEN  — a PAT (classic: read:user, or fine-grained w/ read access).
 *                   Queried as the token owner, so private contributions are
 *                   counted automatically, regardless of profile visibility.
 *   GITHUB_LOGIN  — optional; defaults to andrewgalvin.
 */

export const config = { path: '/api/github-contributions' }

const QUERY = `query($login:String!){
  user(login:$login){
    contributionsCollection{
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ date contributionCount contributionLevel } }
      }
    }
  }
}`

// GitHub's five-bucket enum → the numeric level the heatmap colors by.
const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const json = (body: unknown, status: number, cache = false) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // let Netlify's CDN serve the graph; it moves at most once a day
      'cache-control': cache ? 'public, max-age=600, s-maxage=3600' : 'no-store',
    },
  })

export default async () => {
  const token = process.env.GITHUB_TOKEN
  if (!token) return json({ error: 'GITHUB_TOKEN not configured' }, 500)
  const login = process.env.GITHUB_LOGIN || 'andrewgalvin'

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'andrewgalvin-portfolio',
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return json({ error: 'github request failed' }, 502)

    const body = (await res.json()) as any
    const cal = body?.data?.user?.contributionsCollection?.contributionCalendar
    if (!cal || !Array.isArray(cal.weeks)) return json({ error: 'no calendar' }, 502)

    const weeks = cal.weeks.map((w: any) =>
      (w.contributionDays as any[]).map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
    )

    return json({ total: cal.totalContributions, weeks }, 200, true)
  } catch {
    return json({ error: 'fetch failed' }, 502)
  }
}

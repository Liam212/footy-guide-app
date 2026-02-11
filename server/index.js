import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const isProd = process.env.NODE_ENV === 'production'
const metaCache = new Map()

const getMetaCacheTtl = env => {
  const raw =
    env?.VITE_META_CACHE_TTL_MS || process.env.VITE_META_CACHE_TTL_MS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) ? parsed : 1000 * 60 * 5
}

const escapeHtml = value =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const serializeState = state =>
  JSON.stringify(state).replace(/</g, '\\u003c')

const injectHeadTags = (html, tags) => {
  if (!tags) return html
  if (html.includes('<!--head-tags-->')) {
    return html.replace('<!--head-tags-->', tags)
  }
  return html.replace('</head>', `${tags}\n</head>`)
}

async function fetchMatchMeta({ matchId, origin, env }) {
  const cacheKey = `${origin}:${matchId}`
  const cached = metaCache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    return cached.value
  }

  const apiUrl = env?.VITE_API_URL || process.env.VITE_API_URL
  const apiKey = env?.VITE_API_KEY || process.env.VITE_API_KEY
  const siteName =
    env?.VITE_PUBLIC_SITE_NAME || process.env.VITE_PUBLIC_SITE_NAME || 'Footy Guide'
  const twitterSite =
    env?.VITE_PUBLIC_TWITTER_HANDLE || process.env.VITE_PUBLIC_TWITTER_HANDLE

  if (!apiUrl) return ''

  try {
    const res = await fetch(`${apiUrl}/matches/${matchId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    })

    if (!res.ok) return ''

    const match = await res.json()
    const home = match?.home_team?.name ?? 'Match'
    const away = match?.away_team?.name ?? ''
    const competition = match?.competition?.name ?? 'Footy Guide'
    const title = away ? `${home} vs ${away}` : home
    const descriptionParts = [
      match?.date,
      match?.time,
      competition,
    ].filter(Boolean)
    const description = descriptionParts.join(' • ')
    const image =
      match?.home_team?.logo_url ||
      match?.away_team?.logo_url ||
      match?.competition?.logo_url

    const url = `${origin}/matches/${matchId}`
    const cardType = image ? 'summary_large_image' : 'summary'

    const metaTags = [
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      `<meta property="og:url" content="${escapeHtml(url)}">`,
      image
        ? `<meta property="og:image" content="${escapeHtml(image)}">`
        : '',
      `<meta name="twitter:card" content="${cardType}">`,
      twitterSite
        ? `<meta name="twitter:site" content="${escapeHtml(twitterSite)}">`
        : '',
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      image
        ? `<meta name="twitter:image" content="${escapeHtml(image)}">`
        : '',
    ]
      .filter(Boolean)
      .join('\n')
    metaCache.set(cacheKey, {
      expires: Date.now() + getMetaCacheTtl(env),
      value: metaTags,
    })
    return metaTags
  } catch {
    return ''
  }
}

async function createServer() {
  const app = express()

  let vite
  let template
  let render
  let env = null

  if (!isProd) {
    const { createServer: createViteServer, loadEnv } = await import('vite')
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
    env = loadEnv('development', root, '')
  } else {
    app.use(
      express.static(path.resolve(root, 'dist/client'), { index: false }),
    )
    template = await fs.readFile(
      path.resolve(root, 'dist/client/index.html'),
      'utf-8',
    )
    render = (await import(path.resolve(root, 'dist/server/entry-server.js')))
      .render
  }

  app.use(/.*/, async (req, res) => {
    try {
      const url = req.originalUrl
      const origin = `${req.protocol}://${req.get('host')}`

      let htmlTemplate = template

      if (!isProd) {
        htmlTemplate = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8')
        htmlTemplate = await vite.transformIndexHtml(url, htmlTemplate)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      }

      const matchId = url.startsWith('/matches/')
        ? url.split('/')[2]?.split('?')[0]
        : null
      const metaTags = matchId
        ? await fetchMatchMeta({ matchId, origin, env })
        : ''

      const { html, state } = await render(url)

      const finalHtml = htmlTemplate
        .replace('<!--head-tags-->', metaTags)
        .replace('<!--app-html-->', html)
        .replace(
          '<!--ssr-state-->',
          `<script>window.__REACT_QUERY_STATE__=${serializeState(
            state,
          )}</script>`,
        )

      const outputHtml = injectHeadTags(finalHtml, metaTags)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(outputHtml)
    } catch (error) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(error)
      }
      console.error(error)
      res.status(500).end('Internal Server Error')
    }
  })

  return app
}

createServer().then(app => {
  const port = Number(process.env.PORT) || 5173
  app.listen(port, () => {
    console.log(`SSR server running on http://localhost:${port}`)
  })
})

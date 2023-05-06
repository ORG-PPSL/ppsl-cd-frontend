// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import * as dotenv from 'dotenv'

import { fileURLToPath, URL } from 'url'
import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
dotenv.config()

const isProduction = !process.argv.includes('--dev')
const root = fileURLToPath(new URL('../', import.meta.url))

startServer()

async function startServer () {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    // TODO: This is too hacky, there must be a better way!
    let userRes = {}
    try {
      userRes = await fetch(
        new URL('./users/session', process.env.API_ENDPOINT),
        { headers: req.headers }
      )
    } catch {}
    let session = null
    if (
      userRes.status === 200 &&
      userRes.headers.get('content-type')?.includes('application/json')
    ) {
      session = await userRes.json()
    }

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      user: session?.user ?? null,
      cookie: req.headers.cookie
    }

    const pageContext = await renderPage(pageContextInit)

    if (pageContext.redirectTo) return res.redirect(307, pageContext.redirectTo)

    const { httpResponse } = pageContext

    if (!httpResponse) return next()

    const { body, statusCode, contentType, earlyHints } = httpResponse

    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    }

    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 5173
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

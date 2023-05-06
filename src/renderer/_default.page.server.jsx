import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'

import { PageShell } from './PageShell'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'user', 'redirectTo']

// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
export async function render (pageContext) {
  const { Page, pageProps, user, redirectTo } = pageContext
  if (!Page) {
    throw new Error('My render() hook expects pageContext.Page to be defined')
  }

  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      {!redirectTo && <Page {...pageProps} user={user} />}
    </PageShell>
  )

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'PPSL CD'
  const desc = (documentProps && documentProps.description) || 'PPSL CD'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <!-- <link rel="icon" href="" /> -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}

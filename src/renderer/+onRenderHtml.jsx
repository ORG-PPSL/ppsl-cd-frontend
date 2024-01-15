import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

import { PageShell } from './PageShell'

// This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
export default async function render (pageContext) {
  const { Page, pageProps, user, redirectTo } = pageContext
  if (!Page) {
    throw new Error('My render() hook expects pageContext.Page to be defined')
  }

  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      {!redirectTo && <Page {...pageProps} user={user} />}
    </PageShell>
  )

  // See https://vike.dev/head

  const { documentProps, getDocumentProps } = pageContext.config

  const title = documentProps?.title || getDocumentProps?.(pageProps)?.title
  const desc =
    documentProps?.description || getDocumentProps?.(pageProps)?.description

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <!-- <link rel="icon" href="" /> -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${desc ? `<meta name="description" content="${desc}" />` : ''}<title>${
          title ? `${title} - ` : ''
        }PPSL CD</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
        <div id="modal"></div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    }
  }
}

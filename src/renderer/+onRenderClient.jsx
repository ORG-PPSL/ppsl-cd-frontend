import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageShell } from './PageShell'

// This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
export default async function render (pageContext) {
  const { Page, pageProps, user } = pageContext

  if (!Page) {
    throw new Error(
      'Client-side render() hook expects pageContext.Page to be defined'
    )
  }

  hydrateRoot(
    document.getElementById('root'),
    <React.StrictMode>
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} user={user} />
      </PageShell>
    </React.StrictMode>
  )
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vike.dev/clientRouting */

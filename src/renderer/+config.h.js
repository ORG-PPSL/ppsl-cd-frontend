// See https://vike.dev/data-fetching
export default {
  passToClient: ['pageProps', 'urlPathname', 'user', 'redirectTo'],
  meta: {
    getDocumentProps: {
      env: 'server-only'
    }
  }
}

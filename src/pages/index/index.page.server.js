export async function onBeforeRender (_) {
  const url = new URL('./posts/system', process.env.API_ENDPOINT)

  let json = {}

  try {
    const res = await fetch(url.href)
    json = await res.json()
  } catch (err) {
    console.error(err)
  }

  return {
    pageContext: {
      pageProps: {
        request: json
      }
    }
  }
}

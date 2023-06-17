import { getPostById } from '#/lib/api/posts'

export async function onBeforeRender (pageContext) {
  if (!pageContext.user) {
    return {
      pageContext: {
        redirectTo: '/login'
      }
    }
  }

  const { id } = pageContext.routeParams

  const json = await getPostById(id)

  return {
    pageContext: {
      pageProps: {
        request: json
      }
    }
  }
}

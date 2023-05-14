import { getPostById } from '@/lib/api/posts'

export async function onBeforeRender (pageContext) {
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

import { isOfPostType } from '#/lib/post'
import { getPostById } from '#/lib/api/posts'
import { getPostHistoryHTMLByPostHistoryId } from '#/lib/api/lexical'

export default async function onBeforeRender (pageContext) {
  const { id } = pageContext.routeParams

  const json = await getPostById(id)

  let html

  if (json.postHistory) {
    const isEntity = isOfPostType(json.outRelations, 'entity')
    const [{ id: postHistoryId }] = json.postHistory
    const text = await getPostHistoryHTMLByPostHistoryId(
      isEntity ? 'entity' : 'bio',
      postHistoryId
    )

    try {
      JSON.parse(text)
      html = undefined
    } catch {
      html = text
    }
  }

  return {
    pageContext: {
      pageProps: {
        request: json,
        html
      }
    }
  }
}

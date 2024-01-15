import { getPostById, getUserReviewByPostId } from '#/lib/api/posts'

export default async function onBeforeRender (pageContext) {
  if (!pageContext.user) {
    return {
      pageContext: {
        redirectTo: '/login'
      }
    }
  }

  const { id } = pageContext.routeParams

  const json = await getPostById(id)

  let review
  try {
    review = await getUserReviewByPostId(id, pageContext.cookie)
  } catch {
    /* NOP */
  }

  return {
    pageContext: {
      pageProps: {
        post: json,
        review
      }
    }
  }
}

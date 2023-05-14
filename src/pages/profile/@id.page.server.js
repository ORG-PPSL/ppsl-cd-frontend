import { getUserById } from '@/lib/api/user'

export async function onBeforeRender (pageContext) {
  // if (!pageContext.user) {
  //   return {
  //     pageContext: {
  //       redirectTo: '/login'
  //     }
  //   }
  // }

  const { id } = pageContext.routeParams

  let json = {}

  if (id === pageContext.user?.id) {
    json = pageContext.user
  }

  json = { ...json, ...(await getUserById(id, pageContext.cookie)) }

  return {
    pageContext: {
      pageProps: {
        request: json
      }
    }
  }
}

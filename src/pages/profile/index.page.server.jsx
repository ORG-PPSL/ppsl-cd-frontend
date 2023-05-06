export function onBeforeRender (pageContext) {
  if (!pageContext.user) {
    return {
      pageContext: {
        redirectTo: '/login'
      }
    }
  }

  return {
    pageContext: {
      redirectTo: `/profile/${pageContext.user.id}`
    }
  }
}

export function Page () {}

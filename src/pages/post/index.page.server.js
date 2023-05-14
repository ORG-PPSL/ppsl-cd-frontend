export async function onBeforeRender (pageContext) {
  if (!pageContext.user) {
    return {
      pageContext: {
        redirectTo: '/login'
      }
    }
  }
}

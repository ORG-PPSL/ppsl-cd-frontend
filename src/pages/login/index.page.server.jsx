export function onBeforeRender (pageContext) {
  if (pageContext.user) {
    return {
      pageContext: {
        redirectTo: '/'
      }
    }
  }
}

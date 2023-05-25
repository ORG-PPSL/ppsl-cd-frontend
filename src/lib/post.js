export function isOfPostType (relations, type) {
  return relations.some(
    (relation) => relation.isSystem && relation.toPost.id === type
  )
}

export function getEditURLForPost (urlPathname /* relations */) {
  return `${urlPathname}/edit`

  // if (isOfPostType(relations, 'entity')) return `${urlPathname}/edit`
  // if (isOfPostType(relations, 'bio')) return '/profile'
}

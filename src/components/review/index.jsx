import { usePageContext } from '#/renderer/usePageContext'

import { API_ENDPOINT, usePaginatedEndpoint } from '#/lib/api/posts'

import { ReviewsList } from './List'
import { ReviewTitle } from './Title'

export function Reviews ({ postId }) {
  const { urlPathname } = usePageContext()

  const url = new URL(`./posts/id/${postId}/reviews`, API_ENDPOINT)

  const { isLoading, isFetching, response } = usePaginatedEndpoint(
    0,
    url,
    null,
    `reviews-list-${postId}`
  )

  return (
    <>
      <ReviewTitle
        title={`Reviews x${response?.count ?? 0}`}
        edit={{ href: `${urlPathname}/review` }}
      />

      {!isLoading && !isFetching && response
        ? (
        <ReviewsList reviews={response.result} title="Latest reviews" />
          )
        : (
        <label className="flex flex-col gap-2">
          <span>Loading...</span>
          <progress />
        </label>
          )}
    </>
  )
}

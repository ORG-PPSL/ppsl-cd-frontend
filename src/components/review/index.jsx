import { usePageContext } from '#/renderer/usePageContext'

import { API_ENDPOINT, usePaginatedEndpoint } from '#/lib/api/posts'

import { ReviewsList } from './List'
import { ReviewTitle } from './Title'
import { ReviewCardPlaceholder } from './Card'

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
        title={`Reviews ${response?.count ? `x${response.count}` : ''}`}
        edit={{ href: `${urlPathname}/review` }}
      />

      {!isLoading && !isFetching && response
        ? (
        <ReviewsList reviews={response.result} title="Latest reviews" />
          )
        : (
        <div className="flex flex-col gap-2">
          <strong>Latest reviews</strong>
          <div className="flex flex-col lg:block lg:columns-2">
            <ReviewCardPlaceholder count={4} />
          </div>
        </div>
          )}
    </>
  )
}

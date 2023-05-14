import { Container } from '@/components/Container'
import { PostTitle } from '@/components/post/Title'

import { usePageContext } from '@/renderer/usePageContext'

import { tryParseContent } from '@/lib/api/posts/utils'

import { ReviewTitle } from '@/components/review/Title'
import { EntityHTML } from '@/components/ppsl-cd-lexical-shared/src/editors/Entity/read'
import { useGetReviewsByPostId } from '@/lib/api/posts'
import { ReviewCard } from '@/components/review/Card'

export function Page (pageProps) {
  const { urlPathname } = usePageContext()
  const { request } = pageProps

  const [{ title, content, createdTimestamp }] = request.postHistory

  const parsedContent = tryParseContent(content, true)

  const { isLoading, isFetching, response } = useGetReviewsByPostId(request.id)

  return (
    <Container>
      <div className="p-4 sm:p-8">
        <PostTitle
          title={title}
          createdTimestamp={createdTimestamp}
          edit={{ href: `${urlPathname}/edit` }}
        />

        <EntityHTML initialContent={parsedContent} />

        <div className="mt-12">
          <ReviewTitle
            title="Reviews"
            edit={{ href: `${urlPathname}/review` }}
          />

          <div className="flex flex-col gap-2">
            <strong>Latest reviews</strong>
            {!isLoading && !isFetching
              ? (
              <div className="flex grid-cols-2 flex-col gap-2 lg:!grid">
                {response?.result?.map((review) => (
                  <ReviewCard
                    key={review.id}
                    type={review.type}
                    user={{ id: review.userId, ...review.user }}
                    {...review.fromPost}
                  />
                ))}
              </div>
                )
              : (
              <label className="flex flex-col gap-2">
                <span>Loading...</span>
                <progress />
              </label>
                )}
          </div>
        </div>
      </div>
    </Container>
  )
}

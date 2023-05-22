import { useGetReviewsByPostId } from '@/lib/api/posts'

import { ReviewCard } from '@/components/review/Card'

export function ReviewsList ({ postId }) {
  const { isLoading, isFetching, response } = useGetReviewsByPostId(postId)

  return (
    <div className="flex flex-col gap-2">
      <strong>Latest reviews</strong>
      {!isLoading && !isFetching
        ? (
        <div className="flex flex-col lg:block lg:columns-2">
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
  )
}

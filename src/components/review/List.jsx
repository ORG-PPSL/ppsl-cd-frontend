import { ReviewCard } from '#/components/review/Card'

export function ReviewsList ({ title = '', reviews }) {
  return (
    <div className="flex flex-col gap-2">
      <strong>{title}</strong>
      <div className="flex flex-col lg:block lg:columns-2">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            type={review.type}
            user={{ id: review.userId, ...review.user }}
            {...review.fromPost}
          />
        ))}
      </div>
    </div>
  )
}

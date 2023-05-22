import { isOfPostType } from '@/lib/post'

import { Link } from '@/renderer/Link'

import { Container } from '@/components/Container'
import { ReviewForm } from '@/components/review/Form'
import { BioForm } from '@/components/bio/Form'
import { EntityForm } from '@/components/entity/Form'

export function Page (pageProps) {
  const { request } = pageProps

  const isSystem = isOfPostType(request.outRelations, 'system')
  const isEntity = isOfPostType(request.outRelations, 'entity')
  const isBio = isOfPostType(request.outRelations, 'bio')
  const isReview = isOfPostType(request.outRelations, 'review')

  return (
    <Container>
      {(isSystem || request.id === 'system') && (
        <p className="m-0 bg-gray-100 bg-opacity-10 p-4">
          This is a system post. Editing not supported yet.
          <br />
          <Link href=".">
            Return to &quot;{request.postHistory[0].title}&quot;
          </Link>
        </p>
      )}

      {isEntity && <EntityForm entity={request} />}

      {isReview && (
        <>
          <p className="m-0 bg-yellow-700 bg-opacity-10 p-4">
            <span>
              You are in the Global editor for a &quot;
              {request.reviewing.toPost.postHistory[0].title}&quot;{' '}
              <strong>review</strong>. A review can only be changed by its
              author. Consider using the
            </span>{' '}
            <Link href={`/post/${request.reviewing.toPost.id}/review`}>
              review editor
            </Link>{' '}
            for your own review.
          </p>

          <ReviewForm
            post={{ id: request.reviewing.toPost.id }}
            review={{ ...request, postId: request.id }}
          />
        </>
      )}

      {isBio && (
        <>
          <p className="m-0 bg-gray-50 bg-opacity-10 p-4">
            <span>
              You are in the Global editor for a <strong>bio</strong>. A bio can
              only be changed by its author. You can change your own bio at your
            </span>{' '}
            <Link href="/profile">profile page</Link>.
            <br />
          </p>

          <BioForm bio={request} />
        </>
      )}
    </Container>
  )
}

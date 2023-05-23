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
        <hgroup className="m-0 bg-red-500 bg-opacity-10 p-4 sm:p-8">
          <h3>Editing a system entity</h3>
          <p className="m-0 text-gray-500 dark:text-gray-400">
            This is a system post. Editing not supported in UI yet.
            <br />
            <Link href=".">
              Return to &quot;{request.postHistory[0].title}&quot;
            </Link>
          </p>
        </hgroup>
      )}

      {isEntity && (
        <>
          <hgroup className="m-0 bg-opacity-10 p-4 pb-2 sm:p-8 sm:pb-2">
            <h3>Editing an entity</h3>
            <p className="m-0 text-gray-500 dark:text-gray-400">
              <Link href="/terms" target="_blank">
                Don&apos;t forget to read the ToS!
              </Link>
            </p>
          </hgroup>

          <EntityForm entity={request} />
        </>
      )}

      {isReview && (
        <>
          <hgroup className="m-0 mb-4 bg-yellow-700 bg-opacity-10 p-4 sm:p-8">
            <h3>Editing a review</h3>
            <p className="m-0 text-gray-500 dark:text-gray-400">
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
          </hgroup>

          <ReviewForm
            post={{ id: request.reviewing.toPost.id }}
            review={{ ...request, postId: request.id }}
          />
        </>
      )}

      {isBio && (
        <>
          <hgroup className="m-0 bg-yellow-700 bg-opacity-10 p-4 sm:p-8">
            <h3>Editing a bio</h3>
            <p className="m-0 text-gray-500 dark:text-gray-400">
              <span>
                You are in the Global editor for a <strong>bio</strong>. A bio
                can only be changed by its author. You can change your own bio
                at your
              </span>{' '}
              <Link href="/profile">profile page</Link>.
              <br />
            </p>
          </hgroup>

          <BioForm bio={request} />
        </>
      )}
    </Container>
  )
}

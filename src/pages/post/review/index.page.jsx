import { tryParseContent } from '#/lib/api/posts/utils'

import { EntityHTML } from '#/components/ppsl-cd-lexical-shared/src/editors/Entity/read'

import { Container } from '#/components/Container'
import { PostTitle } from '#/components/post/Title'
import { ReviewForm } from '#/components/review/Form'

export function Page (pageProps) {
  const { post, review } = pageProps

  const [{ title: postTitle, content }] = post.postHistory

  const parsedPostContent = tryParseContent(content, true)

  return (
    <Container>
      <div className="p-4 pb-0 sm:p-8 sm:pb-0">
        <PostTitle title={`Reviewing "${postTitle}"`} />

        <details>
          <summary className="!text-cyan-500 underline">Post content</summary>

          <EntityHTML initialContent={parsedPostContent} />
        </details>
      </div>

      <ReviewForm post={{ id: post.id }} review={review} />
    </Container>
  )
}

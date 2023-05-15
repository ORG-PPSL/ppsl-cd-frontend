import { useEffect, useState } from 'react'

import { Link } from '@/renderer/Link'
import { usePageContext } from '@/renderer/usePageContext'

import { tryParseContent } from '@/lib/api/posts/utils'
import { getAuthorsForPostId } from '@/lib/api/posts'

import { Container } from '@/components/Container'
import { PostTitle } from '@/components/post/Title'
import { ReviewTitle } from '@/components/review/Title'
import { Tags } from '@/components/post/Tags'
import { ReviewsList } from '@/components/review/List'
import { EntityHTML } from '@/components/ppsl-cd-lexical-shared/src/editors/Entity/read'

export function Page (pageProps) {
  const { urlPathname } = usePageContext()
  const { request } = pageProps

  const [{ title, content }] = request.postHistory
  const [authors, setAuthors] = useState([])

  const parsedContent = tryParseContent(content, true)

  const isEntity = request.outRelations.some(
    (relation) => relation.isSystem && relation.toPost.id === 'entity'
  )

  useEffect(() => {
    let cancel = false

    async function getAuthors () {
      const authorsRes = await getAuthorsForPostId(request.id)
      if (!cancel) setAuthors(authorsRes)
    }

    getAuthors()

    return () => {
      cancel = true
    }
  }, [request.id])

  return (
    <Container>
      <div className="p-4 sm:p-8">
        <PostTitle
          title={title}
          createdTimestamp={request.createdTimestamp}
          edit={{ href: `${urlPathname}/edit` }}
        />

        <Tags relations={request.outRelations} />

        <EntityHTML initialContent={parsedContent} />

        {isEntity && (
          <>
            <hr className="my-8" />
            <div>
              <ReviewTitle
                title="Reviews"
                edit={{ href: `${urlPathname}/review` }}
              />

              <ReviewsList postId={request.id} />
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            &quot;{title}&quot; post created:{' '}
            {new Date(request.createdTimestamp).toLocaleString()}
          </span>
          <div className="flex flex-wrap gap-1">
            <span>Author{authors.length > 1 && 's'}: </span>
            {authors.map((author, index, arr) => (
              <Link key={author.id} href={`/profile/${author.id}`}>
                {author.name}
                {index < arr.length - 1 && ', '}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}

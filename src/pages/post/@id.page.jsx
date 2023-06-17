import { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'lucide-react'

import { Link } from '#/renderer/Link'
import { usePageContext } from '#/renderer/usePageContext'

import { tryParseContent } from '#/lib/api/posts/utils'
import { getAuthorsForPostId } from '#/lib/api/posts'
import { getEditURLForPost, isOfPostType } from '#/lib/post'

import { EntityHTML } from '#/components/ppsl-cd-lexical-shared/src/editors/Entity/read'
import { BioHTML } from '#/components/ppsl-cd-lexical-shared/src/editors/Bio/read'

import { Container } from '#/components/Container'
import { PostTitle } from '#/components/post/Title'
import { Tags } from '#/components/post/Tags'
import useFormattedDate from '#/components/useFormattedDate'
import { typeToColorClassAndIcon } from '#/components/review/Card'
import { PostsList } from '#/components/post/List'
import { Reviews } from '#/components/review'

export function Page (pageProps) {
  const { urlPathname } = usePageContext()
  const { request, html } = pageProps

  const [{ title, content }] = request.postHistory
  const [authors, setAuthors] = useState([])

  const parsedContent = tryParseContent(content, true)

  const isEntity = isOfPostType(request.outRelations, 'entity')
  const isReview = isOfPostType(request.outRelations, 'review')
  const isBio = isOfPostType(request.outRelations, 'bio')
  const isSystem =
    isOfPostType(request.outRelations, 'system') || request.id === 'system'

  const editURL = getEditURLForPost(urlPathname, request.outRelations)

  const isAuthor = authors.some((author) => author.id === pageProps.user?.id)

  const createdTimestamp = useFormattedDate(request.createdTimestamp)

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
        {isReview && (
          <div className="mb-4 flex flex-col gap-4 leading-none">
            <Link
              href={request.reviewing.toPost.id}
              className="flex items-center py-2"
            >
              <ChevronLeftIcon />
              <span>
                Reviewing &quot;{request.reviewing.toPost.postHistory[0].title}
                &quot;
              </span>
            </Link>
            <span>User review:</span>
            <p
              className={`m-0 ${
                typeToColorClassAndIcon[request.reviewing.type][0]
              } flex items-center gap-2 bg-opacity-10 leading-none`}
            >
              <span
                className={`bg-opacity-75 p-4 text-opacity-75 ${
                  typeToColorClassAndIcon[request.reviewing.type][0]
                }`}
              >
                {typeToColorClassAndIcon[request.reviewing.type][1]}
              </span>
              {request.reviewing.type}
            </p>
          </div>
        )}

        {/* isBio && authors.length > 0 && (
          <Link href={`/profile/${authors[0].id}`} className="flex items-center gap-2 py-2">
            <UserIcon />
            <span>Viewing bio for &quot;{authors[0].name}&quot;</span>
          </Link>
        ) */}

        <PostTitle
          title={title}
          timestamp={request.lastUpdated}
          edit={
            isReview
              ? isAuthor
                ? { href: `/post/${request.reviewing.toPost.id}/review` }
                : null
              : { href: editURL }
          }
        />

        {!!request.outRelations.length && (
          <Tags relations={request.outRelations} />
        )}

        {html
          ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
            )
          : (
          <>
            {isEntity && <EntityHTML initialContent={parsedContent} />}
            {(isBio || isReview) && <BioHTML initialContent={parsedContent} />}
          </>
            )}

        <div className="mt-8 flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            &quot;{title}&quot; post created: {createdTimestamp}
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

        {isEntity && (
          <>
            <hr className="my-8" />
            <Reviews postId={request.id} />
          </>
        )}

        {!isReview && !isBio && (
          <PostsList post={request} isSystem={isSystem || undefined} />
        )}
      </div>
    </Container>
  )
}

// getDocumentProps() can use fetched data to provide <title> and <meta name="description">
export function getDocumentProps (pageProps) {
  const { request } = pageProps

  const [{ title: postHistoryTitle }] = request.postHistory

  let title = postHistoryTitle

  const isReview = isOfPostType(request.outRelations, 'review')

  if (isReview) {
    const [{ title: reviewingPostHistoryTitle }] =
      request.reviewing.toPost.postHistory

    title = `"${postHistoryTitle}" reviewing ${reviewingPostHistoryTitle}`
  }

  return {
    title
  }
}

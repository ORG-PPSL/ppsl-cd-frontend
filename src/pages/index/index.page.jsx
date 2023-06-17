import { useState } from 'react'

import { Link } from '#/renderer/Link'

import { API_ENDPOINT, usePaginatedEndpoint } from '#/lib/api/posts'

import { PostCard, PostCardPlaceholder } from '#/components/post/Card'
import { Container } from '#/components/Container'
import { PaginationButtons } from '#/components/PaginationButtons'

const latestPostsFilter = {
  AND: [
    {
      outRelations: {
        some: {
          toPostId: {
            not: 'system'
          }
        }
      }
    },
    {
      outRelations: {
        some: {
          isSystem: true,
          toPostId: {
            not: 'bio'
          }
        }
      }
    },
    {
      outRelations: {
        some: {
          isSystem: true,
          toPostId: {
            not: 'review'
          }
        }
      }
    }
  ]
}

const url = new URL('./posts/filter', API_ENDPOINT)

export function Page (pageProps) {
  const { request } = pageProps

  const [page, setPage] = useState(0)
  const { response, isLoading, isFetching, canContinue } = usePaginatedEndpoint(
    page,
    url,
    latestPostsFilter,
    'latest-posts'
  )

  return (
    <Container>
      <div className="m-0 bg-slate-200 p-4 dark:bg-opacity-5 sm:p-8">
        <p className="m-0 text-center">
          PPSL is currently a <strong>work in progress</strong>!
          <br />
          Feel free to take a look around and{' '}
          <Link href="/post/">create new entity posts</Link>.
        </p>
      </div>
      <div className="flex flex-col gap-6 p-4 sm:p-8 ">
        <div className="flex flex-col gap-2">
          <strong>System categories</strong>
          <div className="!grid grid-cols-2 gap-2">
            {request.result?.map((post) => {
              const postsWithoutCreatedTimestamp = {
                ...post,
                postHistory: post.postHistory.map((postHistory) => ({
                  ...postHistory,
                  createdTimestamp: null
                }))
              }
              return (
                <PostCard key={post.id} post={postsWithoutCreatedTimestamp} />
              )
            })}
          </div>
        </div>

        <hr />

        <div className="flex flex-col gap-2">
          <strong>Latest edited posts</strong>

          <PaginationButtons
            size="small"
            onClick={setPage}
            page={page}
            canContinue={canContinue}
          />
          <div className="!grid grid-cols-2 gap-2">
            {!isLoading && !isFetching
              ? (
                  response?.result?.map((post) => (
                <PostCard key={post.id} post={post} />
                  ))
                )
              : (
              <PostCardPlaceholder count={6} />
                )}
          </div>
          <PaginationButtons
            size="small"
            onClick={setPage}
            page={page}
            canContinue={canContinue}
          />
        </div>
      </div>
    </Container>
  )
}

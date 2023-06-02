import { useState } from 'react'
import { HardHatIcon, StickerIcon, WrenchIcon } from 'lucide-react'

import { Link } from '@/renderer/Link'

import { API_ENDPOINT, usePaginatedEndpoint } from '@/lib/api/posts'

import { PostCard } from '@/components/post/Card'
import { Container } from '@/components/Container'
import { PaginationButtons } from '@/components/PaginationButtons'

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
      <div className="flex flex-col gap-6 p-4 sm:p-8">
        <div className="m-0 inline-flex items-center justify-between gap-2">
          <div className="inline-flex flex-col gap-2">
            <HardHatIcon />
            <StickerIcon />
          </div>
          <p className="m-0 text-center">
            PPSL is currently a <strong>work in progress</strong>!
            <br />
            Feel free to take a look around and{' '}
            <Link href="/post/">create new entity posts</Link>.
          </p>
          <div className="inline-flex flex-col gap-2">
            <StickerIcon />
            <WrenchIcon />
          </div>
        </div>

        <hr />

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
          {!isLoading && !isFetching
            ? (
            <>
              <PaginationButtons
                size="small"
                onClick={setPage}
                page={page}
                canContinue={canContinue}
              />
              <div className="!grid grid-cols-2 gap-2">
                {response?.result?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <PaginationButtons
                size="small"
                onClick={setPage}
                page={page}
                canContinue={canContinue}
              />
            </>
              )
            : (
            <label className="flex flex-col gap-2">
              <span>Loading...</span>
              <progress />
            </label>
              )}
        </div>
      </div>
    </Container>
  )
}

import { useState } from 'react'

import { API_ENDPOINT, usePaginatedEndpoint } from '@/lib/api/posts'

import { PostCard } from './Card'
import { PaginationButtons } from '../PaginationButtons'

const url = new URL('./posts/filter', API_ENDPOINT)

export function PostsList ({ post, isSystem }) {
  const [{ title }] = post.postHistory

  const [page, setPage] = useState(0)
  const { response, isLoading, isFetching, canContinue } = usePaginatedEndpoint(
    page,
    url,
    {
      outRelations: {
        some: {
          isSystem,
          toPostId: post.id
        }
      }
    },
    `posts-list-${post.id}`
  )

  return (
    <>
      <hr className="my-8" />
      <div className="flex flex-col gap-2">
        <strong>
          Latest edited posts {isSystem ? 'in relation to' : 'mentioning'}{' '}
          &quot;{title}&quot;
        </strong>

        {(isLoading || isFetching) && (
          <label className="flex flex-col gap-2">
            <span>Loading...</span>
            <progress />
          </label>
        )}

        {response?.result?.length > 0 && (
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
        )}

        {response?.result?.length === 0 && (
          <>
            <p className="m-0 text-xs">
              No entities are currently {isSystem ? 'related to' : 'mentioning'}{' '}
              this{isSystem && ' system'} entity.{' '}
            </p>
            <p className="m-0 text-xs">
              {!isSystem && (
                <span className="text-gray-500">
                  Can be mentioned by typing <code>@{title}</code> in the editor
                  of other entities.
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </>
  )
}

// Documentation available at the Swagger endpoint.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 50 is current database max take for pagination.
const MAX_PAGINATION_TAKE = 50

const jsonHeaders = new Headers({ 'content-type': 'application/json' })

const origin = globalThis?.location?.origin
export const API_ENDPOINT = origin
  ? `${origin}/api/`
  : process.env.API_ENDPOINT

export async function getPostById (id) {
  const url = new URL(`./posts/id/${id}`, API_ENDPOINT)
  const res = await fetch(url)
  return await res.json()
}

export async function getPostsByTitle (title, filter = []) {
  const url = new URL('./posts/filter', API_ENDPOINT)

  const query = {
    AND: [
      {
        postHistory: {
          some: {
            title: {
              startsWith: title,
              mode: 'insensitive'
            }
          }
        }
      },
      ...filter
    ]
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(query)
  })

  return await res.json()
}

export async function getUserReviewByPostId (id, cookie) {
  const url = new URL(`./posts/id/${id}/review`, API_ENDPOINT)

  const res = await fetch(url, { headers: { cookie } })
  return await res.json()
}

export function usePaginatedEndpoint (
  page = 0,
  url,
  filter,
  id = 'paginated-endpoint'
) {
  const [cursor, setCursor] = useState()

  const { error, isInitialLoading, isLoading, isFetching, data } = useQuery({
    queryKey: [id, page],
    queryFn: async ({ queryKey: [_, page] }) => {
      if (page) {
        url.searchParams.set('cursor', cursor)
      }

      const body = filter

      const res = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: body ? jsonHeaders : undefined,
        body: body ? JSON.stringify(body) : undefined
      })

      const json = await res.json()

      if (json.cursor) {
        setCursor(json.cursor)
      }

      return json
    },
    keepPreviousData: true,
    staleTime: Infinity,
    cacheTime: Infinity
  })

  const maxPage = data ? Math.ceil(data.count / MAX_PAGINATION_TAKE) : null

  const canContinue = maxPage ? page !== maxPage - 1 : false

  return {
    error,
    page,
    canContinue,
    response: data,
    isLoading,
    isFetching,
    isInitialLoading
  }
}

export async function getAuthorsForPostId (postId) {
  const url = new URL(`./posts/id/${postId}/authors`, API_ENDPOINT)
  const res = await fetch(url)
  return await res.json()
}

export async function updatePostById (postId, body) {
  const res = await fetch(`/api/posts/id/${postId}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })

  return res
}

/**
 * @param {string} title
 * @param {string} language
 * @param {string} content
 */
export async function createPost (title, language, content) {
  return await fetch('/api/posts/', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ title, language, content })
  })
}

export async function upsertReviewForPostId (postId, body) {
  const res = await fetch(`/api/posts/id/${postId}/reviews`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  })

  return res
}

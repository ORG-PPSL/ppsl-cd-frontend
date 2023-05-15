// Documentation available at the Swagger endpoint.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const jsonHeaders = new Headers()
jsonHeaders.append('content-type', 'application/json')

const origin = globalThis?.location?.origin
const API_ENDPOINT = origin ? `${origin}/api/` : process.env.API_ENDPOINT

export async function getPostById (id) {
  const url = new URL(`./posts/id/${id}`, API_ENDPOINT)
  const res = await fetch(url)
  return await res.json()
}

export async function getPostsByTitle (title) {
  const url = new URL('./posts/filter', API_ENDPOINT)

  const query = {
    postHistory: {
      some: {
        title: {
          startsWith: title,
          mode: 'insensitive'
        }
      }
    }
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

export function useGetLatestPosts (page = 0) {
  const [cursor, setCursor] = useState()

  const { error, isInitialLoading, isLoading, isFetching, data } = useQuery({
    queryKey: ['latest-posts', page],
    queryFn: async ({ queryKey: [_, page] }) => {
      const url = new URL('./posts/filter', API_ENDPOINT)

      if (page) {
        url.searchParams.append('cursor', cursor)
      }

      const body = {
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

      const res = await fetch(url, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(body)
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

  return {
    error,
    page,
    canContinue: !!cursor,
    response: data,
    isLoading,
    isFetching,
    isInitialLoading
  }
}

export function useGetReviewsByPostId (postId, page = 0) {
  const [cursor, setCursor] = useState()

  const { error, isInitialLoading, isLoading, isFetching, data } = useQuery({
    queryKey: ['latest-posts', postId, page],
    queryFn: async ({ queryKey: [_, postId] }) => {
      const url = new URL(`./posts/id/${postId}/reviews`, API_ENDPOINT)

      if (page) {
        url.searchParams.append('cursor', cursor)
      }

      const res = await fetch(url)

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

  return {
    error,
    page,
    canContinue: !!cursor,
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

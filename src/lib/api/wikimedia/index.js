import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function useWikimediaCommonsQueryAllImages (query, page = 0) {
  const [continueObj, setContinueObj] = useState()

  const {
    isLoading,
    isFetching,
    error,
    data,
    isInitialLoading,
    isPreviousData
  } = useQuery({
    queryKey: ['wikimedia-commons', query, page],
    queryFn: async ({ queryKey: [_, query] }) => {
      const endpoint = new URL('https://commons.wikimedia.org/w/api.php')
      endpoint.searchParams.append('action', 'query')
      endpoint.searchParams.append('format', 'json')
      endpoint.searchParams.append('list', 'allimages')
      endpoint.searchParams.append('redirects', '1')
      endpoint.searchParams.append('', '')
      endpoint.searchParams.append('origin', '*')
      endpoint.searchParams.append('aiprop', 'badfile|url')
      endpoint.searchParams.append('aifrom', query)

      if (!!page && continueObj && isPreviousData) {
        const queriesToAdd = Object.entries(continueObj)
        for (let index = 0; index < queriesToAdd.length; index++) {
          const [key, value] = queriesToAdd[index]
          endpoint.searchParams.set(key, value)
        }
      }

      const response = await fetch(endpoint)

      if (!response.ok) {
        const error = new Error(
          `Response not OK: ${response.status} ${response.statusText}`
        )
        error.name = response.status
        console.error(response)
        throw error
      }

      const json = await response.json()

      setContinueObj(json.continue)

      return json
    },
    enabled: !!query,
    keepPreviousData: true,
    staleTime: Infinity,
    cacheTime: Infinity
  })

  return {
    error,
    page,
    canContinue: !!continueObj,
    response: data,
    isLoading,
    isFetching,
    isInitialLoading
  }
}

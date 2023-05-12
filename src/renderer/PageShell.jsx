import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import './pico.scss'

import { PageContextProvider } from './usePageContext'

const queryClient = new QueryClient()

export function PageShell ({ pageContext, children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PageContextProvider pageContext={pageContext}>
        {children}
      </PageContextProvider>
    </QueryClientProvider>
  )
}

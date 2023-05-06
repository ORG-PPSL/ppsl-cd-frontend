import './index.css'
import './pico.scss'

import { PageContextProvider } from './usePageContext'

export function PageShell ({ pageContext, children }) {
  return (
    <PageContextProvider pageContext={pageContext}>
      {children}
    </PageContextProvider>
  )
}

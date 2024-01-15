// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vike.dev/pageContext-anywhere

import React, { useContext } from 'react'

const Context = React.createContext(undefined)

export function PageContextProvider ({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export function usePageContext () {
  const pageContext = useContext(Context)
  return pageContext
}

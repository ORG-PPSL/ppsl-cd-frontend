import { Footer } from './Footer'
import { Header } from './Header'

export function Container ({ className = '', header = {}, children }) {
  return (
    <main className="container">
      <article className={`m-0 px-0 max-sm:pt-0 ${className}`}>
        <Header {...header} />
        {children}
        <Footer />
      </article>
    </main>
  )
}

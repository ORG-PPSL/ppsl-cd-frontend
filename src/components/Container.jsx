import { Footer } from './Footer'
import { Header } from './Header'

export function Container ({ className = '', header = {}, children }) {
  return (
    <>
      <div className="sticky top-0 border-b-slate-950 border-opacity-25 bg-white py-4 leading-none shadow-lg dark:border-b dark:bg-[#11191f] dark:bg-gradient-to-r dark:from-[#18232c]">
        <nav className="container">
          <Header {...header} className="w-full" />
        </nav>
      </div>
      <main className="container !pt-0">
        <article className={`m-0 px-0 pt-0 ${className} rounded-t-none`}>
          {children}
          <Footer />
        </article>
      </main>
    </>
  )
}

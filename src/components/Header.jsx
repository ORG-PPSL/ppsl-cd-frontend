import { signOut } from 'fastify-next-auth/client'

import { Link } from '#/renderer/Link'
import { usePageContext } from '#/renderer/usePageContext'
import { Button } from './Button'

export function Header ({ className = '', title }) {
  const { urlPathname, user } = usePageContext()

  return (
    <header
      className={`mx-0 mb-0 ${className} flex items-end justify-between gap-2 px-8`}
    >
      <a href="/">
        <hgroup className="m-0 flex flex-col items-start justify-end gap-2">
          <h1>{title ?? 'PPSL CD'}</h1>
          <h2 className="text-gray-500 dark:text-gray-400">Reviews database</h2>
        </hgroup>
      </a>

      {!user
        ? (
            urlPathname !== '/login' && <Link href="/login">Login</Link>
          )
        : (
        <div className="flex flex-col items-end justify-end gap-2">
          <span>Hello, {user.name}.</span>
          <div className="flex items-center gap-4">
            <Link href="/profile">Profile</Link>
            <Button
              onClick={() => signOut()}
              className="inline-block p-1 text-xs"
            >
              Logout
            </Button>
          </div>
        </div>
          )}
    </header>
  )
}

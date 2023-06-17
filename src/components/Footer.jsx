import { Link } from '#/renderer/Link'
import { usePageContext } from '#/renderer/usePageContext'

export function Footer () {
  const { urlPathname } = usePageContext()

  return (
    <footer className="mx-0 mt-0 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {urlPathname !== '/'
          ? (
          <span>
            <Link href="/">Go to Homepage</Link>
          </span>
            )
          : (
          <span className="basis-1/2">
            PPSL CD is a company reviews database, for consumers, in relation to
            the right-to-repair legislation.
          </span>
            )}

        <div className="flex flex-col flex-wrap items-baseline gap-2">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

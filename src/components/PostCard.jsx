import { Link } from '@/renderer/Link'
import useFormattedDate from './useFormattedDate'

const POST_PAGE_ENDPOINT = '/post'

export function PostCard ({ id, postHistory }) {
  const [{ title, createdTimestamp }] = postHistory

  const timestamp = useFormattedDate(createdTimestamp)

  return (
    <Link href={`${POST_PAGE_ENDPOINT}/${id}`} className="no-underline">
      <article className="m-0 h-full p-0">
        <header className="m-0 flex h-full flex-col p-3">
          <strong>{title || <i>Missing title!</i>}</strong>
          {timestamp && <small className="text-xs">{timestamp}</small>}
        </header>
      </article>
    </Link>
  )
}

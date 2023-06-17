import { Link } from '#/renderer/Link'

import useFormattedDate from '../useFormattedDate'

const POST_PAGE_ENDPOINT = '/post'

export function PostCard ({ post }) {
  const [{ title, createdTimestamp }] = post.postHistory

  const timestamp = useFormattedDate(createdTimestamp)

  return (
    <Link href={`${POST_PAGE_ENDPOINT}/${post.id}`} className="no-underline">
      <article className="m-0 h-full p-0">
        <header className="m-0 flex h-full flex-col p-3">
          <strong>{title || <i>Missing title!</i>}</strong>
          {timestamp && <small className="text-xs">{timestamp}</small>}
        </header>
      </article>
    </Link>
  )
}

export function PostCardPlaceholder ({ count }) {
  return [...Array(count || 1)].map((_, i) => (
    <article className="m-0 h-full p-0" key={i}>
      <header className="m-0 flex h-full flex-col p-3">
        <strong className="h-6 w-1/4 animate-pulse bg-slate-400 bg-opacity-25"></strong>
        <small className="h-4 w-1/2 animate-pulse bg-slate-400 bg-opacity-25"></small>
      </header>
    </article>
  ))
}

import { Link } from '@/renderer/Link'
import { tryParseContent } from '@/lib/api/posts/utils'

import { BioHTML } from '../ppsl-cd-lexical-shared/src/editors/Bio/read'
import { InfoIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

const POST_PAGE_ENDPOINT = '/post'

const typeToColorClassAndIcon = {
  NEGATIVE: ['bg-red-500', <ThumbsDownIcon key={'NEGATIVE'} />],
  NEUTRAL: ['bg-blue-500', <InfoIcon key={'NEUTRAL'} />],
  POSITIVE: ['bg-green-500', <ThumbsUpIcon key={'POSITIVE'} />]
}

export function ReviewCard ({ type, user, id, createdTimestamp, postHistory }) {
  const [{ title, content }] = postHistory

  const parsedContent = tryParseContent(content, true)

  const [color, icon] = typeToColorClassAndIcon[type]

  return (
    <article className="m-0 overflow-hidden rounded-t-xl p-0">
      <header className="m-0 p-0">
        <Link
          href={`${POST_PAGE_ENDPOINT}/${id}`}
          className="flex items-center p-3 no-underline"
        >
          <div className="flex grow flex-col">
            <span>{user.name}</span>
            <small className="text-xs">
              {new Date(createdTimestamp).toLocaleString()}
            </small>
          </div>
          <div
            className={`h-12 w-12 bg-opacity-75 ${color} flex items-center justify-center text-white text-opacity-75`}
          >
            {icon}
          </div>
        </Link>
      </header>

      <div className="p-3">
        <h4 className="m-0 mb-2">{title || <i>Missing title!</i>}</h4>
        <BioHTML initialContent={parsedContent} />
      </div>
    </article>
  )
}

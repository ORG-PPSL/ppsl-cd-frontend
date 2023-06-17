import { useEffect, useRef, useState } from 'react'
import { InfoIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { Link } from '#/renderer/Link'
import { tryParseContent } from '#/lib/api/posts/utils'

import { BioHTML } from '../ppsl-cd-lexical-shared/src/editors/Bio/read'
import useFormattedDate from '../useFormattedDate'

const POST_PAGE_ENDPOINT = '/post'

export const typeToColorClassAndIcon = {
  NEGATIVE: ['bg-red-500', <ThumbsDownIcon key={'NEGATIVE'} />],
  NEUTRAL: ['bg-blue-500', <InfoIcon key={'NEUTRAL'} />],
  POSITIVE: ['bg-green-500', <ThumbsUpIcon key={'POSITIVE'} />]
}

export function ReviewCard ({ type, user, id, lastUpdated, postHistory }) {
  const [{ title, content }] = postHistory

  const parsedContent = tryParseContent(content, true)

  const [color, icon] = typeToColorClassAndIcon[type]

  const timestamp = useFormattedDate(lastUpdated)

  const [isEmpty, setIsEmpty] = useState(false)
  const handleIsEmpty = (bool) => {
    setIsEmpty(bool)
  }

  // https://stackoverflow.com/a/74255034
  const contentRef = useRef(null)
  const [isClamped, setClamped] = useState(false)

  useEffect(() => {
    // Function that should be called on window resize
    function handleResize () {
      if (contentRef && contentRef.current) {
        setClamped(
          contentRef.current.scrollHeight > contentRef.current.clientHeight
        )
      }
    }

    // Add event listener to window resize
    window.addEventListener('resize', handleResize)
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [contentRef.current])

  const urlToReview = `${POST_PAGE_ENDPOINT}/${id}`

  return (
    <article
      className={`m-0 mb-8 h-fit grow overflow-hidden p-0 last:mb-0 ${
        isEmpty ? 'rounded-xl' : 'rounded-t-xl'
      }`}
    >
      <header className="m-0 p-0 dark:bg-gray-500 dark:bg-opacity-10">
        <Link href={urlToReview} className="flex items-center p-3 no-underline">
          <div className="flex grow flex-col">
            <span>{title}</span>
            <small className="text-xs">
              {user.name} - {timestamp}
            </small>
          </div>
          <div
            className={`h-12 w-12 bg-opacity-75 ${color} flex items-center justify-center text-white text-opacity-75`}
          >
            {icon}
          </div>
        </Link>
      </header>

      <div
        className={`inline-block w-full p-3 dark:bg-gray-600 dark:bg-opacity-10 ${
          isEmpty ? 'hidden' : ''
        }`}
      >
        <BioHTML
          handleIsEmpty={handleIsEmpty}
          className="line-clamp-[12]"
          ref={contentRef}
          initialContent={parsedContent}
        />
        {isClamped && (
          <div className="-m-3 mt-2 bg-gradient-to-t from-gray-500/25 p-3">
            <Link href={urlToReview}>Read more.</Link>
          </div>
        )}
      </div>
    </article>
  )
}

export function ReviewCardPlaceholder ({ count }) {
  return [...Array(count || 1)].map((_, i) => (
    <article
      className="m-0 mb-8 h-fit grow overflow-hidden rounded-xl p-0 last:mb-0"
      key={i}
    >
      <header className="m-0 p-0 dark:bg-gray-500 dark:bg-opacity-10">
        <div className="flex items-center p-3">
          <div className="flex grow flex-col gap-1">
            <span className="block h-7 w-3/4 animate-pulse bg-slate-400 bg-opacity-25"></span>
            <small className="block h-4 w-1/3 animate-pulse bg-slate-400 bg-opacity-25 text-xs"></small>
          </div>
          <div
            className={
              'flex h-12 w-12 items-center justify-center bg-slate-400 bg-opacity-75 text-white text-opacity-75'
            }
          />
        </div>
      </header>
    </article>
  ))
}

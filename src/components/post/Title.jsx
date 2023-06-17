import { ClockIcon, EditIcon } from 'lucide-react'

import { Link } from '#/renderer/Link'

import { Button } from '../Button'
import useFormattedDate from '../useFormattedDate'

export function PostTitle (props) {
  const { title = '', timestamp, edit } = props

  const formattedTimestamp = useFormattedDate(timestamp)

  return (
    <div className="mb-4 flex flex-row items-center justify-between">
      <hgroup className="m-0 grow">
        <h3>{title}</h3>
        {formattedTimestamp
          ? (
          <small className="inline-flex items-center gap-1 !text-xs text-gray-500 dark:text-gray-400">
            <ClockIcon size="1em" /> Edited: {formattedTimestamp}
          </small>
            )
          : timestamp
            ? (
          <small className="my-1 block h-4 w-1/4 animate-pulse bg-slate-400 bg-opacity-25"></small>
              )
            : (
          <span></span>
              )}
      </hgroup>

      {edit?.href
        ? (
        <Link href={edit.href} className="flex items-center gap-2 no-underline">
          {edit?.icon || <EditIcon />}
          <span>{edit?.text || 'Edit'}</span>
        </Link>
          )
        : (
            edit?.handleClick && (
          <Button
            className="flex items-center gap-2 p-1 px-2"
            onClick={edit.handleClick}
          >
            {edit?.icon || <EditIcon />}
            {edit?.text ?? <span>Edit</span>}
          </Button>
            )
          )}
    </div>
  )
}

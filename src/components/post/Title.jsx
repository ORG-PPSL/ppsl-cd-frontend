import { EditIcon } from 'lucide-react'

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
        <span className="!text-xs text-gray-500 dark:text-gray-400">
          {formattedTimestamp}
        </span>
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

import { PlusSquareIcon } from 'lucide-react'

import { Link } from '@/renderer/Link'

export function ReviewTitle (props) {
  const { title = '', edit } = props

  return (
    <div className="mb-4 flex flex-row items-center justify-between">
      <hgroup className="m-0 grow">
        <h3>{title}</h3>
        <span className="text-gray-500 dark:text-gray-400"></span>
      </hgroup>

      {edit && (
        <Link href={edit.href} className="flex items-center gap-2 no-underline">
          {edit?.icon || <PlusSquareIcon />}
          <span>{edit?.text || 'Review'}</span>
        </Link>
      )}
    </div>
  )
}

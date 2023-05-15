import { LockIcon } from 'lucide-react'

import { Link } from '@/renderer/Link'

/**
 * @param {{ relations: Array<{isSystem: boolean, toPost: { id: string, postHistory: Array<{language: string, title: string}>}> } }}
 */
export function Tags ({ relations = [] }) {
  return (
    <div className="my-2 flex flex-wrap gap-2">
      {relations.map(({ isSystem, toPost }) => (
        <Link
          key={toPost.id}
          className="flex items-center gap-1 rounded bg-gray-500 bg-opacity-25 p-1 text-xs leading-none no-underline"
          href={`/post/${toPost.id}`}
          title={isSystem ? 'System tag' : undefined}
        >
          {isSystem && <LockIcon size={'1em'} />}
          <span>{toPost.postHistory[0].title}</span>
        </Link>
      ))}
    </div>
  )
}

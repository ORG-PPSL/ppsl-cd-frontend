import { Button } from './Button'

const getSizeClass = (size) => {
  switch (size) {
    case 'small':
      return 'p-0 text-xs leading-none h-8'
    default:
      return ''
  }
}

/**
 * @param {{ onClick: () => {}, page: number, canContinue: any, size?: 'small', className: string }}
 */
export function PaginationButtons ({
  onClick,
  page,
  canContinue,
  size,
  className = ''
}) {
  const sizeClass = getSizeClass(size)

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        className={`!w-1/2 ${sizeClass}`}
        disabled={page === 0}
        onClick={() => onClick(page - 1)}
      >
        Previous
      </Button>
      <Button
        className={`!w-1/2 ${sizeClass}`}
        onClick={() => onClick(page + 1)}
        disabled={!canContinue}
      >
        Next
      </Button>
    </div>
  )
}

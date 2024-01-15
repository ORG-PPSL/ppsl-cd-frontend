import { Button } from '../Button'

export function ConfirmModal (props) {
  const { title, children, onClose, onConfirm } = props

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const onConfirmCatch = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onConfirm()
  }

  return (
    <form onSubmit={onConfirmCatch}>
      <dialog role="dialog" open>
        <article className="!container relative pb-0">
          <header>
            <a
              href="#close"
              aria-label="close"
              className="close"
              onClick={() => onClose?.()}
            />
            <h4 className="m-0">{title || 'Are you sure?'}</h4>
          </header>

          <div>{children}</div>

          <footer className="sticky bottom-0 mb-0 flex sm:h-12 gap-4 bg-[#18232c] py-2">
            <Button
              type="button"
              className="w-full p-2 text-sm leading-none sm:flex-1"
              onClick={() => onClose?.()}
            >
              Cancel
            </Button>
            <Button
              type={undefined}
              className="w-full p-2 text-sm leading-none text-white sm:flex-1"
            >
              Confirm
            </Button>
          </footer>
        </article>
      </dialog>
    </form>
  )
}

import { useState } from 'react'

import { useWikimediaCommonsQueryAllImages } from '#/lib/api/wikimedia'
import { filterByFileNameExtension } from '#/lib/filename'

import { Button } from '../Button'
import { DebouncedInput } from '../DebouncedInput'
import { PaginationButtons } from '../PaginationButtons'

/**
 * @param {{ image: any, onClick: () => {}, selected: boolean }}
 */
const Result = ({ image, onClick, selected }) => {
  const isSupported = filterByFileNameExtension(image.name, [
    'png',
    'jpg',
    'svg',
    'JPG',
    'jpeg',
    'JPEG'
  ])

  const [blur, setBlur] = useState(true)

  const handleUnblurClick = (e) => {
    e.stopPropagation()
    setBlur(!blur)
  }

  const fileName = image.name.split('.').shift().replace(/_/g, ' ')
  const fileExtension = image.name.split('.').pop()

  return (
    <Button
      key={image.name}
      className={`flex flex-col items-center overflow-hidden p-0 ${
        selected && 'bg-blue-500'
      }`}
      onClick={() => isSupported && onClick(image.url)}
    >
      {isSupported
        ? (
        <>
          <div
            data-unblur-text={blur ? 'Unblur' : ''}
            className="relative flex w-full grow items-center justify-center after:absolute after:content-[attr(data-unblur-text)]"
            onClick={handleUnblurClick}
          >
            <img src={image.url} className={blur ? 'blur-3xl' : ''} />
          </div>
          <span className="w-full text-ellipsis rounded rounded-b-none border-t border-blue-500 bg-blue-500 bg-opacity-50 p-2">
            {fileName}
          </span>
        </>
          )
        : (
        <span className="flex h-full w-full items-center justify-center p-4">
          Unsupported filetype: {fileExtension}
        </span>
          )}
    </Button>
  )
}

/**
 * @param {{ data, onClose: () => {}, onSubmit: (data, url) => {} }} props
 */
export function ChooseImageModal (props) {
  const { data, onClose, onSubmit } = props

  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState()

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const onSubmitCatch = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedImage) return

    onSubmit(data, selectedImage)
  }

  const { error, response, isLoading, isFetching, canContinue } =
    useWikimediaCommonsQueryAllImages(query, page)

  return (
    <form onSubmit={onSubmitCatch}>
      <dialog role="dialog" open>
        <article className="!container">
          <header>
            <a
              href="#close"
              aria-label="close"
              className="close"
              onClick={() => onClose?.()}
            />
            <h4 className="m-0">Choose image from Wikimedia Commons</h4>
          </header>

          <div>
            <strong>
              Make sure you properly use capitalization for your query, e.g.{' '}
              <code className="bg-white text-black">
                <strong className="underline">T</strong>im{' '}
                <strong className="underline">C</strong>ook
              </code>{' '}
              and not{' '}
              <code className="bg-white text-black">
                <strong className="underline">t</strong>im{' '}
                <strong className="underline">c</strong>ook
              </code>
              .
            </strong>
          </div>
          <DebouncedInput
            className="!my-1"
            name="query"
            placeholder="Search..."
            value={query}
            onChange={(value) => {
              setQuery(() => {
                setPage(0)
                return value
              })
            }}
          />

          <div className="mb-4">
            <strong>
              Wikimedia Commons is a global repository of images.{' '}
              <span className="text-red-500">
                Results may contain content that is unsuitable for work.
              </span>
            </strong>
          </div>

          {(isLoading || isFetching) && query && <progress />}

          {!error
            ? (
                response?.query?.allimages && (
              <>
                <PaginationButtons
                  onClick={setPage}
                  page={page}
                  canContinue={canContinue}
                />
                <div className="my-2 !grid auto-rows-auto grid-cols-2 gap-4 rounded-xl bg-gray-500 bg-opacity-10 p-4">
                  {response?.query?.allimages?.map((image) => (
                    <Result
                      key={image.name}
                      image={image}
                      onClick={(v) => setSelectedImage(v)}
                      selected={selectedImage === image.url}
                    />
                  ))}
                </div>
                <PaginationButtons
                  onClick={setPage}
                  page={page}
                  canContinue={canContinue}
                />
              </>
                )
              )
            : (
            <>
              <strong>
                Something went wrong serving content from Wikimedia Commons.
              </strong>
              <pre>{JSON.stringify(error)}</pre>
            </>
              )}

          <footer>
            <Button
              type="button"
              className="mb-2 w-full"
              onClick={() => onClose?.()}
            >
              Cancel
            </Button>
            <button disabled={!selectedImage}>Submit</button>
          </footer>
        </article>
      </dialog>
    </form>
  )
}

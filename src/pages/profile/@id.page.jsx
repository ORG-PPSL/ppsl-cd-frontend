import { useRef, useState } from 'react'
import { EditIcon, XIcon } from 'lucide-react'

import { Container } from '@/components/Container'
import { BioEditor } from '@/components/editors/Bio/editor'

import { tryParseContent } from '@/lib/api/posts/utils'

import cdROMImage from '@/assets/CD-ROM.png'
import { PostTitle } from '@/components/post/Title'

export function Page (pageProps) {
  const [edit, setEdit] = useState(false)

  const { request = {}, user = {} } = pageProps

  const me = request.id === user?.id

  const emailEl = useRef()

  const handleEmailOnFocus = () => {
    emailEl.current.value = request.email
  }

  const handleEmailOnBlur = () => {
    emailEl.current.value = emailEl.current.defaultValue
  }

  const img = request.image
    ? { url: request.image }
    : { url: cdROMImage, ppsl: true }

  const { bio = {} } = request

  const parsedContentRef = useRef(tryParseContent(bio.content, true))

  const handleEditBio = () => {
    setEdit(!edit)
  }

  return (
    <Container>
      <div className="p-4 sm:p-8">
        <div className="mb-4 flex flex-row items-center gap-2">
          <img
            src={img.url}
            className={`h-auto w-16 bg-gray-500 bg-opacity-50 p-2 ${
              img.ppsl && 'opacity-75'
            }`}
          />
          <hgroup className="m-0">
            <h3>Profile</h3>
            <h4>{request.name}</h4>
          </hgroup>
        </div>
        {me && (
          <label>
            <span>Email:</span>
            <input
              readOnly
              defaultValue={'Tap to see email'}
              ref={emailEl}
              onFocus={handleEmailOnFocus}
              onBlur={handleEmailOnBlur}
            />
          </label>
        )}
        <div>
          <PostTitle
            title={bio.title}
            createdTimestamp={bio.createdTimestamp}
            edit={
              me && {
                handleClick: handleEditBio,
                text: edit ? 'Cancel' : 'Edit',
                icon: edit ? <XIcon /> : <EditIcon />
              }
            }
          />
          <BioEditor
            key={edit}
            post={bio}
            readOnly={!edit}
            initialContent={parsedContentRef.current}
          />
        </div>
      </div>
    </Container>
  )
}

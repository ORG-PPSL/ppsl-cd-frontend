import { useRef, useState } from 'react'
import { encode } from '@msgpack/msgpack'
import { EditIcon, XIcon } from 'lucide-react'

import cdROMImage from '#/assets/CD-ROM.png'

import { tryParseContent } from '#/lib/api/posts/utils'
import { updatePostById } from '#/lib/api/posts'

import { BioEditor } from '#/components/ppsl-cd-lexical-shared/src/editors/Bio/editor'
import { BioHTML } from '#/components/ppsl-cd-lexical-shared/src/editors/Bio/read'

import { Container } from '#/components/Container'
import { PostTitle } from '#/components/post/Title'

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

  const onSubmitBio = async ({ event, editor }) => {
    event.preventDefault()

    const content = editor.getEditorState().toJSON()
    const encodedContent = encode(content).toString()

    const body = {
      title: bio.title,
      language: bio.language,
      content: encodedContent
    }

    try {
      const res = await updatePostById(bio.postId, body)

      console.log(await res.text())

      if (res.status >= 200 && res.status < 300) window.location.reload()
      else throw res
    } catch (error) {
      console.error(error)
    }
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
            <h3>{request.name}</h3>
            <h4>Profile</h4>
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
            timestamp={bio.createdTimestamp}
            edit={
              me && {
                handleClick: handleEditBio,
                text: edit ? 'Cancel' : 'Edit',
                icon: edit ? <XIcon /> : <EditIcon />
              }
            }
          />

          {me
            ? (
            <BioEditor
              key={edit}
              post={bio}
              readOnly={!edit}
              onSubmit={onSubmitBio}
              initialContent={parsedContentRef.current}
            />
              )
            : (
            <BioHTML initialContent={parsedContentRef.current} />
              )}
        </div>
      </div>
    </Container>
  )
}

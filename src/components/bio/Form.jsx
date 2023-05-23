import { useState } from 'react'
import { encode } from '@msgpack/msgpack'

import { tryParseContent } from '@/lib/api/posts/utils'
import { updatePostById } from '@/lib/api/posts'

import { BioEditor } from '../ppsl-cd-lexical-shared/src/editors/Bio/editor'

export function BioForm ({ bio }) {
  const [{ language, title, content }] = bio.postHistory

  const parsedContent = tryParseContent(content, true)

  const [newLanguage] = useState(language || 'en')
  const [newTitle] = useState(title || '')
  const [titleError] = useState(title ? '' : 'Required!')

  const onSubmitBio = async ({ event, editor }) => {
    event.preventDefault()

    const content = editor.getEditorState().toJSON()
    const encodedContent = encode(content).toString()

    const body = {
      title: newTitle.trim(),
      language: newLanguage,
      content: encodedContent
    }

    if (body.title.length === 0 || titleError) return

    const id = bio.id

    try {
      const res = await updatePostById(id, body)

      console.log(await res.text())

      if (res.status >= 200 && res.status < 300) {
        window.location.href = `/post/${id}`
      } else {
        throw res
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <BioEditor
      post={bio}
      title={'Editing Bio'}
      onSubmit={onSubmitBio}
      initialContent={parsedContent}
    />
  )
}

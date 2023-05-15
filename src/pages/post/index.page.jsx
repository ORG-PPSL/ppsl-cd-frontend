import { useState } from 'react'
import { encode } from '@msgpack/msgpack'

import { Container } from '@/components/Container'
import { Link } from '@/renderer/Link'
import { EntityEditor } from '@/components/ppsl-cd-lexical-shared/src/editors/Entity/editor'
import { Loader2Icon } from 'lucide-react'

export function Page () {
  const [language, setLanguage] = useState('en')

  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('Required!')
  const handleTitleChange = (e) => {
    const value = e.target.value.trimStart()

    if (value.length === 0) {
      setTitleError('Required!')
    } else {
      setTitleError(null)
    }

    setTitle(value)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  const handleSubmit = async ({ event, editor }) => {
    event.preventDefault()

    const content = editor.getEditorState().toJSON()
    const encodedContent = encode(content).toString()

    const headers = new Headers()
    headers.append('content-type', 'application/json')

    const body = {
      title: title.trim(),
      language,
      content: encodedContent
    }

    if (body.title.length === 0 || titleError) return

    setIsSaving(true)

    try {
      const res = await fetch('/api/posts/', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      if (res.status >= 200 && res.status < 300) {
        const json = await res.json()
        window.location.href = `/post/${json.id}`
      } else {
        console.log(await res.text())
        throw res
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container>
      <div className="p-4">
        <hgroup>
          <h3 className="m-0">Creating a new entity</h3>
          <h4 className="text-gray-500 dark:text-gray-400">
            Give it a title.{' '}
            <Link href="/terms" target="_blank">
              Don&apos;t forget to read the ToS!
            </Link>
          </h4>
        </hgroup>

        {!isSaving
          ? (
          <div className="flex items-start gap-2">
            <label className="m-0 grow">
              <input
                className="!m-0"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                required
              />
              {titleError && <span className="text-red-500">{titleError}</span>}
            </label>
            <select
              className="!m-0 !w-[unset] shrink"
              placeholder="Language"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English (Default)</option>
            </select>
          </div>
            )
          : (
          <progress />
            )}
      </div>

      <div className="relative">
        {isSaving && (
          <div className="absolute z-50 flex h-full w-full animate-pulse items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin">
              <Loader2Icon size="3rem" />
            </div>
          </div>
        )}

        <EntityEditor onSubmit={handleSubmit} title={false} />
      </div>
    </Container>
  )
}

import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import * as Y from 'yjs'

import { Link } from '#/renderer/Link'

import { EntityEditor } from '#/components/ppsl-cd-lexical-shared/src/editors/Entity/editor'
import { Container } from '#/components/Container'
import { InputTitle } from '#/components/inputs/Title'
import { uint8ArrayToString } from '#/lib/yjs'
import { createPost } from '#/lib/api/posts'

const LANGUAGE = 'language'
const TITLE = 'title'

export default function Page ({ user }) {
  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState({
    [TITLE]: '',
    [LANGUAGE]: 'en',
    errors: new Map()
  })

  const handleFormChange = ({ name, value, error }) => {
    const newForm = { ...form }

    newForm[name] = value

    if (error) {
      newForm.errors.set(name, error)
    } else {
      newForm.errors.delete(name)
    }

    setForm(newForm)
  }

  const handleLanguageChange = (e) => {
    handleFormChange({ name: LANGUAGE, value: e.target.value })
  }

  const handleSubmit = async ({ event, yDoc }) => {
    event.preventDefault()

    const { title, language, errors } = form

    if (errors.size > 0) return

    const yjsUpdateState = Y.encodeStateAsUpdateV2(yDoc)
    const encodedContent = uint8ArrayToString(yjsUpdateState)

    setIsSaving(true)

    try {
      const res = await createPost(title.trim(), language, encodedContent)

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
      <div className="p-4 sm:p-8 sm:pb-4">
        <hgroup className="mb-4">
          <h3>Creating a new entity</h3>
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
              <InputTitle
                name={TITLE}
                initialValue={form.title}
                handleChange={handleFormChange}
              />
            </label>
            <select
              className="!m-0 !w-[unset] shrink"
              placeholder="Language"
              value={form.language}
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

        <EntityEditor onSubmit={handleSubmit} title={false} user={user} />
      </div>
    </Container>
  )
}

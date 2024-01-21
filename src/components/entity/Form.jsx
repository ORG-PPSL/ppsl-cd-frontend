import { useState } from 'react'

import { usePageContext } from '#/renderer/usePageContext'
import { tryParseContent } from '#/lib/api/posts/utils'
import { updatePostById } from '#/lib/api/posts'

import { EntityEditor } from '../ppsl-cd-lexical-shared/src/editors/Entity/editor'
import { InputTitle } from '../inputs/Title'

const LANGUAGE = 'language'
const TITLE = 'title'

export function EntityForm ({ entity }) {
  const { user } = usePageContext()
  const [{ language, title, content }] = entity.postHistory

  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState({
    [TITLE]: title || '',
    [LANGUAGE]: language || 'en',
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

  const onSubmitEntity = async ({ event, editor }) => {
    event.preventDefault()

    const { title, language, errors } = form

    if (errors.size > 0) return

    const content = editor.getEditorState().toJSON()

    const body = {
      title,
      language,
      content
    }

    setIsSaving(true)

    try {
      const res = await updatePostById(entity.id, body)

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

  const parsedContent = tryParseContent(content, true)

  return (
    <>
      <div className="px-8 py-4 pt-2">
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
              className="m-0 !w-[unset] shrink"
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

      <EntityEditor
        title={'Editing entity'}
        post={entity}
        onSubmit={onSubmitEntity}
        content={parsedContent}
        user={user}
      />
    </>
  )
}

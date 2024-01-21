import { useState } from 'react'

import { Link } from '#/renderer/Link'

import { tryParseContent } from '#/lib/api/posts/utils'
import { updatePostById, upsertReviewForPostId } from '#/lib/api/posts'

import { BioEditor } from '../ppsl-cd-lexical-shared/src/editors/Bio/editor'
import { InputTitle } from '../inputs/Title'

const LANGUAGE = 'language'
const TITLE = 'title'
const TYPE = 'type'

export function ReviewForm ({ post, review }) {
  let postHistoryReview = {}
  let parsedReview = {}
  let parsedReviewContent

  if (review.id) {
    parsedReview = {
      type: review.type,
      postHistory: review.fromPost
        ? review.fromPost.postHistory
        : review.postHistory
    }

    const [{ title: reviewTitle, content: reviewContent, language }] =
      parsedReview.postHistory

    postHistoryReview = { title: reviewTitle, language }

    parsedReviewContent = tryParseContent(reviewContent, true)
  }

  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState({
    [TITLE]: postHistoryReview.title || '',
    [LANGUAGE]: postHistoryReview.language || 'en',
    [TYPE]: parsedReview.type || 'NEUTRAL',
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

  const handleReviewTypeChange = (e) => {
    handleFormChange({ name: TYPE, value: e.target.value })
  }

  const onSubmitReview = async ({ event, editor }) => {
    event.preventDefault()

    const { title, language, type, errors } = form

    if (errors.size > 0) return

    const content = editor.getEditorState().toJSON()

    const body = {
      title: title.trim(),
      language,
      type,
      content
    }

    setIsSaving(true)

    try {
      let res

      if (!review.id) {
        // Creating new review
        res = await upsertReviewForPostId(post.id, body)
      } else {
        // Updating a review
        res = await updatePostById(review.fromPost?.id || review.postId, body)
      }

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
    <>
      <div className="mb-4 px-8">
        <hgroup className="m-0 mb-2">
          <h4 className="text-gray-500 dark:text-gray-400">
            <Link href="/terms" target="_blank">
              Don&apos;t forget to read the ToS!
            </Link>
          </h4>
        </hgroup>
        {!isSaving
          ? (
          <div className="items-start gap-2 md:flex">
            <label className="m-0 mb-2 md:mb-0">
              <select
                className="m-0 w-[unset]"
                value={form.type}
                placeholder="Review type"
                onChange={handleReviewTypeChange}
              >
                <option value="NEUTRAL">Neutral</option>
                <option value="NEGATIVE">Negative</option>
                <option value="POSITIVE">Positive</option>
              </select>
            </label>
            <label className="m-0 mb-2 grow md:mb-0">
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

      <BioEditor
        title={'Editing review'}
        onSubmit={onSubmitReview}
        initialContent={parsedReviewContent}
      />
    </>
  )
}

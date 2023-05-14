import { encode } from '@msgpack/msgpack'

import { tryParseContent } from '@/lib/api/posts/utils'

import { Container } from '@/components/Container'
import { EntityHTML } from '@/components/ppsl-cd-lexical-shared/src/editors/Entity/read'
import { PostTitle } from '@/components/post/Title'
import { BioEditor } from '@/components/ppsl-cd-lexical-shared/src/editors/Bio/editor'
import { Link } from '@/renderer/Link'
import { useState } from 'react'

export function Page (pageProps) {
  const { post, review } = pageProps

  const [{ title: postTitle, content }] = post.postHistory

  const parsedPostContent = tryParseContent(content, true)

  let parsedReview = {}
  let parsedReviewContent
  let postHistoryReview = {}

  if (review.id) {
    parsedReview = {
      type: review.type,
      postHistory: review.fromPost.postHistory
    }

    const [{ title: reviewTitle, content: reviewContent, language }] =
      parsedReview.postHistory

    postHistoryReview = { title: reviewTitle, language }

    parsedReviewContent = tryParseContent(reviewContent, true)
  }

  const [reviewType, setReviewType] = useState(parsedReview.type || 'NEUTRAL')

  const [language, setLanguage] = useState(postHistoryReview.language || 'en')

  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState(postHistoryReview.title || '')
  const [titleError, setTitleError] = useState(
    postHistoryReview.title ? '' : 'Required!'
  )
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

  const handleReviewTypeChange = (e) => {
    setReviewType(e.target.value)
  }

  const onSubmitReview = async ({ event, editor }) => {
    event.preventDefault()

    const content = editor.getEditorState().toJSON()
    const encodedContent = encode(content).toString()

    const headers = new Headers()
    headers.append('content-type', 'application/json')

    const body = {
      title: title.trim(),
      language,
      type: reviewType,
      content: encodedContent
    }

    if (body.title.length === 0 || titleError) return

    setIsSaving(true)

    try {
      const res = await fetch(`/api/posts/id/${post.id}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      console.log(await res.text())

      if (res.status >= 200 && res.status < 300) window.location.reload()
      else throw res
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container>
      <div className="p-4 sm:p-8">
        <PostTitle title={`Reviewing "${postTitle}"`} />

        <details>
          <summary className="!text-cyan-500 underline">
            View post content
          </summary>

          <EntityHTML initialContent={parsedPostContent} />
        </details>

        <hgroup>
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
            <label className="m-0">
              <select
                className="m-0 w-[unset]"
                value={reviewType}
                placeholder="Review type"
                onChange={handleReviewTypeChange}
              >
                <option value="Neutral">Neutral</option>
                <option value="NEGATIVE">Negative</option>
                <option value="POSITIVE">Positive</option>
              </select>
            </label>
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
              className="!w-[unset] shrink"
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

        <BioEditor
          title={false}
          onSubmit={onSubmitReview}
          initialContent={parsedReviewContent}
        />
      </div>
    </Container>
  )
}

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { editableEditorTheme, readOnlyTheme, theme } from '../theme'
import { Toolbar } from '../toolbar/index'
import { Button } from '../../Button'
import { encode } from '@msgpack/msgpack'

function Placeholder () {
  return (
    <div className="pointer-events-none absolute left-0 top-0 select-none overflow-hidden text-ellipsis p-3">
      Enter some <strong>rich text</strong>...
    </div>
  )
}

function FormSubmitWithEditor ({ children, onSubmit, ...restProps }) {
  const [editor] = useLexicalComposerContext()

  const onSubmitCatch = (event) => {
    onSubmit({ event, editor })
  }

  return (
    <form onSubmit={onSubmitCatch} className="m-0" {...restProps}>
      {children}
    </form>
  )
}

/**
 * @param {{readOnly, post, initialContent}} props
 */
export function BioEditor (props) {
  const { readOnly = false, post = {}, initialContent } = props

  const onSubmitBio = async ({ event, editor }) => {
    event.preventDefault()

    const content = editor.getEditorState().toJSON()
    const encodedContent = encode(content).toString()

    const headers = new Headers()
    headers.append('content-type', 'application/json')

    await fetch('/api/users/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: encodedContent
      })
    })

    window.location.reload()
  }

  /**
   * @type {import("@lexical/react/LexicalComposer").InitialConfigType}
   */
  const editorConfig = {
    // The editor theme
    theme,
    // Handling of errors during update
    onError (error) {
      throw error
    },
    // Any custom nodes go here
    nodes: [],
    // **INITIAL** state.
    editable: !readOnly
  }

  if (initialContent) {
    editorConfig.editorState = initialContent
  }

  const editorTheme = !readOnly ? editableEditorTheme : readOnlyTheme

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <FormSubmitWithEditor onSubmit={onSubmitBio}>
        <article className={editorTheme.article}>
          {!readOnly && (
            <Toolbar
              title={`${!readOnly ? 'Editing ' : ''}${post.title || 'Post'}`}
            />
          )}
          <div className={editorTheme.body}>
            <RichTextPlugin
              placeholder={!readOnly && <Placeholder />}
              contentEditable={
                <ContentEditable className={editorTheme.contentEditable} />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
          {!readOnly && (
            <footer className="m-0 flex justify-end p-3">
              <Button type="submit" className="w-auto p-1 px-2">
                Save
              </Button>
            </footer>
          )}
        </article>
      </FormSubmitWithEditor>
    </LexicalComposer>
  )
}

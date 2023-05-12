import { Container } from '@/components/Container'
import { EntityEditor } from '@/components/ppsl-cd-lexical-shared/src/editors/Entity/editor'

import { tryParseContent } from '@/lib/api/posts/utils'

export function Page (pageProps) {
  const { request } = pageProps

  const [{ content }] = request.postHistory

  const parsedContent = tryParseContent(content, true)

  return (
    <Container>
      <EntityEditor post={request} initialContent={parsedContent} />
    </Container>
  )
}

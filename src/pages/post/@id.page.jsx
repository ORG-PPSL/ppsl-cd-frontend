import { Container } from '@/components/Container'
import { PostTitle } from '@/components/post/Title'

import { usePageContext } from '@/renderer/usePageContext'

import { tryParseContent } from '@/lib/api/posts/utils'

export function Page (pageProps) {
  const { urlPathname } = usePageContext()
  const { request } = pageProps

  const [{ title, content, createdTimestamp }] = request.postHistory

  const parsedContent = tryParseContent(content, true)

  return (
    <Container>
      <div className="p-4 sm:p-8">
        <PostTitle
          title={title}
          createdTimestamp={createdTimestamp}
          edit={{ href: `${urlPathname}/edit` }}
        />

        {/* <BioEditor readOnly post={request} initialContent={parsedContent} /> */}
      </div>
    </Container>
  )
}

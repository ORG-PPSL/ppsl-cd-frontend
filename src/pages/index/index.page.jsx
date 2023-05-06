import { Container } from '@/components/Container'
import { PostCard } from '@/components/PostCard'

export function Page (pageProps) {
  const { request } = pageProps

  return (
    <Container>
      <div className="flex flex-col gap-6 p-4 sm:p-8">
        <div className="flex flex-col gap-2">
          <strong>System posts</strong>
          <div className="!grid grid-cols-2 gap-2">
            {request.result?.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}

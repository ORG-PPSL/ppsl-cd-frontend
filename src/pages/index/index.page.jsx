import { HardHatIcon, StickerIcon, WrenchIcon } from 'lucide-react'
import { Container } from '@/components/Container'
import { PostCard } from '@/components/PostCard'
import { Link } from '@/renderer/Link'
import { useGetLatestPosts } from '@/lib/api/posts'

export function Page (pageProps) {
  const { request } = pageProps

  // const [page, setPage] = useState(0)
  const { response, isLoading, isFetching } = useGetLatestPosts()

  return (
    <Container>
      <div className="flex flex-col gap-6 p-4 sm:p-8">
        <div className="m-0 inline-flex items-center justify-between gap-2">
          <div className="inline-flex flex-col gap-2">
            <HardHatIcon />
            <StickerIcon />
          </div>
          <p className="m-0 text-center">
            PPSL is currently a <strong>work in progress</strong>!
            <br />
            Feel free to take a look around and{' '}
            <Link href="/post/">create new entity posts</Link>.
          </p>
          <div className="inline-flex flex-col gap-2">
            <StickerIcon />
            <WrenchIcon />
          </div>
        </div>

        <hr />

        <div className="flex flex-col gap-2">
          <strong>System posts</strong>
          <div className="!grid grid-cols-2 gap-2">
            {request.result?.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>

        <hr />

        <div className="flex flex-col gap-2">
          <strong>Latest edited posts</strong>
          {!isLoading && !isFetching
            ? (
            <div className="!grid grid-cols-2 gap-2">
              {response?.result?.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
              )
            : (
            <label className="flex flex-col gap-2">
              <span>Loading...</span>
              <progress />
            </label>
              )}
        </div>
      </div>
    </Container>
  )
}

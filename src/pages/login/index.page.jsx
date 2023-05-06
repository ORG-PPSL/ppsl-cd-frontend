import { signIn } from 'fastify-next-auth/client'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

const submitNoOp = (e) => e.preventDefault()

export function Page () {
  return (
    <Container header={{ title: 'Login to PPSL' }}>
      <div className="p-4 sm:p-8">
        <form className="m-0 flex flex-col gap-2" onSubmit={submitNoOp}>
          <Button onClick={() => signIn('google')}>Sign in with Google</Button>
          <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
        </form>
      </div>
    </Container>
  )
}

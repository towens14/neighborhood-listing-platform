import { loginDestination } from '@/lib/authServer'
import { signIn } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams

  return (
    <main>
      <h1>Sign in</h1>
      {error === 'credentials' && <p role="alert">Could not sign in. Check your email and password.</p>}
      {error === 'unavailable' && <p role="alert">Sign-in is temporarily unavailable.</p>}
      <form action={signIn} className="grid max-w-sm gap-4">
        <input type="hidden" name="next" value={loginDestination(next)} />
        <label>
          Email
          <input className="block w-full rounded border p-2" name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input className="block w-full rounded border p-2" name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  )
}

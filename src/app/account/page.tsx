import Link from 'next/link'
import { accountPath, newListingPath, requireUser } from '@/lib/authServer'
import { signOut } from './actions'

export const dynamic = 'force-dynamic'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>
}) {
  const { user } = await requireUser(accountPath)
  const { created, error } = await searchParams

  return (
    <main>
      <h1>Your account</h1>
      <p>Signed in as {user.email}</p>
      {created === '1' && <p role="status">Your property listing was saved.</p>}
      {error === 'signout' && <p role="alert">Could not sign out. Please try again.</p>}
      <Link href={newListingPath}>Create a property listing</Link>
      <form action={signOut} className="mt-4">
        <button type="submit">Sign out</button>
      </form>
    </main>
  )
}

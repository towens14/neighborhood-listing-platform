import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authCookieOptions, supabaseConfig } from './supabaseConfig'

export const accountPath = '/account'
export const newListingPath = '/account/listings/new'
type ProtectedPath = typeof accountPath | typeof newListingPath

export function loginDestination(value: unknown): ProtectedPath {
  return value === newListingPath ? newListingPath : accountPath
}

export async function createAuthClient() {
  const config = supabaseConfig()
  if (!config) return null
  const cookieStore = await cookies()

  return createServerClient(config.url, config.key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components cannot set cookies. The proxy refreshes their sessions.
        }
      },
    },
  })
}

export async function requireUser(path: ProtectedPath) {
  const supabase = await createAuthClient()
  if (!supabase) redirect('/login?error=unavailable')
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user || user.is_anonymous) {
    redirect('/login?next=' + encodeURIComponent(path))
  }
  return { supabase, user }
}

'use server'

import { redirect } from 'next/navigation'
import { createAuthClient, loginDestination } from '@/lib/authServer'

export async function signIn(formData: FormData) {
  const next = loginDestination(formData.get('next'))
  const retry = '/login?next=' + encodeURIComponent(next)
  const email = formData.get('email')
  const password = formData.get('password')
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    redirect(retry + '&error=credentials')
  }

  const supabase = await createAuthClient()
  if (!supabase) redirect(retry + '&error=unavailable')

  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error) redirect(retry + '&error=credentials')
  redirect(next)
}

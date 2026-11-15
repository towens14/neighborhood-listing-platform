'use server'

import { redirect } from 'next/navigation'
import { createAuthClient } from '@/lib/authServer'

export async function signOut() {
  const supabase = await createAuthClient()
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) redirect('/account?error=signout')
  }
  redirect('/login')
}

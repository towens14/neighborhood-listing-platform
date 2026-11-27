import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './supabaseConfig'

export function createServerClient(accessToken?: string) {
  const config = supabaseConfig()
  if (!config) return null

  return createClient(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  })
}

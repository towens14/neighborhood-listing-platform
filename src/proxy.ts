import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { authCookieOptions, supabaseConfig } from './lib/supabaseConfig'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const config = supabaseConfig()
  if (!config) return response

  const supabase = createServerClient(config.url, config.key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
        for (const [name, value] of Object.entries(headers)) {
          response.headers.set(name, value)
        }
      },
    },
  })

  await supabase.auth.getClaims()
  return response
}

export const config = { matcher: ['/account/:path*'] }

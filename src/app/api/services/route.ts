import { z } from 'zod'
import { serviceSchema } from '@/schemas/service'
import { createServerClient } from '@/lib/supabaseServer'
import { listApprovedServices, serviceColumns } from '@/lib/services'

export async function GET() {
  const data = await listApprovedServices()
  return data
    ? Response.json({ data })
    : Response.json({ error: 'Service directory unavailable.' }, { status: 503 })
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => undefined)
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid service details.', details: z.flattenError(parsed.error) },
      { status: 400 },
    )
  }

  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1]
  if (!token) return Response.json({ error: 'Provider sign-in required.' }, { status: 401 })

  const supabase = createServerClient(token)
  if (!supabase) return Response.json({ error: 'Service directory unavailable.' }, { status: 503 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return Response.json({ error: 'Invalid provider session.' }, { status: 401 })

  const { data, error } = await supabase.from('services')
    .insert({ ...parsed.data, provider_id: user.id, status: 'draft' })
    .select(`${serviceColumns}, status`)
    .single()

  if (error?.code === '42501') {
    return Response.json({ error: 'A merchant or provider profile is required.' }, { status: 403 })
  }
  if (error) return Response.json({ error: 'Could not save the service.' }, { status: 500 })

  return Response.json({ data }, { status: 201 })
}

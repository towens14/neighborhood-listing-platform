import { bookingSchema } from '@/schemas/service'
import { createServerClient } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => undefined)
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Enter a valid email, date, and notes of at least 10 characters.' }, { status: 400 })
  }

  const supabase = createServerClient()
  if (!supabase) return Response.json({ error: 'Booking is temporarily unavailable.' }, { status: 503 })

  const { error } = await supabase.from('bookings').insert(parsed.data)
  if (error?.code === '42501' || error?.code === '23503') {
    return Response.json({ error: 'This service is unavailable for booking.' }, { status: 409 })
  }
  if (error) return Response.json({ error: 'Could not save your booking request.' }, { status: 500 })

  return Response.json({ message: 'Your booking request was sent.' }, { status: 201 })
}

import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

export const runtime = 'nodejs'

const greeting = '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Thank you for calling Neighborhood Listing Platform.</Say><Hangup/></Response>'
const fallback = '<?xml version="1.0" encoding="UTF-8"?><Response><Say>We are temporarily unable to take your call. Please try again later.</Say><Hangup/></Response>'

function twiml(body: string) {
  return new Response(body, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } })
}

export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const webhookUrl = process.env.TWILIO_VOICE_WEBHOOK_URL
  if (!authToken || !webhookUrl) {
    console.error('twilio_voice', { event: 'signing_configuration_missing' })
    return new Response('Webhook unavailable', { status: 503 })
  }

  const signature = request.headers.get('X-Twilio-Signature')
  if (!signature) return new Response('Invalid Twilio signature', { status: 403 })

  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/x-www-form-urlencoded') {
    return new Response('Expected form-encoded request', { status: 415 })
  }

  const form = new URLSearchParams(await request.text())
  const parameters: Record<string, string[]> = Object.create(null)
  for (const [name, value] of form) (parameters[name] ??= []).push(value)

  if (!twilio.validateRequest(authToken, signature, webhookUrl, parameters)) {
    return new Response('Invalid Twilio signature', { status: 403 })
  }

  const callSid = form.get('CallSid')
  if (form.getAll('CallSid').length !== 1 || !callSid || !/^CA[0-9a-f]{32}$/i.test(callSid)) {
    return new Response('Invalid CallSid', { status: 400 })
  }

  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Missing database configuration')

    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await db
      .from('twilio_voice_receipts')
      .upsert({ call_sid: callSid }, { onConflict: 'call_sid', ignoreDuplicates: true })
      .select('call_sid')
      .abortSignal(AbortSignal.timeout(2500))

    if (error) throw error

    console.info('twilio_voice', { event: data.length ? 'accepted' : 'duplicate' })
    return twiml(greeting)
  } catch {
    console.error('twilio_voice', { event: 'receipt_write_failed' })
    return twiml(fallback)
  }
}

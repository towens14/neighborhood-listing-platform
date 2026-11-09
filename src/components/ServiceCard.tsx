'use client'

import { useRef, useState, type FormEvent } from 'react'

type ServiceCardProps = {
  service: {
    id: string
    title: string
    hourly_rate: number
    duration_minutes: number
    coverage_radius_miles: number
  }
}

const focusRing = 'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700'
const fieldClass = `w-full rounded border border-slate-500 p-2 ${focusRing}`
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function ServiceCard({ service }: ServiceCardProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const submitLock = useRef(false)
  const formId = `booking-${service.id}`

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current) return
    submitLock.current = true

    const form = event.currentTarget
    const fields = new FormData(form)
    setPending(true)
    setMessage('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fields), service_id: service.id }),
      })
      const result = await response.json()
      setFailed(!response.ok)
      setMessage(response.ok ? result.message : result.error)
      if (response.ok) form.reset()
    } catch {
      setFailed(true)
      setMessage('Could not send your request. Try again.')
    } finally {
      submitLock.current = false
      setPending(false)
    }
  }

  return (
    <article className="min-w-0 rounded-xl border border-slate-300 bg-white pb-4">
      <header><h2 className="break-words pt-4">{service.title}</h2></header>
      <ul className="list-inside list-disc px-4">
        <li>{currency.format(service.hourly_rate)} per hour</li>
        <li>{service.duration_minutes} minutes</li>
        <li>{service.coverage_radius_miles} mile coverage radius</li>
      </ul>
      <button
        type="button"
        className={focusRing}
        aria-label={`${open ? 'Close booking form for' : 'Book appointment for'} ${service.title}`}
        aria-expanded={open}
        aria-controls={formId}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close booking form' : 'Book now'}
      </button>
      <div id={formId} hidden={!open}>
        <form onSubmit={submitBooking} className="mt-3 grid items-start">
          <div>
            <label htmlFor={`${formId}-email`}>Email</label>
            <input id={`${formId}-email`} name="client_email" type="email" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor={`${formId}-date`}>Requested date</label>
            <input id={`${formId}-date`} name="requested_date" type="date" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor={`${formId}-notes`}>Notes (at least 10 characters)</label>
            <textarea id={`${formId}-notes`} name="notes" required minLength={10} className={fieldClass} />
          </div>
          <button type="submit" disabled={pending} className={focusRing}>
            {pending ? 'Sending…' : 'Send booking request'}
          </button>
          <p role={failed ? 'alert' : 'status'}>{message}</p>
        </form>
      </div>
    </article>
  )
}

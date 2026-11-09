import { z } from 'zod'

export const serviceSchema = z.strictObject({
  title: z.string().trim().min(5),
  hourly_rate: z.number().min(0).max(99_999_999.99),
  duration_minutes: z.number().int().min(15).max(2_147_483_647),
  coverage_radius_miles: z.number().int().positive().max(2_147_483_647),
})

export const bookingSchema = z.strictObject({
  service_id: z.uuid(),
  client_email: z.email(),
  requested_date: z.iso.date(),
  notes: z.string().trim().min(10),
})

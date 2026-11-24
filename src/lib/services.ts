import { createServerClient } from './supabaseServer'

export const serviceColumns = 'id, title, hourly_rate, duration_minutes, coverage_radius_miles'

export async function listApprovedServices() {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('services')
    .select(serviceColumns)
    .eq('status', 'approved')
    .order('title')
  return error ? null : data
}

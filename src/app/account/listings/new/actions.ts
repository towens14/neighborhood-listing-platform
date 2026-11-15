'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { newListingPath, requireUser } from '@/lib/authServer'

const webUrl = z.url({ protocol: /^https?$/ })
const property = z.object({
  title: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(500),
  price: z.coerce.number().min(0).max(9999999999.99).multipleOf(0.01),
  bedrooms: z.coerce.number().int().min(0).max(2147483647),
  bathrooms: z.coerce.number().min(0).max(99.9).multipleOf(0.1),
  image_url: z.string().trim().max(2000).pipe(webUrl),
  image_alt: z.string().trim().min(1).max(500),
  listing_url: z.string().trim().max(2000).pipe(webUrl),
})

export async function createListing(formData: FormData) {
  const { supabase, user } = await requireUser(newListingPath)
  const fields = Object.fromEntries(
    Object.keys(property.shape).map((name) => [name, formData.get(name)]),
  )
  const parsed = property.safeParse(fields)
  if (Object.values(fields).some((value) => typeof value !== 'string' || !value.trim()) || !parsed.success) {
    redirect(newListingPath + '?error=details')
  }

  const { error } = await supabase.from('properties').insert({
    ...parsed.data,
    user_id: user.id,
  })
  if (error) redirect(newListingPath + '?error=save')
  redirect('/account?created=1')
}

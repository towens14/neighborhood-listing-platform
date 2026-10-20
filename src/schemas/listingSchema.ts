import { z } from 'zod'

export const amenityValues = [
  'air_conditioning',
  'balcony',
  'dishwasher',
  'garage',
  'laundry',
  'pool',
  'solar_panels',
  'yard',
] as const

export const sponsorCategoryValues = [
  'cleaning',
  'home_inspection',
  'landscaping',
  'moving',
  'mortgage',
  'other',
] as const

export const PropertyListingSchema = z
  .object({
    property_id: z.string().min(1),
    title: z.string().min(1),
    street_address: z.string().min(3),
    city: z.string().min(2),
    state: z.string().regex(/^[A-Z]{2}$/),
    zip_code: z.string().regex(/^\d{5}(-\d{4})?$/),
    price: z.number().int().nonnegative(),
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().nonnegative(),
    square_feet: z.number().int().positive(),
    amenities: z.array(z.enum(amenityValues)),
    local_sponsors: z.array(z.string().min(1)),
  })
  .strict()

export const SponsorRecordSchema = z
  .object({
    sponsor_id: z.string().min(1),
    business_name: z.string().min(1),
    category: z.enum(sponsorCategoryValues),
    website_url: z.string().url(),
  })
  .strict()

export const PropertySponsorSchema = z
  .object({
    property_id: z.string().min(1),
    sponsor_id: z.string().min(1),
  })
  .strict()

export type PropertyListing = z.infer<typeof PropertyListingSchema>
export type SponsorRecord = z.infer<typeof SponsorRecordSchema>
export type PropertySponsor = z.infer<typeof PropertySponsorSchema>

export const PropertyListingsSchema = z
  .object({
    listings: z.array(PropertyListingSchema).length(5),
  })
  .strict()

export type PropertyListings = z.infer<typeof PropertyListingsSchema>

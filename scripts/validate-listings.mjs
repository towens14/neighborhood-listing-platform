import { readFileSync } from 'node:fs'
import { z } from 'zod'
import {
  PropertyListingsSchema,
  PropertySponsorSchema,
  SponsorRecordSchema,
} from '../src/schemas/listingSchema.ts'

function validateFile(path, schema) {
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  const result = schema.safeParse(raw)

  if (!result.success) {
    for (const issue of result.error.issues) {
      console.error(`${path} — ${issue.path.join('.')}: ${issue.message}`)
    }
    return null
  }

  return result.data
}

const listings = validateFile(
  'data/generated/property-listings.synthetic.json',
  PropertyListingsSchema,
)
const sponsors = validateFile(
  'data/generated/sponsors.synthetic.json',
  z.array(SponsorRecordSchema),
)
const relationships = validateFile(
  'data/generated/property-sponsors.synthetic.json',
  z.array(PropertySponsorSchema),
)

if (!listings || !sponsors || !relationships) {
  process.exit(1)
}

const errors = []
const propertyIds = new Set(listings.listings.map((item) => item.property_id))
const sponsorIds = new Set(sponsors.map((item) => item.sponsor_id))

for (const listing of listings.listings) {
  for (const sponsorId of listing.local_sponsors) {
    if (!sponsorIds.has(sponsorId)) {
      errors.push(`${listing.property_id} refers to unknown sponsor ${sponsorId}`)
    }
  }
}

const expected = new Set(
  listings.listings.flatMap((listing) =>
    listing.local_sponsors.map((sponsorId) => `${listing.property_id}|${sponsorId}`),
  ),
)
const actual = new Set()

for (const row of relationships) {
  const key = `${row.property_id}|${row.sponsor_id}`

  if (!propertyIds.has(row.property_id)) {
    errors.push(`Relationship refers to unknown property ${row.property_id}`)
  }
  if (!sponsorIds.has(row.sponsor_id)) {
    errors.push(`Relationship refers to unknown sponsor ${row.sponsor_id}`)
  }
  if (actual.has(key)) {
    errors.push(`Duplicate relationship: ${key}`)
  }
  actual.add(key)
}

for (const key of expected) {
  if (!actual.has(key)) errors.push(`Missing relationship: ${key}`)
}
for (const key of actual) {
  if (!expected.has(key)) errors.push(`Unexpected relationship: ${key}`)
}

if (errors.length) {
  console.error('INVALID data relationships:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(
  `PASS: ${listings.listings.length} listings, ${sponsors.length} sponsors, and ${relationships.length} relationships validated.`,
)

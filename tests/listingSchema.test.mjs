import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { PropertyListingSchema } from '../src/schemas/listingSchema.ts'

const data = JSON.parse(
  readFileSync('data/generated/property-listings.synthetic.json', 'utf8')
)
const validListing = data.listings[0]

test('accepts a valid property listing', () => {
  assert.equal(PropertyListingSchema.safeParse(validListing).success, true)
})

test('rejects a missing property ID', () => {
  const invalid = { ...validListing }
  delete invalid.property_id
  const result = PropertyListingSchema.safeParse(invalid)

  assert.equal(result.success, false)
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.path[0] === 'property_id'))
  }
})

test('rejects a negative price', () => {
  const result = PropertyListingSchema.safeParse({
    ...validListing,
    price: -1,
  })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.path[0] === 'price'))
  }
})

test('rejects a malformed ZIP code', () => {
  const result = PropertyListingSchema.safeParse({
    ...validListing,
    zip_code: '9A001',
  })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.path[0] === 'zip_code'))
  }
})

test('rejects an unknown property field', () => {
  const result = PropertyListingSchema.safeParse({
    ...validListing,
    unexpected_field: 'not allowed',
  })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.code === 'unrecognized_keys'))
  }
})

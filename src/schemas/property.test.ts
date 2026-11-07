import { describe, expect, it } from 'vitest'
import { PropertySchema } from './property'

const validProperty = {
  property_id: 'TEST-001',
  title: 'Fictional Test Home',
  description: 'A synthetic listing used only for validation tests.',
  address: {
    street: '123 Imaginary Lane',
    city: 'Exampleville',
    state: 'CA',
  },
  zip_code: '90001',
  price: 500000,
  bedrooms: 2,
  bathrooms: 1,
  square_feet: 1000,
  amenities: ['parking'],
  local_sponsors: [],
}

describe('Property data contract', () => {
  it('accepts a valid property', () => {
    const result = PropertySchema.safeParse(validProperty)

    expect(result.success).toBe(true)
  })

  it('rejects a missing property ID', () => {
    const input: Record<string, unknown> = { ...validProperty }
    delete input.property_id

    const result = PropertySchema.safeParse(input)

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues).toHaveLength(1)
    expect(result.error.issues[0]).toMatchObject({
      path: ['property_id'],
      code: 'invalid_type',
    })
  })

  it('rejects a negative price', () => {
    const result = PropertySchema.safeParse({
      ...validProperty,
      price: -1,
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues).toHaveLength(1)
    expect(result.error.issues[0]).toMatchObject({
      path: ['price'],
      code: 'too_small',
    })
  })

  it('rejects an invalid ZIP code', () => {
    const result = PropertySchema.safeParse({
      ...validProperty,
      zip_code: 'ABCDE',
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues).toHaveLength(1)
    expect(result.error.issues[0]).toMatchObject({
      path: ['zip_code'],
      code: 'invalid_format',
    })
  })

  it('rejects an unknown property field', () => {
    const result = PropertySchema.safeParse({
      ...validProperty,
      unexpected_field: 'not allowed',
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues).toHaveLength(1)
    expect(result.error.issues[0]).toMatchObject({
      code: 'unrecognized_keys',
      keys: ['unexpected_field'],
    })
  })
})
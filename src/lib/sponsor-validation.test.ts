import { describe, expect, it } from 'vitest'
import { validateSponsorForPublication } from './sponsor-validation'

const sponsor = {
  businessName: 'Aster Neighborhood Services',
  message: 'Residential cleaning in Los Angeles.',
  websiteUrl: 'https://example.com',
  approvalStatus: 'approved',
  approvedBy: 'Test Reviewer',
  approvedAt: '2026-11-10',
  offerEndDate: '2026-12-31',
  sourceFacts: ['Residential cleaning', 'Los Angeles'],
}

const today = '2026-11-10'

describe('Sponsor publication validation', () => {
  it('accepts approved sponsor copy', () => {
    expect(
      validateSponsorForPublication(sponsor, today).valid
    ).toBe(true)
  })

  it('rejects draft advertisements', () => {
    const result = validateSponsorForPublication(
      { ...sponsor, approvalStatus: 'draft' },
      today
    )
    expect(result.valid).toBe(false)
  })

  it('rejects expired advertisements', () => {
    const result = validateSponsorForPublication(
      { ...sponsor, offerEndDate: '2020-01-01' },
      today
    )
    expect(result.valid).toBe(false)
  })

  it('rejects messages over 120 characters', () => {
    const result = validateSponsorForPublication(
      { ...sponsor, message: 'A'.repeat(121) },
      today
    )
    expect(result.valid).toBe(false)
  })

  it('requires human approval', () => {
    const result = validateSponsorForPublication(
      { ...sponsor, approvedBy: undefined },
      today
    )
    expect(result.valid).toBe(false)
  })

  it('rejects future approval dates', () => {
    const result = validateSponsorForPublication(
      { ...sponsor, approvedAt: '2027-01-01' },
      today
    )
    expect(result.valid).toBe(false)
  })
})
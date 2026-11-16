import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SponsorBanner from './SponsorBanner'
import type { Sponsor } from '../types'

const approvedSponsor: Sponsor = {
  businessName: 'Aster Neighborhood Services',
  message: 'Residential cleaning services in Los Angeles.',
  websiteUrl: 'https://example.com',
  approvalStatus: 'approved',
  approvedBy: 'Test Reviewer',
  approvedAt: '2026-11-10',
  offerEndDate: '2099-12-31',
  sourceFacts: ['Residential cleaning', 'Los Angeles'],
}

describe('SponsorBanner approval workflow', () => {
  it('displays approved sponsor advertisements', () => {
    render(<SponsorBanner sponsor={approvedSponsor} />)

    expect(
      screen.getByText('Aster Neighborhood Services')
    ).toBeTruthy()

    expect(
      screen.getByText('Sponsored Advertisement')
    ).toBeTruthy()
  })

  it('hides draft advertisements', () => {
    const sponsor: Sponsor = {
      ...approvedSponsor,
      approvalStatus: 'draft',
    }

    const { container } = render(
      <SponsorBanner sponsor={sponsor} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('hides rejected advertisements', () => {
    const sponsor: Sponsor = {
      ...approvedSponsor,
      approvalStatus: 'rejected',
    }

    const { container } = render(
      <SponsorBanner sponsor={sponsor} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('hides expired advertisements', () => {
    const sponsor: Sponsor = {
      ...approvedSponsor,
      offerEndDate: '2020-01-01',
    }

    const { container } = render(
      <SponsorBanner sponsor={sponsor} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('blocks messages over 120 characters', () => {
    const sponsor: Sponsor = {
      ...approvedSponsor,
      message: 'A'.repeat(121),
    }

    const { container } = render(
      <SponsorBanner sponsor={sponsor} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('requires an identified human approver', () => {
    const sponsor: Sponsor = {
      ...approvedSponsor,
      approvedBy: undefined,
    }

    const { container } = render(
      <SponsorBanner sponsor={sponsor} />
    )

    expect(container.firstChild).toBeNull()
  })
})
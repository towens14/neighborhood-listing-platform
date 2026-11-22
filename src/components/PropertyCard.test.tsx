import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Property } from '../types'
import PropertyCard from './PropertyCard'

const property: Property = {
  id: 'home-1',
  title: 'Sunny bungalow',
  address: 'Los Angeles, CA',
  price: 285000,
  bedrooms: 2,
  bathrooms: 1,
  imageUrl: '/images/sunny-bungalow-768.webp',
  imageSrcSet: '/images/sunny-bungalow-384.webp 384w, /images/sunny-bungalow-768.webp 768w',
  imageAlt: 'Modern white house beside a swimming pool',
  listingUrl: '/listing/home-1',
}

afterEach(cleanup)

describe('PropertyCard image fallback', () => {
  it('replaces an image that failed before React attached the error handler', () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    try {
      render(<PropertyCard property={property} />)
      const fallback = screen.getByAltText('Property photo unavailable')
      expect(fallback.getAttribute('src')).toBe('/images/property-placeholder.svg')
      expect(fallback.hasAttribute('srcset')).toBe(false)
      expect(screen.getByRole('heading', { name: property.title })).toBeTruthy()
    } finally {
      complete.mockRestore()
    }
  })

  it('replaces an image that fails after rendering', () => {
    const { getByAltText } = render(<PropertyCard property={property} />)
    const image = getByAltText(property.imageAlt)
    fireEvent.error(image)
    expect(getByAltText('Property photo unavailable').getAttribute('src')).toBe('/images/property-placeholder.svg')
  })
})

import { useState } from 'react'
import PropertyCard from './components/PropertyCard'
import SearchFilters, { type FilterValues } from './components/SearchFilters'
import SponsorBanner from './components/SponsorBanner'
import type { Property, Sponsor } from './types'

const properties: Property[] = [
  {
    id: 'home-1',
    title: 'Sunny bungalow',
    address: 'Los Angeles, CA',
    price: 285000,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    imageAlt: 'Modern white house beside a swimming pool',
    listingUrl: 'https://www.zillow.com/homes/Los-Angeles,-CA_rb/',
  },
  {
    id: 'home-2',
    title: 'Modern townhome',
    address: 'Inglewood, CA',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    imageAlt: 'Dark modern house with large windows and a lawn',
    listingUrl: 'https://www.zillow.com/homes/Inglewood,-CA_rb/',
  },
  {
    id: 'home-3',
    title: 'Spacious family home',
    address: 'Pasadena, CA',
    price: 725000,
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    imageAlt: 'Bright living room with sofas and an open kitchen',
    listingUrl: 'https://www.zillow.com/homes/Pasadena,-CA_rb/',
  },
]

const sponsor: Sponsor = {
  businessName: 'Neighborhood Home Services',
  message: 'Explore local help for your next move.',
  websiteUrl: 'https://www.google.com/maps/search/moving+services+Los+Angeles/',
}

function App() {
  const [filters, setFilters] = useState<FilterValues>({
    minBedrooms: 0,
    maxPrice: 0,
  })

  const visibleProperties = properties.filter(
    (property) =>
      property.bedrooms >= filters.minBedrooms &&
      (filters.maxPrice === 0 || property.price <= filters.maxPrice),
  )

  return (
    <main>
      <h1>Neighborhood listings</h1>
      <SearchFilters onSearch={setFilters} />

      <section aria-labelledby="listings-heading">
        <h2 id="listings-heading">Available properties</h2>
        <p>Sample listings and representative photos for demonstration.</p>
        {visibleProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p>No properties match those filters. Try another search.</p>
        )}
      </section>

      <SponsorBanner sponsor={sponsor} />
    </main>
  )
}

export default App
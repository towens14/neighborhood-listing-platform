import { useState } from 'react'
import generatedProperties from '../data/generated/properties.json'
import { PropertyListSchema } from './schemas/property'
import PropertyCard from './components/PropertyCard'
import SearchFilters, { type FilterValues } from './components/SearchFilters'
import SponsorBanner from './components/SponsorBanner'
import type { Property, Sponsor } from './types'

const validation = PropertyListSchema.safeParse(generatedProperties)

const properties: Property[] = validation.success
  ? validation.data.map((property) => ({
      id: property.property_id,
      title: property.title,
      address: `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.zip_code}`,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      imageUrl:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      imageAlt: 'Representative sample house; not the fictional property',
      listingUrl: '#demo-listing-notice',
    }))
  : []

const sponsor: Sponsor = {
  businessName: 'Neighborhood Home Services',
  message: 'Explore local help for your next move.',
  websiteUrl:
    'https://www.google.com/maps/search/moving+services+Los+Angeles/',
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

        <p id="demo-listing-notice">
          Five fictional listings for a student project. Photos are
          representative. These properties are not offered for sale.
        </p>

        {!validation.success ? (
          <p role="alert">
            Listing data could not be loaded because it failed validation.
          </p>
        ) : visibleProperties.length > 0 ? (
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
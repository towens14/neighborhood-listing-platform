import { useState } from 'react'
import { z } from 'zod'
import listingsJson from '../data/generated/property-listings.synthetic.json'
import sponsorsJson from '../data/generated/sponsors.synthetic.json'
import heroImage from './assets/hero.png'
import PropertyCard from './components/PropertyCard'
import SearchFilters, { type FilterValues } from './components/SearchFilters'
import SponsorBanner from './components/SponsorBanner'
import {
  PropertyListingsSchema,
  SponsorRecordSchema,
} from './schemas/listingSchema'
import type { Property, Sponsor } from './types'

const validatedListings = PropertyListingsSchema.parse(listingsJson)
const validatedSponsors = z.array(SponsorRecordSchema).parse(sponsorsJson)

const properties: Property[] = validatedListings.listings.map((listing) => ({
  id: listing.property_id,
  title: listing.title,
  address: `${listing.street_address}, ${listing.city}, ${listing.state} ${listing.zip_code}`,
  price: listing.price,
  bedrooms: listing.bedrooms,
  bathrooms: listing.bathrooms,
  imageUrl: heroImage,
  imageAlt: `Representative image for fictional property in ${listing.city}, ${listing.state}`,
  listingUrl: `https://example.com/listings/${encodeURIComponent(listing.property_id)}`,
}))

const firstSponsor = validatedSponsors[0]

if (!firstSponsor) {
  throw new Error('The demo needs at least one validated sponsor record.')
}

const sponsor: Sponsor = {
  businessName: firstSponsor.business_name,
  message: 'Fictional sponsor example for this demonstration.',
  websiteUrl: firstSponsor.website_url,
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
import type { Property } from '../types'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img
  className="aspect-[4/3] w-full object-cover"
  src={property.imageUrl}
  alt={property.imageAlt}
/>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3>{property.title}</h3>
        <address>{property.address}</address>
        <p>{price}</p>

        <ul>
          <li>{property.bedrooms} bedrooms</li>
          <li>{property.bathrooms} bathrooms</li>
        </ul>

        <a className="mt-auto" href={property.listingUrl}>
          Explore homes near {property.address}
        </a>
      </div>
    </article>
  )
}
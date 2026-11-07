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
        srcSet={property.imageSrcSet}
        sizes={property.imageSrcSet && '(min-width: 1232px) 382px, (min-width: 1024px) calc((100vw - 80px) / 3 - 2px), (min-width: 768px) calc((100vw - 56px) / 2 - 2px), calc(100vw - 34px)'}
        alt={property.imageAlt}
      />
      <h3>{property.title}</h3>
      <address>{property.address}</address>
      <p>{price}</p>

      <ul>
        <li>{property.bedrooms} bedrooms</li>
        <li>{property.bathrooms} bathrooms</li>
      </ul>

      <a href={property.listingUrl}>
       Explore homes near {property.address}
      </a>
    </article>
  )
}
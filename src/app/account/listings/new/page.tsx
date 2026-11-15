import { newListingPath, requireUser } from '@/lib/authServer'
import { createListing } from './actions'

const fields = [
  { name: 'title', label: 'Title', maxLength: 200 },
  { name: 'address', label: 'Address', maxLength: 500 },
  { name: 'price', label: 'Price', type: 'number', min: 0, max: 9999999999.99, step: 0.01 },
  { name: 'bedrooms', label: 'Bedrooms', type: 'number', min: 0, max: 2147483647, step: 1 },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number', min: 0, max: 99.9, step: 0.1 },
  { name: 'image_url', label: 'Image URL', type: 'url', maxLength: 2000 },
  { name: 'image_alt', label: 'Image description', maxLength: 500 },
  { name: 'listing_url', label: 'Listing URL', type: 'url', maxLength: 2000 },
]

export const dynamic = 'force-dynamic'

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  await requireUser(newListingPath)
  const { error } = await searchParams

  return (
    <main>
      <h1>Create a property listing</h1>
      {error === 'details' && <p role="alert">Check the listing details and use HTTP or HTTPS links.</p>}
      {error === 'save' && <p role="alert">Could not save the listing. Please try again.</p>}
      <form action={createListing} className="grid max-w-lg gap-4">
        {fields.map(({ label, ...input }) => (
          <label key={input.name}>
            {label}
            <input type="text" {...input} className="block w-full rounded border p-2" required />
          </label>
        ))}
        <button type="submit">Save listing</button>
      </form>
    </main>
  )
}

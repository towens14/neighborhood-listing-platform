import { useState } from 'react'

export interface FilterValues {
  minBedrooms: number
  maxPrice: number
}

interface SearchFiltersProps {
  onSearch: (filters: FilterValues) => void
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [invalidFilters, setInvalidFilters] = useState(false)

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const minBedrooms = Number(formData.get('minBedrooms'))
    const maxPrice = Number(formData.get('maxPrice'))
    const invalid = ![0, 1, 2, 3].includes(minBedrooms) ||
      ![0, 300000, 500000, 750000].includes(maxPrice) ||
      !formData.get('minBedrooms') || !formData.get('maxPrice')
    setInvalidFilters(invalid)
    if (!invalid) onSearch({ minBedrooms, maxPrice })
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Search properties">
      <div>
        <label htmlFor="minBedrooms">Minimum bedrooms</label>
        <select id="minBedrooms" name="minBedrooms" defaultValue="0">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      <div>
        <label htmlFor="maxPrice">Maximum price</label>
        <select id="maxPrice" name="maxPrice" defaultValue="0">
          <option value="0">Any</option>
          <option value="300000">$300,000</option>
          <option value="500000">$500,000</option>
          <option value="750000">$750,000</option>
        </select>
      </div>

      {invalidFilters && <p role="alert">Choose valid property filters.</p>}
      <button type="submit">Search properties</button>
    </form>
  )
}

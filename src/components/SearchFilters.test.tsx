import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import SearchFilters from './SearchFilters'

afterEach(cleanup)

describe('Property search release paths', () => {
  it('finds the listing that matches both filters', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Minimum bedrooms'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '300000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search properties' }))
    expect(screen.getByRole('heading', { name: 'Sunny bungalow' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Modern townhome' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Spacious family home' })).toBeNull()
  })

  it('shows an empty state for filters with no matches', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Minimum bedrooms'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '300000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search properties' }))
    expect(screen.getByText('No properties match those filters. Try another search.')).toBeTruthy()
  })

  it('rejects a tampered negative filter before searching', () => {
    const onSearch = vi.fn()
    render(<SearchFilters onSearch={onSearch} />)
    const select = screen.getByLabelText<HTMLSelectElement>('Minimum bedrooms')
    select.add(new Option('Invalid', '-1'))
    fireEvent.change(select, { target: { value: '-1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search properties' }))
    expect(screen.getByRole('alert').textContent).toBe('Choose valid property filters.')
    expect(onSearch).not.toHaveBeenCalled()
  })
})

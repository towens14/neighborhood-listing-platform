import type { Metadata } from 'next'
import Link from 'next/link'
import '../index.css'

export const metadata: Metadata = { title: 'Neighborhood Listing Platform' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl gap-6 px-4 pt-5">
          <Link href="/">Properties</Link>
          <Link href="/services">Local services</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}

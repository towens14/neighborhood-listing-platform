import type { Sponsor } from '../types'

interface SponsorBannerProps {
  sponsor: Sponsor
}

export default function SponsorBanner({ sponsor }: SponsorBannerProps) {
  return (
    <aside aria-label="Sponsored business">
      <p>Sponsored</p>
      <h2>{sponsor.businessName}</h2>
      <p>{sponsor.message}</p>
      <a href={sponsor.websiteUrl}>
        Visit {sponsor.businessName}
      </a>
    </aside>
  )
}
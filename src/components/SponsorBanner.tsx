import type { Sponsor } from '../types'

interface SponsorBannerProps {
  sponsor: Sponsor
}

export default function SponsorBanner({ sponsor }: SponsorBannerProps) {
  return (
    <aside aria-label="Sponsored business">
      <p>Sample partner promotion</p>
      <img
        src="/images/neighborhood-services-banner.svg"
        alt=""
        width={288}
        height={108}
        className="my-3 h-auto max-w-full"
        loading="lazy"
      />
      <h2>{sponsor.businessName}</h2>
      <p>{sponsor.message}</p>
      <a href={sponsor.websiteUrl}>
        Visit {sponsor.businessName}
      </a>
    </aside>
  )
}
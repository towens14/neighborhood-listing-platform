import type { Sponsor } from '../types'

interface SponsorBannerProps {
  sponsor: Sponsor
}

export default function SponsorBanner({
  sponsor,
}: SponsorBannerProps) {
  const today = new Date().toISOString().slice(0, 10)

  const isApproved =
    sponsor.approvalStatus === 'approved' &&
    Boolean(sponsor.approvedBy?.trim()) &&
    Boolean(sponsor.approvedAt)

  const isNotExpired =
    !sponsor.offerEndDate ||
    sponsor.offerEndDate >= today

  const isValidLength =
    sponsor.message.length > 0 &&
    sponsor.message.length <= 120

  if (!isApproved || !isNotExpired || !isValidLength) {
    return null
  }

  return (
    <aside aria-label="Sponsored business">
      <p>Sponsored Advertisement</p>

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
export interface Property {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  imageUrl: string
imageSrcSet?: string
  imageAlt: string
  listingUrl: string
}
export interface Sponsor {
  businessName: string
  message: string
  websiteUrl: string
  approvalStatus?: 'draft' | 'approved' | 'rejected' | 'expired'
  approvedBy?: string
  approvedAt?: string
  offerEndDate?: string
  sourceFacts?: string[]
  maxLength?: number
}


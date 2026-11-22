import { z } from 'zod'

export const SponsorCopySchema = z.object({
  businessName: z.string().trim().min(1),
  message: z.string().trim().min(1).max(120),
  websiteUrl: z.string().url(),
  approvalStatus: z.enum([
    'draft',
    'approved',
    'rejected',
    'expired',
  ]),
  approvedBy: z.string().trim().optional(),
  approvedAt: z.iso.date().optional(),
  offerEndDate: z.iso.date().optional(),
  sourceFacts: z.array(z.string()).default([]),
})

export type SponsorCopy = z.infer<typeof SponsorCopySchema>

export function validateSponsorForPublication(
  input: unknown,
  today = new Date().toISOString().slice(0, 10)
) {
  const result = SponsorCopySchema.safeParse(input)

  if (!result.success) {
    return {
      valid: false,
      reason: 'Invalid sponsor data',
    }
  }

  const sponsor = result.data

  if (sponsor.approvalStatus !== 'approved') {
    return {
      valid: false,
      reason: 'Sponsor copy is not approved',
    }
  }

  if (!sponsor.approvedBy || !sponsor.approvedAt) {
    return {
      valid: false,
      reason: 'Human approval is required',
    }
  }

  if (sponsor.approvedAt > today) {
    return {
      valid: false,
      reason: 'Approval date cannot be in the future',
    }
  }

  if (sponsor.offerEndDate && sponsor.offerEndDate < today) {
    return {
      valid: false,
      reason: 'Sponsor offer has expired',
    }
  }

  return {
    valid: true,
    reason: 'Sponsor copy is approved for display',
  }
}
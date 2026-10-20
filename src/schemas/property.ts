import { z } from "zod";

const requiredText = z.string().min(1).regex(/\S/, "Cannot be blank");

export const SponsorSchema = z.strictObject({
  sponsor_id: requiredText,
  business_name: requiredText,
  website: z.string().url().regex(/^https:\/\//, "Must use HTTPS"),
});

export const PropertySponsorSchema = z.strictObject({
  property_id: requiredText,
  sponsor_id: requiredText,
  approval_status: z.enum(["pending", "approved", "rejected"]),
});

export const PropertySchema = z.strictObject({
  property_id: requiredText,
  title: requiredText,
  description: requiredText,

  address: z.strictObject({
    street: requiredText,
    city: requiredText,
    state: z.string().regex(/^[A-Z]{2}$/, "Use a two-letter state code"),
  }),

  zip_code: z.string().regex(/^\d{5}$/, "ZIP must contain five digits"),
  price: z.number().nonnegative(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  square_feet: z.number().positive(),

  amenities: z.array(
    z.enum([
      "parking",
      "laundry",
      "air_conditioning",
      "pool",
      "elevator",
      "patio",
    ]),
  ),

  local_sponsors: z.array(requiredText),
});

export const PropertyListSchema = z.array(PropertySchema).length(5);

export type Property = z.infer<typeof PropertySchema>;
export type Sponsor = z.infer<typeof SponsorSchema>;
export type PropertySponsor = z.infer<typeof PropertySponsorSchema>;
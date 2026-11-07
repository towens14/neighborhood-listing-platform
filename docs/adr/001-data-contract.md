# ADR 001: Property Data Contract

Date: 2026-10-16
Status: Accepted for the student prototype

## Context

The platform needs consistent property data before records reach
the interface or a future database. Generated data is untrusted
until it passes runtime validation.

The current prototype displays property cards and filters them by
bedroom count and price. Detail pages, sponsor selection, and voice
responses are not implemented yet.

## Decision

Use Zod as the source of truth for runtime validation and infer
TypeScript data types from its schemas.

Export JSON Schema from Zod using scripts/export-schema.ts.
Regenerate the exported schema whenever the Zod schema changes.

Keep three separate concepts:

- Property: identified by property_id.
- Sponsor: identified by sponsor_id.
- PropertySponsor: links a property and sponsor, with the pair of
  IDs serving as its proposed composite key and an approval status.

Properties contain local_sponsors as sponsor ID references, not
duplicated business details. When sponsorship is implemented, this
list should be derived from approved PropertySponsor relationships.

## Field Rules and Assumptions

- Required text must contain a non-whitespace character.
- Prices are numeric, nonnegative, and assumed to be US dollars.
- Bedrooms are nonnegative integers; zero supports studios.
- Bathrooms are nonnegative numbers; fractional values are allowed.
- Square footage must be greater than zero.
- ZIP codes are five-digit strings; ZIP+4 is currently unsupported.
- State values must contain two uppercase letters. This checks
  format only, not membership in an official state-code list.
- Unknown fields are rejected in strict objects.
- Amenities use controlled values: parking, laundry,
  air_conditioning, pool, elevator, and patio.
- The seed collection must contain exactly five records.
  This is a lab constraint, not a production listing limit.

## Normalization

Sponsor business details belong in Sponsor records so updates do
not need to be repeated across properties.

PropertySponsor represents the many-to-many relationship between
properties and sponsors.

Amenities use a controlled array for the prototype. Free text was
rejected because spelling differences would complicate filtering.
A separate amenities table and join table remain an option for a
future database requiring richer amenity information.

## Validation and Interface Behavior

The command-line validator checks schema rules and unique property
IDs. It currently rejects nonempty sponsor references because a
sponsor catalog and relationship validation are not implemented.

The interface validates the property collection before mapping it
to existing PropertyCard props. Schema-invalid collections render
an error message instead of property cards.

The existing UI Property type is a presentation model. The mapping
from validated schema data to card props is explicit.

## Alternatives

- Maintain JSON Schema and TypeScript interfaces manually:
  rejected because independently maintained rules can drift.
- Use TypeScript types alone: rejected because types do not
  validate external JSON at runtime.
- Use unrestricted amenity strings: rejected to keep filtering
  consistent.

## Consequences and Limitations

- Schema changes require regenerating JSON Schema and rerunning tests.
- Schema validation does not verify real addresses or market prices.
- Sponsor relationships and approval enforcement remain incomplete.
- The UI currently checks schema rules but does not share the
  command-line duplicate-ID and sponsor-reference checks.
- The standalone demonstration sponsor banner is not connected
  to the validated property records.
- Card photos are representative, not images of real listings.
- Accessibility browser testing remains separate from data tests.

## Verification

Observed local results:

- Five synthetic seed records passed the validator.
- One valid-record test passed.
- Missing ID, negative price, invalid ZIP, and unknown-field
  tests passed by rejecting each input for the expected reason.
- ESLint completed without reported errors.
- TypeScript and the Vite production build completed successfully.

## AI Provenance

ChatGPT assisted with the schema, synthetic records, validator,
tests, and documentation. Listings are fictional and contain no
real client or personal data.

AI Studio generation evidence and Gemini critique have not yet
been completed. ChatGPT output is not presented as evidence from
those tools.
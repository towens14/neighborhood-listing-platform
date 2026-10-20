# ADR 001: Property and sponsor data contract

- Status: Accepted
- Date: 2026-10-20

## Context

The Week 2 interface used small TypeScript interfaces for display. Week 3 data may come from generated JSON or another external source, so it needs runtime checks before the application uses it.

## Decision

Use Zod as the single source of truth for runtime schemas and inferred TypeScript types. Define separate schemas for `PropertyListing`, `SponsorRecord`, and `PropertySponsor`. Generate JSON Schema from the Zod property-listing schema for Gemini.

A property has a stable property_id and separate street, city, state, and ZIP fields. Sponsors have stable sponsor_id values. Generated listing JSON may include local_sponsors as a convenient input field. In a normalized database, PropertySponsor is the canonical source of sponsor relationships; local_sponsors should be derived from it when reading data and expanded into join rows when writing data. The validator checks that these representations match and that every referenced ID exists. A database implementation should enforce foreign keys and uniqueness for each property-sponsor pair.

Treat amenities as a controlled list of values for this prototype. This keeps spelling consistent and supports filtering. Keep strict local validation, including rejection of unknown fields. The Gemini-compatible schema omits fields its editor rejected; Zod remains the authoritative local validator.

All generated listing data is synthetic and must not be treated as verified real-estate information.

## Alternatives considered

- Maintain TypeScript types, runtime validation, and JSON Schema separately: rejected because the rules could drift.
- Store amenities as unrestricted text: rejected because inconsistent wording makes filtering unreliable.
- Copy sponsor details into each property: rejected because it duplicates data and complicates updates.

## Consequences

The same Zod definitions provide runtime validation and TypeScript types. Gemini output still needs local validation because structured output does not establish that data is factually true. Sponsor IDs must be checked against the sponsor records before the application relies on those relationships. A controlled amenity list is simple to filter but will need revision if the product requires user-defined amenities.

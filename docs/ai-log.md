# AI Interaction Log

## Week 3: Data contracts

### ChatGPT

- **Task:** Helped me build the Week 3 data contract and review the Property, Sponsor, and PropertySponsor model.
- **Useful output:** Recommended keeping amenities as controlled values for this prototype and clarifying that PropertySponsor is the canonical sponsor relationship in a normalized database.
- **Decision:** I documented that decision in `docs/adr/001-data-contract.md`. The generated listing JSON retains `local_sponsors` as an input field; the validator checks it against the separate relationship rows.
- **Verification:** The validator passed with 5 listings, 3 sponsors, and 6 relationships. Tests, lint, and build passed.

### Gemini 3.8 Flash: Synthetic records

- **Prompt:** Asked Gemini to generate exactly five fictional property records matching the configured structured-output schema, using only fictional notes and the specified amenity values and sponsor IDs.
- **Useful output:** Gemini returned five JSON listing records.
- **Verification:** Saved the response as `data/generated/property-listings.synthetic.json`. Zod validation passed for all five listings. The records are synthetic; their ZIP codes were not verified against the fictional city.

### Gemini 3.8 Flash: Normalization critique

- **Prompt:** Asked Gemini to critique sponsor relationship normalization, amenity modeling, and business rules that need clarification.
- **Useful output:** Gemini identified the duplicate relationship representation and recommended using PropertySponsor as the normalized source of truth. It supported the controlled amenity list for a prototype and identified questions about bathroom increments, price minimums, and sponsorship limits.
- **Decision:** I treated the critique as a recommendation, updated ADR 001 to identify PropertySponsor as canonical, and kept the generated `local_sponsors` field synchronized with relationship rows through validation.
- **Verification:** `node scripts/validate-listings.mjs` passed with 5 listings, 3 sponsors, and 6 relationships.

**Commit:** Add the commit hash here after committing this log.
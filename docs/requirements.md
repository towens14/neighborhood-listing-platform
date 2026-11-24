# Local Merchant Services and Bookings Requirements

The implementation paths below are planned traceability targets.

## US-01 — Merchant submits a service draft (Medium)

As an authenticated local service provider, I want to submit an offering with an hourly rate so an administrator can verify it before clients can find it.

- **Given** a signed-in merchant with a valid offering, **when** they submit `POST /api/services`, **then** the service is saved as `draft` with `provider_id` equal to their `auth.uid()`.
- **Given** an invalid offering or an extra field such as `status`, **when** the merchant submits it, **then** the API returns HTTP 400 with structured validation details.

## US-02 — Resident discovers services and requests a booking (Large)

As a resident, I want to browse approved services by neighborhood coverage and request an appointment while keeping other clients' contact information private.

- **Given** approved and draft offerings, **when** an anonymous visitor queries the directory for their area, **then** only approved offerings with active categories and matching coverage are shown.
- **Given** an approved service and a valid booking request, **when** a visitor submits it, **then** the booking is recorded.
- **Given** a resident without provider or administrator access, **when** they try to read existing bookings, **then** no booking records or client contact details are returned.

## US-03 — Administrator reviews services and audits bookings (Medium)

As a platform administrator, I want to approve drafts, suspend problematic offerings, and audit bookings.

- **Given** an administrator and a draft service, **when** the administrator approves it, **then** its status becomes `approved`.
- **Given** an administrator and a problematic offering, **when** they suspend it, **then** it disappears from the public directory.
- **Given** an administrator, **when** they audit bookings, **then** they can read bookings across providers.

## Traceability

| Story | Migration and access rules | Planned route or verification |
| --- | --- | --- |
| US-01 | [Exam migration](../supabase/migrations/20261029140000_exam_services_persistence.sql) — provider ownership and draft writes | [Services route](../src/app/api/services/route.ts) — POST |
| US-02 | [Exam migration](../supabase/migrations/20261029140000_exam_services_persistence.sql) — public reads, booking inserts, and private booking reads | [Services route](../src/app/api/services/route.ts) — GET, plus [bookings route](../src/app/api/bookings/route.ts) — POST |
| US-03 | [Exam migration](../supabase/migrations/20261029140000_exam_services_persistence.sql) — administrator policies | [Security audit](security-audit.md) — elevated approval, suspension, and booking reads. Verify public visibility through [GET /api/services](../src/app/api/services/route.ts). |

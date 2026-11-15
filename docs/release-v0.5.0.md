# v0.5.0 release candidate

The candidate integrates Lab 7 over main at `7362ea1`. Its demo scope is property search, responsive listing images, sponsor publication checks, and the approved local service directory. The separate telephony branch is outside the demo scope.

## Release checklist and test report

| Gate | Evidence or status |
| --- | --- |
| PR integration and CI | Candidate includes a GitHub Actions workflow for PRs, main, and tags. Green remote checks and merge remain pending. |
| Clean install, lint, test, build | Node 24. `npm ci`, `npm run lint`, `npm test` (17 passed), and `npm run build` passed locally. |
| Production smoke | `node scripts/release-smoke.cjs` launches the production build and a local mock REST service. Homepage and WebP returned 200. Services page rendered an approved synthetic service. |
| Search happy path | 2+ bedrooms and $300,000 maximum displays the Sunny bungalow only. |
| No results | 3+ bedrooms and $300,000 maximum displays the empty state. |
| Bad filter | A tampered negative bedroom count displays an alert and skips search submission. |
| Database error | Mock upstream HTTP 500 returned API 503 and the services page displayed its unavailable status. |
| Expired sponsor | Sponsor banner test confirmed an expired fixture is hidden. An approved synthetic fixture displays the sponsorship label. |
| Broken image | Component tests cover an image already failed at render and an error fired after render. Both show the local placeholder. |
| Fresh database, seed data, RLS | Candidate passes above with mocks and local fixtures. Apply all migrations to fresh Supabase, load fictional data through authorized flows, and verify anonymous and authenticated permissions. |
| Accessibility, responsive layout, links | Prior [Lab 7 measurements](marketing/performance-results.md) are historical. Repeat keyboard, viewport and visible-link checks on the final deployed commit. |
| Deployment and tag | Deploy reviewed main, verify runtime environment and configured callback URLs, smoke test the public deployment in a private window, and publish v0.5.0 after all required gates pass. |

## Five-minute demo outline

- **0:00–0:40** Explain why users need easy-to-filter listings and clear sponsorship disclosure.
- **0:40–1:55** Search for 2+ beds under $300,000, open the matching listing link, then switch to 3+ beds to show the empty state.
- **1:55–2:35** Explain the sponsor label and show the approved and expired sponsor tests using synthetic fixtures.
- **2:35–3:25** Show the Next.js pages, services API, and Supabase approval and access model.
- **3:25–4:35** Walk through the test report and the injected database failure. Show CI and deployment only after verification.
- **4:35–5:00** Report usability findings when collected and name the next improvement.

## Usability test plan

Recruit five participants or obtain instructor approval for a different approach. Give participants these tasks without coaching. Record completion, time, and observations using anonymous IDs.

1. Find the demo listing with at least two bedrooms and a maximum price of $300,000.
2. Set filters that return zero listings and recover to a search that finds a listing.
3. Open Local services and identify one approved service and its displayed price in a seeded environment.

Classify inability to complete a task as a blocker, repeated confusion or wrong choices as major, and low-impact presentation issues as minor. Fix blockers before release and rerun affected tasks. Participant observations and fixes remain pending.

## Release notes draft

- **Features:** Property filtering, local service browsing, responsive property images, and sponsor approval and expiration checks.
- **Fixes:** Reject invalid search filters and show a local fallback when a property photo fails.
- **Setup:** Install Node 24, run `npm ci`, configure `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` on the host, apply migrations to an isolated test database, then run the checklist.
- **Known limitations:** Homepage property records are fictional fixtures. Sponsor copy remains a classroom draft. Public sponsor authorization and full hosted verification remain pending.
- **Rollback:** Redeploy the last known-good application commit through the host. Review migration compatibility before changing database state or rolling back writes.

## Retrospective and AI review

Attributable prior contributions by Tavia Owens include `4511654` (Lab 7 media and sponsor validation) and `75592a3` (fallback, responsive image and evidence follow-up). Student reflection and independently captured Gemini review for this release remain pending.

**ChatGPT release-readiness prompt:** Act as a release-readiness reviewer. Given this checklist and test report, identify missing evidence, high-risk assumptions, and the smallest set of release blockers. Do not equate a successful build with a tested product.

**Used:** Added a production-mode smoke check with an injected database failure, preserved the local versus hosted distinction, and kept the tag pending until required checks can be verified.

**Rejected for a technical reason:** Treating a mock Supabase response as proof of RLS enforcement. The mock cannot exercise PostgreSQL policies or JWT roles. Verify role access after a fresh migration on an actual Supabase database.

**Verification:** Local clean install, lint, 17 tests, production build, and mock-backed smoke checks. The candidate PR identifies the associated changes. The prior [ChatGPT and Gemini copy review](marketing/sponsor-copy-review.md) is evidence for Lab 7.

## Fresh database and RLS follow-up

The [first candidate CI run](https://github.com/towens14/neighborhood-listing-platform/actions/runs/43767016378) completed successfully on commit `af4cec1`.

A fresh in-memory PostgreSQL instance (PGlite) applied all three checked-in migrations in order. The test bootstrapped Supabase-compatible roles and a simulated authenticated identity, loaded a fictional provider and admin, and exercised five access checks:

- Anonymous readers see the approved service only.
- A draft sponsor stays hidden from anonymous readers.
- Anonymous users cannot read bookings.
- A provider cannot approve their own service.
- A provider cannot change their profile role to admin.

The reproducible script is `scripts/release-rls.mjs`. Run from the repository root. To avoid changing project dependencies, create a temporary directory, install `@electric-sql/pglite` there, copy the script into that directory, and run the copied script with Node while keeping the repository as the current working directory.

This verifies the migration SQL and selected database policies with simulated identities. Hosted Supabase migration and JWT verification, property and sponsor seed ingestion through the approved application pipeline, and production deployment remain pending.

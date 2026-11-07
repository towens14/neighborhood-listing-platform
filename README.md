# Neighborhood Listing Platform

The properties page is available at `/`. The exam services directory and booking form are available at `/services`.

## Run locally

Use Node.js 22 or newer. Create a git-ignored `.env.local` with the URL and publishable key of your exam Supabase project:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-project-publishable-key
```

Use the same variables in the hosting environment. The services and booking routes use the publishable key on the server. Provider writes pass the authenticated user's access token to Supabase so row-level security applies. Elevated database setup and administration use the Supabase dashboard.

Apply the versioned SQL migrations in order to the exam database. Provision provider profiles with a trusted account. An approved service is needed to exercise the booking form.

```bash
npm ci
npm run dev
```

## Verify

Run `npm run build` and `npm run lint`. On `/services`, check the 1/2/3-column layout at widths of 360, 800, and 1200 pixels. Use Tab and Shift+Tab to move through the controls, Enter to open a booking form, and Space to activate the submit button. Verify visible focus and the resulting confirmation or error.

`GET /api/services` returns approved service details. To create a draft, send `POST /api/services` with an authenticated provider's Supabase access token as a bearer token and this JSON body:

```json
{
  "title": "Home inspection",
  "hourly_rate": 80,
  "duration_minutes": 45,
  "coverage_radius_miles": 10
}
```

See the [requirements](docs/requirements.md) and [security audit](docs/security-audit.md) for the exam scope and verification evidence.

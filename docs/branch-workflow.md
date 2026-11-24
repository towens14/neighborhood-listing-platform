# Branch Isolation and Environment Hygiene

## Project
Neighborhood Listing Platform — Local Merchant Services & Appointment Booking Subsystem

## Branch Strategy
- Base branch: main
- Examination branch: exam/services-booking-eval
- All examination changes are isolated from the main branch.
- Changes will be reviewed and tested before merging.

## Development Environment
- React and TypeScript
- Next.js App Router
- Tailwind CSS
- Supabase PostgreSQL
- GitHub for version control

## Verification Process
1. Confirm the correct Git branch before editing.
2. Review AI-generated code before committing.
3. Run available build, lint, and validation checks.
4. Document database migrations and RLS test results.
5. Commit verified changes with descriptive messages.

## Security Practices
- Never commit API secrets or service-role keys.
- Keep privileged database operations off the client.
- Apply least-privilege access policies.
- Preserve the main branch until examination work is verified.

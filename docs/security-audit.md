# Services and Bookings Security Audit

## Local verification

All three migrations were applied in order in a disposable PostgreSQL instance using PGlite with simulated Supabase roles and an `auth.uid()` implementation. Test fixtures included existing profile rows, two providers, one client, one administrator, an approved service, and two provider drafts. The existing profile rows survived the migration with the default client role.

| Role | Check | Observed outcome |
| --- | --- | --- |
| Anonymous | Read approved and draft services | Approved service visible. Both drafts filtered out. |
| Anonymous | Book an approved service and attempt to book a draft | Approved-service insert succeeded. Draft-service insert denied with SQLSTATE `42501`. |
| Anonymous | Read bookings | Denied with SQLSTATE `42501`. |
| Authenticated client | Book an approved service and read bookings | Insert succeeded. Read returned zero rows. |
| Authenticated client | Change own role to administrator | Denied with SQLSTATE `42501`. |
| Provider A | Edit own draft, Provider B's draft, and own approved listing | Own draft updated. The other two updates affected zero rows. |
| Provider A | Approve own draft | Denied with SQLSTATE `42501`. |
| Providers A and B | Read the bookings for Provider A's service | Provider A saw both bookings. Provider B saw zero rows. |
| Administrator | Read bookings and approve a service | Both bookings visible. Approval succeeded. |
| Elevated service role | Read profiles and suspend a service | All four profiles visible. Suspension succeeded. |

These results cover local SQL authorization. Hosted Supabase migration execution and HTTP verification are pending.

create table public.twilio_voice_receipts (
  call_sid text primary key check (call_sid ~ '^CA[0-9A-Fa-f]{32}$'),
  received_at timestamptz not null default now()
);

alter table public.twilio_voice_receipts enable row level security;
revoke all on public.twilio_voice_receipts from public, anon, authenticated;
grant select, insert on public.twilio_voice_receipts to service_role;

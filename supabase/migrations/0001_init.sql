-- Leads: contact-form submissions and other inbound inquiries.
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text,
  phone       text,
  message     text,
  source      text,                        -- 'website form' | 'referral' | 'GBP' | ...
  status      text not null default 'new', -- new | contacted | quoted | booked | lost
  notes       text
);

-- Jobs: completed / scheduled detailing work, managed from the dashboard only.
create table if not exists public.jobs (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  lead_id                uuid references public.leads(id),  -- nullable
  customer_name          text not null,
  customer_email         text,
  customer_phone         text,
  vehicle                text,             -- year / make / model
  service_type           text,
  price                  numeric,
  completed_date         date,
  review_request_sent    boolean not null default false,
  review_request_sent_at timestamptz,
  notes                  text
);

-- Row Level Security -------------------------------------------------
alter table public.leads enable row level security;
alter table public.jobs  enable row level security;

-- leads: the public (anon) role may INSERT only. No select/update/delete
-- policy exists, so with RLS enabled those are denied by default. This lets
-- a public form create a lead without being able to read anyone else's data.
create policy "anon can insert leads"
  on public.leads for insert to anon
  with check (true);

-- jobs: no policies for anon at all -> RLS denies the anon role every
-- operation. Managed from the Supabase dashboard (service_role bypasses RLS).

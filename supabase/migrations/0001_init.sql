-- Fit Factory Vacation Tracker — initial schema
--
-- Employees are a fixed roster defined in src/lib/employees.ts, not a
-- database table (see that file for why), so this is intentionally just
-- one table.
--
-- Row Level Security is enabled with NO policies, i.e. default-deny for
-- every role except the service role (which bypasses RLS). Only this
-- app's server-side API routes ever talk to Supabase, using the service
-- role key — the browser never holds Supabase credentials — so nothing
-- else needs a policy to read or write this table.

create table if not exists time_off (
  id uuid primary key default gen_random_uuid(),
  employee_id text not null,
  start_date date not null,
  end_date date not null,
  note text,
  created_at timestamptz not null default now(),
  constraint end_after_start check (end_date >= start_date)
);

create index if not exists time_off_employee_id_idx on time_off (employee_id);
create index if not exists time_off_date_range_idx on time_off (start_date, end_date);

alter table time_off enable row level security;

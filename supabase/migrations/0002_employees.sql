-- Move the team roster from a hardcoded file into the database so the
-- team can be edited from the app (add/remove people) without a
-- redeploy.
--
-- `id` stays a readable slug (matching what src/lib/employees.ts used to
-- hardcode) rather than a uuid, since it's occasionally useful to read in
-- the Supabase table editor and it's what's already stored as identity in
-- people's browsers from before this migration.

create table if not exists employees (
  id text primary key,
  name text not null,
  team text not null check (team in ('leads', 'frontdesk', 'coaches')),
  created_at timestamptz not null default now()
);

insert into employees (id, name, team) values
  ('lucas', 'Lucas', 'leads'),
  ('stephanie', 'Stephanie', 'leads'),
  ('harley', 'Harley', 'frontdesk'),
  ('kateryna', 'Kateryna', 'frontdesk'),
  ('alexa', 'Alexa', 'frontdesk'),
  ('stefan', 'Stefan', 'coaches'),
  ('mikey', 'Mikey', 'coaches'),
  ('amanda', 'Amanda', 'coaches'),
  ('charlotte', 'Charlotte', 'coaches'),
  ('adrian', 'Adrian', 'coaches'),
  ('patrick', 'Patrick', 'coaches'),
  ('kat', 'Kat', 'coaches'),
  ('jenny', 'Jenny', 'coaches')
on conflict (id) do nothing;

alter table employees enable row level security;

-- Removing someone from the team removes their time-off history with
-- them — simplest behavior, and the UI warns about it before deleting.
alter table time_off
  add constraint time_off_employee_id_fkey
  foreign key (employee_id) references employees (id) on delete cascade;

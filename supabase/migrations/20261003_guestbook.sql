-- Guestbook for vicoworks.com/guestbook
-- Run once in Supabase → SQL Editor (or `supabase db push`).

create table if not exists public.guestbook (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 40),
  message     text not null check (char_length(message) between 1 and 280),
  ip_hash     text,
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx on public.guestbook (created_at desc);
create index if not exists guestbook_ip_hash_idx on public.guestbook (ip_hash, created_at desc);

-- Spam brake, enforced in the database so it holds no matter which key the
-- site uses: at most 3 entries per visitor (hashed IP) per 10 minutes.
create or replace function public.guestbook_rate_limit()
returns trigger
language plpgsql
-- Runs as the owner: anon cannot read ip_hash (see grants below), but the
-- check has to.
security definer
set search_path = public
as $$
begin
  if new.ip_hash is not null and (
    select count(*) from public.guestbook
    where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited';
  end if;
  return new;
end;
$$;

drop trigger if exists guestbook_rate_limit on public.guestbook;
create trigger guestbook_rate_limit
  before insert on public.guestbook
  for each row execute function public.guestbook_rate_limit();

-- Row level security: anyone may read visible entries and add new ones;
-- nobody but the service role may edit or delete. Hide an entry by setting
-- hidden = true in the table editor.
alter table public.guestbook enable row level security;

drop policy if exists "guestbook read visible" on public.guestbook;
create policy "guestbook read visible" on public.guestbook
  for select to anon, authenticated
  using (hidden = false);

drop policy if exists "guestbook insert" on public.guestbook;
create policy "guestbook insert" on public.guestbook
  for insert to anon, authenticated
  with check (hidden = false);

-- The hashed IP never leaves the database: anon can read every column except it.
revoke select on public.guestbook from anon, authenticated;
grant select (id, name, message, hidden, created_at) on public.guestbook to anon, authenticated;
grant insert (name, message, ip_hash) on public.guestbook to anon, authenticated;

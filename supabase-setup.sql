-- ============================================================
-- Couples site builder - database schema
-- Run this in the Supabase SQL editor. Safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tables
-- ------------------------------------------------------------

create table if not exists public.sites (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users(id) on delete cascade,

  -- routing
  slug           text not null unique,
  preview_token  text not null unique default encode(gen_random_bytes(12), 'hex'),

  -- 'wedding'  = invite + event schedule + RSVP
  -- 'keepsake' = love story / anniversary gift page
  mode           text not null default 'wedding' check (mode in ('wedding','keepsake')),

  -- Package purchased. Governs feature limits (see lib/tiers.ts) - enforced
  -- server-side in dashboard/actions.ts, not just in the UI.
  tier           text not null default 'standard' check (tier in ('basic','standard','premium')),

  -- Paywall. The page is always reachable on its preview_token;
  -- the public /slug route requires is_paid AND is_published.
  is_paid        boolean not null default false,
  is_published   boolean not null default false,

  -- content
  partner_one    text not null default '',
  partner_two    text not null default '',
  tagline        text not null default '',
  story          text not null default '',
  event_date     date,
  hero_photo     text,
  theme          text not null default 'blush',

  -- wedding extras
  venue_note     text not null default '',
  rsvp_enabled   boolean not null default true,
  rsvp_deadline  date,

  -- manual payment proof - see the payment-proofs bucket below.
  -- The admin reviews this before flipping is_paid.
  payment_screenshot   text,
  payment_note         text not null default '',
  payment_submitted_at timestamptz,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists sites_owner_idx on public.sites(owner_id);

-- Event schedule (mehndi / barat / walima / reception ...)
create table if not exists public.site_events (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  title       text not null default '',
  starts_at   timestamptz,
  venue       text not null default '',
  address     text not null default '',
  map_url     text,
  dress_code  text not null default '',
  sort_order  int  not null default 0
);
create index if not exists site_events_site_idx on public.site_events(site_id, sort_order);

-- Photo gallery
create table if not exists public.site_photos (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  image_path  text not null,
  caption     text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists site_photos_site_idx on public.site_photos(site_id, sort_order);

-- "How we met" timeline (keepsake mode mainly, optional in wedding mode)
create table if not exists public.site_timeline (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  title       text not null default '',
  happened_on date,
  body        text not null default '',
  sort_order  int  not null default 0
);
create index if not exists site_timeline_site_idx on public.site_timeline(site_id, sort_order);

-- Guest RSVPs
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  guest_name  text not null,
  guest_email text not null default '',
  attending   boolean not null default true,
  party_size  int not null default 1 check (party_size between 1 and 20),
  message     text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists rsvps_site_idx on public.rsvps(site_id, created_at desc);

-- Bucket list: free for every couple, no tier gate.
create table if not exists public.site_bucket_list (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  item        text not null default '',
  done        boolean not null default false,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists site_bucket_list_site_idx on public.site_bucket_list(site_id, sort_order);

-- Quiz: questions the couple writes, guests answer for fun.
-- Free for every couple, no tier gate.
create table if not exists public.quiz_questions (
  id             uuid primary key default gen_random_uuid(),
  site_id        uuid not null references public.sites(id) on delete cascade,
  question       text not null default '',
  options        text[] not null default '{}',
  correct_index  int  not null default 0,
  sort_order     int  not null default 0
);
create index if not exists quiz_questions_site_idx on public.quiz_questions(site_id, sort_order);

-- Leaderboard entries. Unlike RSVPs, these are meant to be publicly
-- readable - the whole point is guests seeing who scored highest.
create table if not exists public.quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites(id) on delete cascade,
  guest_name  text not null,
  score       int  not null check (score >= 0),
  total       int  not null check (total > 0),
  created_at  timestamptz not null default now()
);
create index if not exists quiz_attempts_site_idx on public.quiz_attempts(site_id, score desc, created_at asc);

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end $fn$;

drop trigger if exists sites_touch_updated_at on public.sites;
create trigger sites_touch_updated_at
  before update on public.sites
  for each row execute function public.touch_updated_at();

-- Photo uploads go straight from the browser to Storage/Postgres (see
-- PhotoManager), bypassing the server actions entirely - so the Basic tier's
-- 10-photo cap has to be enforced here, not just greyed out in the editor.
-- Keep in sync with lib/tiers.ts (TIERS.basic.maxPhotos).
create or replace function public.enforce_photo_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  site_tier text;
  max_photos int;
  current_count int;
begin
  select tier into site_tier from public.sites where id = new.site_id;

  max_photos := case site_tier when 'basic' then 10 else null end;

  if max_photos is not null then
    select count(*) into current_count from public.site_photos where site_id = new.site_id;
    if current_count >= max_photos then
      raise exception 'Photo limit reached for the Basic plan (% photos). Upgrade to add more.', max_photos
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$fn$;

drop trigger if exists site_photos_limit on public.site_photos;
create trigger site_photos_limit
  before insert on public.site_photos
  for each row execute function public.enforce_photo_limit();

-- ------------------------------------------------------------
-- 2. Row Level Security
-- ------------------------------------------------------------

alter table public.sites         enable row level security;
alter table public.site_events   enable row level security;
alter table public.site_photos   enable row level security;
alter table public.site_timeline enable row level security;
alter table public.rsvps         enable row level security;

-- A site is publicly visible only when it is BOTH paid and published.
-- security definer so guests can evaluate it without reading the sites table.
create or replace function public.site_is_public(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.sites s
    where s.id = target and s.is_paid and s.is_published
  );
$fn$;

-- Does the current user own this site?
create or replace function public.owns_site(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.sites s
    where s.id = target and s.owner_id = auth.uid()
  );
$fn$;

-- --- sites ---------------------------------------------------
drop policy if exists "owner reads own site"   on public.sites;
drop policy if exists "owner writes own site"  on public.sites;
drop policy if exists "owner updates own site" on public.sites;
drop policy if exists "owner deletes own site" on public.sites;
drop policy if exists "anyone reads paid site" on public.sites;

create policy "owner reads own site"   on public.sites
  for select using (auth.uid() = owner_id);
create policy "owner writes own site"  on public.sites
  for insert with check (auth.uid() = owner_id);
create policy "owner updates own site" on public.sites
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner deletes own site" on public.sites
  for delete using (auth.uid() = owner_id);
create policy "anyone reads paid site" on public.sites
  for select using (is_paid and is_published);

-- --- site_events ---------------------------------------------
drop policy if exists "owner manages events" on public.site_events;
drop policy if exists "public reads events"  on public.site_events;

create policy "owner manages events" on public.site_events
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public reads events" on public.site_events
  for select using (public.site_is_public(site_id));

-- --- site_photos ---------------------------------------------
drop policy if exists "owner manages photos" on public.site_photos;
drop policy if exists "public reads photos"  on public.site_photos;

create policy "owner manages photos" on public.site_photos
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public reads photos" on public.site_photos
  for select using (public.site_is_public(site_id));

-- --- site_timeline -------------------------------------------
drop policy if exists "owner manages timeline" on public.site_timeline;
drop policy if exists "public reads timeline"  on public.site_timeline;

create policy "owner manages timeline" on public.site_timeline
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public reads timeline" on public.site_timeline
  for select using (public.site_is_public(site_id));

-- --- rsvps ---------------------------------------------------
-- Guests may submit an RSVP to a live site, but may never read them back.
drop policy if exists "guest submits rsvp"  on public.rsvps;
drop policy if exists "owner reads rsvps"   on public.rsvps;
drop policy if exists "owner deletes rsvps" on public.rsvps;

create policy "guest submits rsvp" on public.rsvps
  for insert
  with check (
    public.site_is_public(site_id)
    and exists (select 1 from public.sites s where s.id = site_id and s.rsvp_enabled)
  );

create policy "owner reads rsvps" on public.rsvps
  for select using (public.owns_site(site_id));

create policy "owner deletes rsvps" on public.rsvps
  for delete using (public.owns_site(site_id));

-- --- site_bucket_list ------------------------------------------
alter table public.site_bucket_list enable row level security;

drop policy if exists "owner manages bucket list" on public.site_bucket_list;
drop policy if exists "public reads bucket list"  on public.site_bucket_list;

create policy "owner manages bucket list" on public.site_bucket_list
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public reads bucket list" on public.site_bucket_list
  for select using (public.site_is_public(site_id));

-- --- quiz_questions ----------------------------------------------
alter table public.quiz_questions enable row level security;

drop policy if exists "owner manages quiz questions" on public.quiz_questions;
drop policy if exists "public reads quiz questions"  on public.quiz_questions;

create policy "owner manages quiz questions" on public.quiz_questions
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "public reads quiz questions" on public.quiz_questions
  for select using (public.site_is_public(site_id));

-- --- quiz_attempts -------------------------------------------------
-- Unlike rsvps, these are meant to be publicly readable - the whole point
-- is guests seeing who scored highest on the leaderboard.
alter table public.quiz_attempts enable row level security;

drop policy if exists "guest submits quiz attempt" on public.quiz_attempts;
drop policy if exists "public reads quiz attempts" on public.quiz_attempts;
drop policy if exists "owner deletes quiz attempts" on public.quiz_attempts;

create policy "guest submits quiz attempt" on public.quiz_attempts
  for insert with check (public.site_is_public(site_id));
create policy "public reads quiz attempts" on public.quiz_attempts
  for select using (public.site_is_public(site_id));
create policy "owner deletes quiz attempts" on public.quiz_attempts
  for delete using (public.owns_site(site_id));

-- ------------------------------------------------------------
-- 3. Storage bucket for couple photos
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('couple-photos', 'couple-photos', true)
on conflict (id) do update set public = true;

-- Files live at <site_id>/<filename>, so the first path segment decides
-- who may write. Reads are public because the bucket is public.
drop policy if exists "public reads couple photos"  on storage.objects;
drop policy if exists "owner uploads couple photos" on storage.objects;
drop policy if exists "owner deletes couple photos" on storage.objects;

create policy "public reads couple photos" on storage.objects
  for select using (bucket_id = 'couple-photos');

create policy "owner uploads couple photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'couple-photos'
    and public.owns_site(((storage.foldername(name))[1])::uuid)
  );

create policy "owner deletes couple photos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'couple-photos'
    and public.owns_site(((storage.foldername(name))[1])::uuid)
  );

-- ------------------------------------------------------------
-- 4. Storage bucket for payment proof screenshots
-- ------------------------------------------------------------
-- Private, unlike couple-photos - a bank transfer screenshot is financial
-- evidence, not something to serve publicly. Admin reads it via a signed
-- URL from the service-role client, which bypasses RLS entirely.

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false;

drop policy if exists "owner uploads payment proof"   on storage.objects;
drop policy if exists "owner reads own payment proof" on storage.objects;

create policy "owner uploads payment proof" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and public.owns_site(((storage.foldername(name))[1])::uuid)
  );

create policy "owner reads own payment proof" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'payment-proofs'
    and public.owns_site(((storage.foldername(name))[1])::uuid)
  );

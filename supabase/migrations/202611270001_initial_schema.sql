-- Lado A / Lado B — initial Supabase schema
-- Run this migration in the Supabase SQL editor or with the Supabase CLI.

create extension if not exists pgcrypto;

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Lado A / Lado B',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  spotify_id text,
  title text not null,
  artist text not null,
  release_date text,
  album_type text,
  total_tracks integer,
  artwork_url text,
  spotify_url text,
  metadata jsonb not null default '{}'::jsonb,
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, spotify_id)
);

create table public.album_shelves (
  album_id uuid not null references public.albums(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (album_id, user_id)
);

create table public.album_user_data (
  album_id uuid not null references public.albums(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating numeric(2,1) check (rating is null or rating between 0 and 5),
  listened boolean not null default false,
  note text,
  updated_at timestamptz not null default now(),
  primary key (album_id, user_id)
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  album_id uuid not null references public.albums(id) on delete cascade,
  recommended_by uuid not null references public.profiles(id) on delete cascade,
  recommended_to uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'listened', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (album_id, recommended_by, recommended_to)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.collection_albums (
  collection_id uuid not null references public.collections(id) on delete cascade,
  album_id uuid not null references public.albums(id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  primary key (collection_id, album_id)
);

create index albums_household_created_idx on public.albums (household_id, created_at desc);
create index album_shelves_user_idx on public.album_shelves (user_id, added_at desc);
create index recommendations_recipient_idx on public.recommendations (recommended_to, status, created_at desc);
create index collections_household_idx on public.collections (household_id, created_at desc);

create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.household_members hm
    where hm.household_id = target_household and hm.user_id = auth.uid()
  );
$$;

create or replace function public.is_household_album(target_album uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.albums a
    join public.household_members hm on hm.household_id = a.household_id
    where a.id = target_album and hm.user_id = auth.uid()
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger albums_touch_updated_at
before update on public.albums
for each row execute function public.touch_updated_at();

-- Create a profile automatically whenever an auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.albums enable row level security;
alter table public.album_shelves enable row level security;
alter table public.album_user_data enable row level security;
alter table public.recommendations enable row level security;
alter table public.collections enable row level security;
alter table public.collection_albums enable row level security;

create policy "Members can view household profiles"
on public.profiles for select to authenticated
using (
  id = auth.uid() or exists (
    select 1 from public.household_members mine
    join public.household_members theirs on theirs.household_id = mine.household_id
    where mine.user_id = auth.uid() and theirs.user_id = profiles.id
  )
);

create policy "Users can update own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can view their households"
on public.households for select to authenticated
using (public.is_household_member(id));

create policy "Members can view household membership"
on public.household_members for select to authenticated
using (public.is_household_member(household_id));

create policy "Members can view household albums"
on public.albums for select to authenticated
using (public.is_household_member(household_id));

create policy "Members can add household albums"
on public.albums for insert to authenticated
with check (public.is_household_member(household_id) and added_by = auth.uid());

create policy "Members can update household albums"
on public.albums for update to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "Members can remove household albums"
on public.albums for delete to authenticated
using (public.is_household_member(household_id));

create policy "Members can view album shelves"
on public.album_shelves for select to authenticated
using (public.is_household_album(album_id));

create policy "Members can add albums to own shelf"
on public.album_shelves for insert to authenticated
with check (user_id = auth.uid() and public.is_household_album(album_id));

create policy "Users can remove albums from own shelf"
on public.album_shelves for delete to authenticated
using (user_id = auth.uid());

create policy "Members can view ratings and notes"
on public.album_user_data for select to authenticated
using (public.is_household_album(album_id));

create policy "Users can create own ratings and notes"
on public.album_user_data for insert to authenticated
with check (user_id = auth.uid() and public.is_household_album(album_id));

create policy "Users can update own ratings and notes"
on public.album_user_data for update to authenticated
using (user_id = auth.uid() and public.is_household_album(album_id))
with check (user_id = auth.uid() and public.is_household_album(album_id));

create policy "Users can delete own ratings and notes"
on public.album_user_data for delete to authenticated
using (user_id = auth.uid());

create policy "Members can view household recommendations"
on public.recommendations for select to authenticated
using (public.is_household_member(household_id));

create policy "Members can create recommendations as themselves"
on public.recommendations for insert to authenticated
with check (
  public.is_household_member(household_id)
  and recommended_by = auth.uid()
  and recommended_to <> auth.uid()
);

create policy "Sender or recipient can update recommendations"
on public.recommendations for update to authenticated
using (recommended_by = auth.uid() or recommended_to = auth.uid())
with check (public.is_household_member(household_id));

create policy "Sender can delete recommendations"
on public.recommendations for delete to authenticated
using (recommended_by = auth.uid());

create policy "Members can view collections"
on public.collections for select to authenticated
using (public.is_household_member(household_id));

create policy "Members can create collections"
on public.collections for insert to authenticated
with check (public.is_household_member(household_id) and created_by = auth.uid());

create policy "Collection creators can update collections"
on public.collections for update to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid() and public.is_household_member(household_id));

create policy "Collection creators can delete collections"
on public.collections for delete to authenticated
using (created_by = auth.uid());

create policy "Members can view collection albums"
on public.collection_albums for select to authenticated
using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and public.is_household_member(c.household_id)
  )
);

create policy "Members can add albums to collections"
on public.collection_albums for insert to authenticated
with check (
  exists (
    select 1 from public.collections c
    join public.albums a on a.id = collection_albums.album_id and a.household_id = c.household_id
    where c.id = collection_id and public.is_household_member(c.household_id)
  )
);

create policy "Members can remove albums from collections"
on public.collection_albums for delete to authenticated
using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and public.is_household_member(c.household_id)
  )
);

-- Enable realtime for changes that should appear on both clients.
alter publication supabase_realtime add table public.albums;
alter publication supabase_realtime add table public.album_shelves;
alter publication supabase_realtime add table public.album_user_data;
alter publication supabase_realtime add table public.recommendations;
alter publication supabase_realtime add table public.collections;
alter publication supabase_realtime add table public.collection_albums;

-- Bootstrap the shared household after both users have signed up:
-- insert into public.households (name) values ('Lado A / Lado B') returning id;
-- insert into public.household_members (household_id, user_id, role)
-- values ('<household-uuid>', '<matheus-auth-user-uuid>', 'owner'),
--        ('<household-uuid>', '<thiago-auth-user-uuid>', 'member');

-- Create a household for the first signed-in member when none exists.
-- Safe to call repeatedly: an existing membership is returned unchanged.

create or replace function public.ensure_lado_ab_household()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing_household_id uuid;
  new_household_id uuid;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to initialize the archive.';
  end if;

  select household_id
    into existing_household_id
    from public.household_members
   where user_id = current_user_id
   order by joined_at
   limit 1;

  if existing_household_id is not null then
    return existing_household_id;
  end if;

  if exists (select 1 from public.households) then
    raise exception 'Your account has not been added to the shared Lado A / Lado B household yet. Ask the household owner to add you.';
  end if;

  insert into public.households (name)
  values ('Lado A / Lado B')
  returning id into new_household_id;

  insert into public.household_members (household_id, user_id, role)
  values (new_household_id, current_user_id, 'owner');

  return new_household_id;
end;
$$;

revoke all on function public.ensure_lado_ab_household() from public;
grant execute on function public.ensure_lado_ab_household() to authenticated;

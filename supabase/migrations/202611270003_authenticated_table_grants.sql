-- Grant API roles the table privileges required by the Lado A / Lado B app.
-- Row Level Security remains enabled and continues to enforce per-household access.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.households,
  public.household_members,
  public.albums,
  public.album_shelves,
  public.album_user_data,
  public.recommendations,
  public.collections,
  public.collection_albums
to authenticated;

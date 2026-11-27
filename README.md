# Lado A / Lado B

A shared music archive for Matheus and Thiago.

## Stack

- React + TypeScript + Vite
- Spotify Web API (Authorization Code with PKCE)
- Supabase (PostgreSQL, Auth, Row Level Security, Realtime)

## Supabase setup

1. Create a Supabase project.
2. In **SQL Editor**, run both migrations in order:
   - `supabase/migrations/202611270001_initial_schema.sql`
   - `supabase/migrations/202611270002_household_bootstrap.sql`
3. In **Project Settings → API**, copy the Project URL and the publishable (or anon) key.
4. Create a local `.env.local` file based on `.env.example`:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

5. Enable email/password sign-in in **Authentication → Providers** and create your account. Choose the correct side (Matheus or Thiago) during sign-up.
6. Sign in to the app. The first account automatically creates the shared **Lado A / Lado B** household. The album catalog starts empty; Spotify imports are saved to the database and to the signed-in member's shelf.
7. When the second person creates an account, add that user to the existing household from the SQL Editor. Find both user UUIDs in **Authentication → Users**, then run:

   ```sql
   select id from public.households where name = 'Lado A / Lado B';

   -- Replace HOUSEHOLD_UUID and SECOND_USER_UUID with the values above.
   insert into public.household_members (household_id, user_id, role)
   values ('HOUSEHOLD_UUID', 'SECOND_USER_UUID', 'member')
   on conflict do nothing;
   ```

   The second person can then sign in and see the shared archive. Do not let the second account initialize a separate household.

8. Restart the Vite dev server after setting environment variables.

**Important:** use only the Supabase publishable/anon key in the browser. Never put the service-role or secret key in a `VITE_*` variable or commit it to Git.

The schema stores shared album metadata separately from each person's shelf and private rating/listening data. Row Level Security limits access to household members and user-owned data.


## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

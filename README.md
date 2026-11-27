# Lado A / Lado B

A shared music archive for Matheus and Thiago.

## Stack

- React + TypeScript + Vite
- Spotify Web API (Authorization Code with PKCE)
- Supabase (PostgreSQL, Auth, Row Level Security, Realtime)

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard and run the migration at `supabase/migrations/202611270001_initial_schema.sql`.
3. In **Project Settings → API**, copy the Project URL and the publishable (or anon) key.
4. Create a local `.env` file based on `.env.example`:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

5. Enable email/password sign-in in **Authentication → Providers**. Create accounts for Matheus and Thiago (or invite them).
6. After both accounts exist, find their user UUIDs under **Authentication → Users**. In the SQL Editor, create the shared household and add both users:

   ```sql
   insert into public.households (name)
   values ('Lado A / Lado B')
   returning id;

   -- Replace the values with the returned household UUID and
   -- the two user UUIDs shown in Authentication → Users.
   insert into public.household_members (household_id, user_id, role)
   values
     ('HOUSEHOLD_UUID', 'MATHEUS_USER_UUID', 'owner'),
     ('HOUSEHOLD_UUID', 'THIAGO_USER_UUID', 'member');
   ```

7. Restart the Vite dev server after setting environment variables.

**Important:** use only the Supabase publishable/anon key in the browser. Never put the service-role or secret key in a `VITE_*` variable or commit it to Git.

The initial schema includes shared albums, each person's shelf, private ratings/notes/listening status, recommendations, and collections. Row Level Security limits data access to members of the household and individual user-owned data.

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

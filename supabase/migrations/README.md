# Applying Supabase migrations

Migrations in this folder are plain SQL files, applied in filename order. There is no migration-tracking table yet — each file is written to be run once, in order, against a fresh or already-migrated project.

| File | Adds |
|---|---|
| `0001_catalog.sql` | Core catalog: ragas, compositions, recordings, people, releases, tutorials, citations, editorial workflow, admin media-approval queue, AI drafts, search outbox. |
| `0002_notation.sql` | Carnatic swara notation subsystem: `notation_jobs`, `notation_sources`, `notation_lines`, `notation_drafts` — depends on `0001_catalog.sql` (references `compositions` and `recordings`). |

## Option A — Supabase CLI (recommended)

1. Install the CLI if you haven't already: `npm.cmd install -g supabase` (or `npx supabase ...` without a global install).
2. Link the CLI to your project (only needed once per machine):

   ```powershell
   supabase login
   supabase link --project-ref <your-project-ref>
   ```

   The project ref is the id in your Supabase project's dashboard URL: `https://supabase.com/dashboard/project/<project-ref>`.
3. Push the migrations:

   ```powershell
   supabase db push
   ```

   This applies every `.sql` file in `supabase/migrations/` that hasn't been applied yet, in order.

## Option B — Supabase Dashboard SQL editor (manual)

Use this if you don't want to install the CLI, or are applying a single new migration to a project that already has `0001_catalog.sql`.

1. Open your project at [supabase.com/dashboard](https://supabase.com/dashboard) → **SQL Editor**.
2. Open `supabase/migrations/0001_catalog.sql` in this repo, copy its full contents, paste into a new query, and run it. Skip this step if the project already has the catalog tables (check **Table Editor** for `compositions`/`ragas`).
3. Open `supabase/migrations/0002_notation.sql`, copy its full contents, paste into a new query, and run it.
4. Confirm the new tables appear under **Table Editor**: `notation_jobs`, `notation_sources`, `notation_lines`, `notation_drafts`.

## After applying

1. Copy the project's URL and keys into `apps/web/.env.local` (see `.env.example` at the repo root — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the service-role key used by admin routes).
2. Restart `npm.cmd run dev` so the new environment variables are picked up.
3. Give yourself an editor role by inserting a row into `editor_profiles` for your `auth.users` id (via the SQL editor or the Supabase dashboard's Table Editor), otherwise `requireEditor`-gated routes (including the notation admin routes) will reject you with 401/403.

## Adding a new migration later

Name the next file `000N_<short-description>.sql`, keep it idempotent-unsafe-but-run-once (no `if not exists` guards needed since files are only ever run once per project), and follow the existing style: one `create table` per logical entity, RLS enabled with an `editors manage <table>` policy plus a public-read policy gated on `state = 'published'` where the table has published/draft content. Add it to the table above.

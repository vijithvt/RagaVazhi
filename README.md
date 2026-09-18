# RagaVazhi / രാഗവഴി

> Find the song. Follow the raga.

A bilingual Malayalam-first raga, composition, recording, and learning-resource discovery platform.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. The application ships with a small, explicitly sourced demonstration catalog. Production content is loaded through the editorial workflow; the application does not scrape third-party databases.

## Commands

- `npm.cmd run dev` — local development
- `npm.cmd run build` — production build
- `npm.cmd test` — unit tests
- `npm.cmd run typecheck` — TypeScript checks

## Production services

Copy `.env.example` to `.env.local` and configure Supabase, Meilisearch, and OpenAI. The app operates from the local demo repository when cloud variables are absent. Apply `supabase/migrations/0001_catalog.sql` to a Supabase project before enabling catalog writes.

The admin AI endpoint requires both `OPENAI_API_KEY` and a valid Supabase editor session in production. AI output is a draft and never publishes automatically.

## Admin review access

1. Add `ADMIN_PREVIEW_TOKEN=a-long-private-password` to the root `.env` file.
2. Restart `npm.cmd run dev` after changing `.env`.
3. Open `http://localhost:3000/admin`; unauthenticated visitors are redirected to `/admin/login`.
4. Enter the configured token, then open **Media review**.
5. Choose a composition, play/open each discovered result, and select **Approve** or **Reject**.

Local decisions are stored in the ignored `data/media-approvals.json` file. When Supabase service credentials are configured, decisions use the `web_media_approvals` table instead. Approving a lyric-source URL approves the link only; it does not grant permission to reproduce the lyric text.

## Live media and suggestions

- `TAVILY_API_KEY` enables cached internet discovery for YouTube, Spotify, JioSaavn, YouTube Music, lyric-source pages, and references.
- `GROQ_API_KEY` enables on-demand, schema-validated listening suggestions. Set `GROQ_MODEL` to override the default.
- `YOUTUBE_API_KEY` is strongly recommended. When present, the app queries the official API with `videoEmbeddable=true` and places those verified candidates before general web results.
- Add Spotify client credentials when catalog-level matching is needed. Public Spotify URLs discovered by Tavily can already use the official embed player.
- Use `MUSIXMATCH_API_KEY` only after confirming the plan permits lyric display for this application and territory. Internet discovery alone is not a lyric-display license.

## Content policy

- Every published claim must have a citation.
- Full lyrics require a recorded rights grant; otherwise only an authorized source link is shown.
- Tonic belongs to a recording, not a composition.
- Conflicting raga identifications coexist with separate confidence and citations.
- YouTube, Spotify, JioSaavn, and YouTube Music remain embedded or outbound providers; media is not rehosted.

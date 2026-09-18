# RagaVazhi / രാഗവഴി

**Find the song. Follow the raga.**

RagaVazhi is a bilingual, Malayalam-first platform for discovering ragas, compositions, recordings, and learning resources — every published claim backed by a citation, every piece of media linked to its rightful source.

[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](apps/web/package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](apps/web/package.json)
[![Supabase](https://img.shields.io/badge/Supabase-catalog-3ECF8E?logo=supabase&logoColor=white)](supabase/migrations/0001_catalog.sql)

---

## Overview

RagaVazhi helps listeners and students trace a song back to its raga, and a raga forward to every recorded or referenced composition tied to it. It ships with a small, explicitly sourced demonstration catalog and is designed to grow through an editorial review workflow rather than automated scraping of third-party databases.

- **Bilingual by design** — content is authored Malayalam-first, with English alongside.
- **Citation-backed** — every claim in the catalog traces to a source.
- **Editorially controlled** — new media is discovered, then reviewed and approved by a human before it's linked into the catalog.
- **Provider-respectful** — audio and video stay embedded or linked at YouTube, Spotify, JioSaavn, and YouTube Music; nothing is rehosted.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16, React 19, TypeScript |
| Database | [Supabase](https://supabase.com/) (Postgres) |
| Search | [Meilisearch](https://www.meilisearch.com/) |
| AI assistance | [OpenAI](https://platform.openai.com/) (admin drafting), [Groq](https://groq.com/) (listening suggestions) |
| Discovery | [Tavily](https://tavily.com/) web search, YouTube Data API |
| Testing | [Vitest](https://vitest.dev/) |

## Getting started

**Prerequisites:** Node.js 20+

```powershell
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000). Without any cloud services configured, the app runs entirely from its local demo catalog — no external accounts are required to explore it.

### Available commands

| Command | Description |
|---|---|
| `npm.cmd run dev` | Start the local development server |
| `npm.cmd run build` | Create a production build |
| `npm.cmd test` | Run the unit test suite |
| `npm.cmd run typecheck` | Run TypeScript checks |

## Configuration

### Production services

1. Copy `.env.example` to `.env.local`.
2. Configure Supabase, Meilisearch, and OpenAI credentials.
3. Apply the catalog schema to your Supabase project:

   ```powershell
   # supabase/migrations/0001_catalog.sql
   ```

   Run this before enabling catalog writes.

Without cloud variables set, the app transparently falls back to the local demo repository. The admin AI endpoint requires both `OPENAI_API_KEY` and a valid Supabase editor session in production, and its output is always a draft — nothing publishes automatically.

### Live media and suggestions

| Variable | Enables |
|---|---|
| `TAVILY_API_KEY` | Cached internet discovery across YouTube, Spotify, JioSaavn, YouTube Music, lyric-source pages, and references |
| `GROQ_API_KEY` | On-demand, schema-validated listening suggestions (override the model with `GROQ_MODEL`) |
| `YOUTUBE_API_KEY` | **Recommended.** Queries the official YouTube Data API with `videoEmbeddable=true`, surfacing verified candidates ahead of general web results |
| Spotify client credentials | Catalog-level matching; public Spotify URLs discovered via Tavily can already use the official embed player |
| `MUSIXMATCH_API_KEY` | Lyric display — enable only after confirming your plan permits it for this application and territory. Internet discovery alone is **not** a lyric-display license |

## Admin review access

The Media review console lets an editor approve or reject discovered media before it reaches the catalog.

1. Add `ADMIN_PREVIEW_TOKEN=a-long-private-password` to the root `.env` file.
2. Restart `npm.cmd run dev` after changing `.env`.
3. Open `http://localhost:3000/admin` — unauthenticated visitors are redirected to `/admin/login`.
4. Enter the configured token, then open **Media review**.
5. For each composition, play or open the discovered result and select **Approve** or **Reject**.

Decisions are stored locally in the ignored `data/media-approvals.json` file, or in the `web_media_approvals` Supabase table once service credentials are configured. Approving a lyric-source URL approves the link only — it does not grant permission to reproduce the lyric text itself.

## Content policy

RagaVazhi is built around a few non-negotiable editorial rules:

- Every published claim must carry a citation.
- Full lyrics require a recorded rights grant; otherwise only an authorized source link is shown.
- Tonic (śruti) belongs to a specific recording, not to the composition in the abstract.
- Conflicting raga identifications are allowed to coexist, each with its own confidence level and citations.
- YouTube, Spotify, JioSaavn, and YouTube Music remain embedded or outbound providers — media is never rehosted.

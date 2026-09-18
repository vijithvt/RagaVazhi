-- Carnatic swara notation subsystem. Depends on 0001_catalog.sql.

create type public.sthayi as enum ('mandra', 'madhya', 'tara');
create type public.notation_job_status as enum ('queued', 'discovering', 'transcribing', 'judging', 'succeeded', 'failed');

create table public.notation_jobs (
  id uuid primary key default gen_random_uuid(), composition_id uuid not null references public.compositions(id) on delete cascade,
  status public.notation_job_status not null default 'queued', source_video_ids text[] not null default '{}', error text,
  created_by uuid references auth.users(id), started_at timestamptz, finished_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.notation_sources (
  id uuid primary key default gen_random_uuid(), job_id uuid not null references public.notation_jobs(id) on delete cascade,
  video_id text not null, url text not null, kind text not null default 'unknown' check(kind in ('original','cover','tutorial','unknown')),
  detected_tonic text, tonic_confidence public.confidence_level, pitch_track_model text not null, unique(job_id,video_id)
);
create table public.notation_lines (
  id uuid primary key default gen_random_uuid(), job_id uuid not null references public.notation_jobs(id) on delete cascade,
  source_id uuid references public.notation_sources(id) on delete cascade, is_finalized boolean not null default false,
  line_index smallint not null, lyric_text text, swaras jsonb not null, start_ms integer not null, end_ms integer not null
);
create table public.notation_drafts (
  id uuid primary key default gen_random_uuid(), job_id uuid not null references public.notation_jobs(id) on delete cascade,
  composition_id uuid not null references public.compositions(id) on delete cascade, recording_id uuid references public.recordings(id),
  overall_confidence public.confidence_level not null default 'medium', judge_rationale text, prompt_version text not null, model text not null,
  created_by uuid references auth.users(id), reviewed_by uuid references auth.users(id), state public.editorial_state not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.notation_jobs enable row level security;
alter table public.notation_sources enable row level security;
alter table public.notation_lines enable row level security;
alter table public.notation_drafts enable row level security;
create policy "editors manage notation jobs" on public.notation_jobs for all using (public.is_editor()) with check (public.is_editor());
create policy "editors manage notation sources" on public.notation_sources for all using (public.is_editor()) with check (public.is_editor());
create policy "editors manage notation lines" on public.notation_lines for all using (public.is_editor()) with check (public.is_editor());
create policy "published notation drafts are public" on public.notation_drafts for select using (state='published' or public.is_editor());
create policy "editors manage notation drafts" on public.notation_drafts for all using (public.is_editor()) with check (public.is_editor());

create index notation_jobs_status_idx on public.notation_jobs(status);
create index notation_lines_job_idx on public.notation_lines(job_id,is_finalized,line_index);
create index notation_drafts_state_idx on public.notation_drafts(state);

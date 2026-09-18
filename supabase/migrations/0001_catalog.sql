-- RagaVazhi catalog foundation. Run in a new Supabase project.
create extension if not exists pgcrypto;

create type public.editorial_state as enum ('draft', 'in_review', 'published', 'archived');
create type public.confidence_level as enum ('verified', 'high', 'medium', 'debated');
create type public.editor_role as enum ('editor', 'reviewer', 'admin');

create table public.editor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.editor_role not null default 'editor',
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.ragas (
  id uuid primary key default gen_random_uuid(), slug text unique not null,
  name_en text not null, name_ml text not null, system text not null check (system in ('Carnatic','Hindustani','Both')),
  melakarta smallint, parent_id uuid references public.ragas(id), arohana text not null, avarohana text not null,
  signature_en text not null default '', signature_ml text not null default '', overview_en text not null default '', overview_ml text not null default '',
  mood_en text not null default '', mood_ml text not null default '', phrases text[] not null default '{}', important_swaras text[] not null default '{}',
  state public.editorial_state not null default 'draft', created_by uuid references auth.users(id), reviewed_by uuid references auth.users(id),
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.raga_aliases (id uuid primary key default gen_random_uuid(), raga_id uuid not null references public.ragas(id) on delete cascade, value text not null, script text, unique(raga_id,value));
create table public.raga_relations (id uuid primary key default gen_random_uuid(), from_raga_id uuid not null references public.ragas(id) on delete cascade, to_raga_id uuid not null references public.ragas(id) on delete cascade, kind text not null check(kind in ('similar','contrast','derived','parent')), reason_en text not null, reason_ml text not null, unique(from_raga_id,to_raga_id,kind));

create table public.people (id uuid primary key default gen_random_uuid(), slug text unique not null, name_en text not null, name_ml text, aliases text[] not null default '{}', state public.editorial_state not null default 'draft');
create table public.releases (id uuid primary key default gen_random_uuid(), slug text unique not null, title_en text not null, title_ml text, kind text not null check(kind in ('film','album','independent')), release_year smallint, language text, state public.editorial_state not null default 'draft');
create table public.compositions (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title_en text not null, title_ml text not null, aliases text[] not null default '{}',
  language text not null, kind text not null check(kind in ('carnatic','film','album','devotional')), tala text, release_id uuid references public.releases(id), release_year smallint,
  summary_en text not null default '', summary_ml text not null default '', state public.editorial_state not null default 'draft',
  created_by uuid references auth.users(id), reviewed_by uuid references auth.users(id), published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.composition_ragas (id uuid primary key default gen_random_uuid(), composition_id uuid not null references public.compositions(id) on delete cascade, raga_id uuid not null references public.ragas(id), confidence public.confidence_level not null default 'medium', editorial_note text, unique(composition_id,raga_id));
create table public.credits (id uuid primary key default gen_random_uuid(), composition_id uuid not null references public.compositions(id) on delete cascade, person_id uuid not null references public.people(id), role text not null check(role in ('composer','lyricist','singer','instrumentalist','teacher')), position smallint not null default 0, unique(composition_id,person_id,role));
create table public.recordings (id uuid primary key default gen_random_uuid(), composition_id uuid not null references public.compositions(id) on delete cascade, title text not null, tonic text, tonic_confidence public.confidence_level, tonic_note text, duration_seconds integer, state public.editorial_state not null default 'draft');
create table public.recording_credits (recording_id uuid references public.recordings(id) on delete cascade, person_id uuid references public.people(id), role text not null check(role in ('singer','instrumentalist')), primary key(recording_id,person_id,role));

create table public.external_media (
  id uuid primary key default gen_random_uuid(), recording_id uuid references public.recordings(id) on delete cascade,
  platform text not null check(platform in ('youtube','spotify','jiosaavn','youtube_music','academy')), kind text not null check(kind in ('video','audio','tutorial')),
  title text not null, url text not null, external_id text, embeddable boolean not null default false, status text not null default 'pending' check(status in ('pending','verified','broken','region_blocked')),
  verified_at timestamptz, unique(platform,url)
);
create table public.tutorials (id uuid primary key default gen_random_uuid(), slug text unique not null, title_en text not null, title_ml text not null, raga_id uuid references public.ragas(id), composition_id uuid references public.compositions(id), teacher_id uuid references public.people(id), instrument text not null, level text not null check(level in ('beginner','intermediate','advanced')), language text not null, media_id uuid references public.external_media(id), state public.editorial_state not null default 'draft');

create table public.rights_grants (id uuid primary key default gen_random_uuid(), basis text not null, owner text, territory text, starts_at date, expires_at date, evidence_path text, notes text, created_at timestamptz not null default now());
create table public.lyrics_versions (id uuid primary key default gen_random_uuid(), composition_id uuid not null references public.compositions(id) on delete cascade, script text not null, version_kind text not null check(version_kind in ('original','transliteration','translation')), body text not null, source_url text, rights_grant_id uuid references public.rights_grants(id), publishable boolean generated always as (rights_grant_id is not null) stored, unique(composition_id,script,version_kind));
create table public.citations (id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, field_key text, label text not null, url text not null, source_type text not null, license text, retrieved_at date not null, editor_note text, created_at timestamptz not null default now());

create table public.editorial_revisions (id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, snapshot jsonb not null, state public.editorial_state not null, actor_id uuid references auth.users(id), created_at timestamptz not null default now());
create table public.audit_events (id bigint generated always as identity primary key, actor_id uuid references auth.users(id), action text not null, entity_type text not null, entity_id uuid, detail jsonb not null default '{}', created_at timestamptz not null default now());
create table public.correction_reports (id uuid primary key default gen_random_uuid(), entity_ref text not null, message text not null, source_url text, reporter_email text, status text not null default 'new' check(status in ('new','triaged','resolved','rejected')), created_at timestamptz not null default now());
create table public.ai_drafts (id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid, prompt_version text not null, model text not null, source_ids text[] not null, output jsonb not null, created_by uuid not null references auth.users(id), reviewed_by uuid references auth.users(id), state public.editorial_state not null default 'draft', created_at timestamptz not null default now());
create table public.search_outbox (id bigint generated always as identity primary key, entity_type text not null, entity_id uuid not null, operation text not null check(operation in ('upsert','delete')), payload jsonb not null default '{}', attempts integer not null default 0, available_at timestamptz not null default now(), processed_at timestamptz, last_error text, created_at timestamptz not null default now());
create table public.web_media_approvals (id uuid primary key default gen_random_uuid(), composition_slug text not null, title text not null, url text not null, domain text not null, kind text not null, embed_url text, status text not null check(status in ('approved','rejected')), approved_by text not null, approved_at timestamptz not null default now(), unique(composition_slug,url));

create or replace function public.is_editor(required_roles public.editor_role[] default array['editor','reviewer','admin']::public.editor_role[]) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.editor_profiles where user_id = auth.uid() and role = any(required_roles)); $$;
create or replace function public.queue_search_update() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.search_outbox(entity_type,entity_id,operation,payload)
  values (tg_table_name, coalesce(new.id,old.id), case when tg_op='DELETE' or (tg_op='UPDATE' and old.state='published' and new.state<>'published') then 'delete' else 'upsert' end, case when tg_op='DELETE' then '{}'::jsonb else to_jsonb(new) end);
  return coalesce(new,old);
end $$;
create trigger ragas_search_outbox after insert or update or delete on public.ragas for each row execute function public.queue_search_update();
create trigger compositions_search_outbox after insert or update or delete on public.compositions for each row execute function public.queue_search_update();
create trigger tutorials_search_outbox after insert or update or delete on public.tutorials for each row execute function public.queue_search_update();

alter table public.ragas enable row level security; alter table public.compositions enable row level security; alter table public.people enable row level security; alter table public.releases enable row level security; alter table public.tutorials enable row level security; alter table public.correction_reports enable row level security;
alter table public.web_media_approvals enable row level security;
create policy "published ragas are public" on public.ragas for select using (state='published' or public.is_editor());
create policy "published compositions are public" on public.compositions for select using (state='published' or public.is_editor());
create policy "published people are public" on public.people for select using (state='published' or public.is_editor());
create policy "published releases are public" on public.releases for select using (state='published' or public.is_editor());
create policy "published tutorials are public" on public.tutorials for select using (state='published' or public.is_editor());
create policy "editors manage ragas" on public.ragas for all using (public.is_editor()) with check (public.is_editor());
create policy "editors manage compositions" on public.compositions for all using (public.is_editor()) with check (public.is_editor());
create policy "editors view corrections" on public.correction_reports for select using (public.is_editor());
create policy "approved media is public" on public.web_media_approvals for select using (status='approved' or public.is_editor());
create policy "editors manage web media" on public.web_media_approvals for all using (public.is_editor()) with check (public.is_editor());

create index compositions_state_idx on public.compositions(state); create index ragas_state_idx on public.ragas(state); create index media_status_idx on public.external_media(status,verified_at); create index outbox_pending_idx on public.search_outbox(processed_at,available_at);

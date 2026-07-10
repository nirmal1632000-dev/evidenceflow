-- EvidenceFlow multi-user schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query → Run)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  track text not null default 'rct-intervention',
  current_stage text not null default 'question',
  invite_code text not null unique,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_invite_code_idx on public.projects (invite_code);
create index if not exists projects_created_by_idx on public.projects (created_by);

alter table public.projects enable row level security;

-- Members
create type public.member_role as enum ('owner', 'collaborator', 'viewer');

create table if not exists public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null default 'collaborator',
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create index if not exists project_members_user_idx on public.project_members (user_id);

alter table public.project_members enable row level security;

-- Stage data (one row per project per stage)
create table if not exists public.stage_data (
  project_id uuid not null references public.projects (id) on delete cascade,
  stage_id text not null,
  status text not null default 'not_started',
  lesson_read boolean not null default false,
  quiz_passed boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  primary key (project_id, stage_id)
);

alter table public.stage_data enable row level security;

-- Activity log (lightweight collaboration awareness)
create table if not exists public.project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_activity_project_idx
  on public.project_activity (project_id, created_at desc);

alter table public.project_activity enable row level security;

-- Helper: is member of project
create or replace function public.is_project_member(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members m
    where m.project_id = p_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_project(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members m
    where m.project_id = p_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'collaborator')
  );
$$;

-- RLS: projects
create policy "Members can view projects"
  on public.projects for select
  to authenticated
  using (public.is_project_member(id));

create policy "Authenticated users can create projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Owners and collaborators can update projects"
  on public.projects for update
  to authenticated
  using (public.can_edit_project(id));

create policy "Owners can delete projects"
  on public.projects for delete
  to authenticated
  using (
    exists (
      select 1 from public.project_members m
      where m.project_id = id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- RLS: members
create policy "Members can view membership"
  on public.project_members for select
  to authenticated
  using (public.is_project_member(project_id));

create policy "Owners can insert members"
  on public.project_members for insert
  to authenticated
  with check (
    -- creator adding self as owner, or existing owner adding someone
    auth.uid() = user_id
    or exists (
      select 1 from public.project_members m
      where m.project_id = project_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

create policy "Owners can update members"
  on public.project_members for update
  to authenticated
  using (
    exists (
      select 1 from public.project_members m
      where m.project_id = project_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

create policy "Owners can delete members or users leave"
  on public.project_members for delete
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.project_members m
      where m.project_id = project_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- RLS: stage_data
create policy "Members can view stage data"
  on public.stage_data for select
  to authenticated
  using (public.is_project_member(project_id));

create policy "Editors can insert stage data"
  on public.stage_data for insert
  to authenticated
  with check (public.can_edit_project(project_id));

create policy "Editors can update stage data"
  on public.stage_data for update
  to authenticated
  using (public.can_edit_project(project_id));

-- RLS: activity
create policy "Members can view activity"
  on public.project_activity for select
  to authenticated
  using (public.is_project_member(project_id));

create policy "Members can insert activity"
  on public.project_activity for insert
  to authenticated
  with check (public.is_project_member(project_id));

-- Join by invite code (security definer so non-members can find project id)
create or replace function public.join_project_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id into pid from public.projects
  where upper(invite_code) = upper(trim(code))
  limit 1;

  if pid is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.project_members (project_id, user_id, role)
  values (pid, auth.uid(), 'collaborator')
  on conflict (project_id, user_id) do nothing;

  insert into public.project_activity (project_id, user_id, message)
  values (pid, auth.uid(), 'joined the project via invite code');

  return pid;
end;
$$;

grant execute on function public.join_project_by_code(text) to authenticated;

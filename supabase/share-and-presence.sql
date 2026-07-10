-- Optional migration: public read-only share links for team projects
-- Run in Supabase SQL Editor after schema.sql

alter table public.projects
  add column if not exists share_token text unique;

alter table public.projects
  add column if not exists share_enabled boolean not null default false;

create index if not exists projects_share_token_idx
  on public.projects (share_token)
  where share_token is not null and share_enabled = true;

-- Security definer: anyone with the token can read project + stage_data (view only)
create or replace function public.get_shared_project(token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.projects%rowtype;
  stages json;
begin
  if token is null or length(trim(token)) < 8 then
    return null;
  end if;

  select * into p
  from public.projects
  where share_token = trim(token)
    and share_enabled = true
  limit 1;

  if not found then
    return null;
  end if;

  select coalesce(json_agg(row_to_json(s) order by s.stage_id), '[]'::json)
  into stages
  from public.stage_data s
  where s.project_id = p.id;

  return json_build_object(
    'id', p.id,
    'title', p.title,
    'track', p.track,
    'current_stage', p.current_stage,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'stages', stages
  );
end;
$$;

grant execute on function public.get_shared_project(text) to anon, authenticated;

-- Owners enable/disable share token
create or replace function public.set_project_share(p_id uuid, enable boolean)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_token text;
  is_owner boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select exists (
    select 1 from public.project_members m
    where m.project_id = p_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  ) into is_owner;

  if not is_owner then
    raise exception 'Only owners can manage share links';
  end if;

  if enable then
    new_token := lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));
    update public.projects
    set share_token = new_token,
        share_enabled = true,
        updated_at = now()
    where id = p_id;
    return new_token;
  else
    update public.projects
    set share_enabled = false,
        updated_at = now()
    where id = p_id;
    return null;
  end if;
end;
$$;

grant execute on function public.set_project_share(uuid, boolean) to authenticated;

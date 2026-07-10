# Enable Realtime (optional but recommended for teams)

In Supabase Dashboard → **Database** → **Replication** (or **Publications**):

Enable realtime for tables:

- `stage_data`
- `project_activity`
- `projects`

Or run in SQL Editor:

```sql
alter publication supabase_realtime add table public.stage_data;
alter publication supabase_realtime add table public.project_activity;
alter publication supabase_realtime add table public.projects;
```

If a table is already in the publication, ignore the error.

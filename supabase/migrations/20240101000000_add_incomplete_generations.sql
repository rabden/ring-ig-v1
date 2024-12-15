create table if not exists incomplete_generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  generating_images jsonb not null,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Add RLS policies
alter table incomplete_generations enable row level security;

create policy "Users can insert their own incomplete generations"
  on incomplete_generations for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own incomplete generations"
  on incomplete_generations for select
  using (auth.uid() = user_id);
-- Create movies table with all movie data
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text not null,
  actors text not null,
  description text not null,
  mood_category text not null,
  mood_number integer not null,
  order_in_mood integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.movies enable row level security;

-- Everyone can read movies
create policy "movies_select_public"
  on public.movies for select
  using (true);

-- Create user_movies table for tracking watched status, ratings, and comments
create table if not exists public.user_movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  movie_id uuid references public.movies(id) on delete cascade not null,
  watched boolean default false,
  rating integer check (rating >= 1 and rating <= 5),
  user_comment text,
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- Enable RLS
alter table public.user_movies enable row level security;

-- Users can only see and modify their own movie data
create policy "user_movies_select_own"
  on public.user_movies for select
  using (auth.uid() = user_id);

create policy "user_movies_insert_own"
  on public.user_movies for insert
  with check (auth.uid() = user_id);

create policy "user_movies_update_own"
  on public.user_movies for update
  using (auth.uid() = user_id);

create policy "user_movies_delete_own"
  on public.user_movies for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index if not exists user_movies_user_id_idx on public.user_movies(user_id);
create index if not exists user_movies_movie_id_idx on public.user_movies(movie_id);
create index if not exists movies_mood_category_idx on public.movies(mood_category);

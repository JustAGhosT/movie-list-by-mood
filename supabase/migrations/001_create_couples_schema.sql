-- Couples Table
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user1_name TEXT NOT NULL,
  user2_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- Watched Movies Table
CREATE TABLE IF NOT EXISTS public.watched_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  title TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  poster_path TEXT,
  overview TEXT,
  release_date TEXT,
  user1_rating INTEGER NOT NULL CHECK (user1_rating >= 1 AND user1_rating <= 10),
  user2_rating INTEGER NOT NULL CHECK (user2_rating >= 1 AND user2_rating <= 10),
  watched_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(couple_id, movie_id)
);

-- Genre Preferences Table
CREATE TABLE IF NOT EXISTS public.genre_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  genre TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(couple_id, user_id, genre)
);

-- AI Insights Cache Table
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  shared_tastes TEXT[] NOT NULL DEFAULT '{}',
  user1_preferences TEXT[] NOT NULL DEFAULT '{}',
  user2_preferences TEXT[] NOT NULL DEFAULT '{}',
  avoid_patterns TEXT[] NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_couples_user1 ON public.couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2 ON public.couples(user2_id);
CREATE INDEX IF NOT EXISTS idx_watched_movies_couple ON public.watched_movies(couple_id);
CREATE INDEX IF NOT EXISTS idx_watched_movies_date ON public.watched_movies(watched_date DESC);
CREATE INDEX IF NOT EXISTS idx_genre_preferences_couple ON public.genre_preferences(couple_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_couple ON public.ai_insights(couple_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated ON public.ai_insights(generated_at DESC);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watched_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genre_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Couples policies
CREATE POLICY "Users can view their own couples" ON public.couples
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create couples" ON public.couples
  FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Couple members can update their couple" ON public.couples
  FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Watched movies policies
CREATE POLICY "Couple members can view their watched movies" ON public.watched_movies
  FOR SELECT
  USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Couple members can add watched movies" ON public.watched_movies
  FOR INSERT
  WITH CHECK (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Couple members can update their watched movies" ON public.watched_movies
  FOR UPDATE
  USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Couple members can delete their watched movies" ON public.watched_movies
  FOR DELETE
  USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

-- Genre preferences policies
CREATE POLICY "Users can view their genre preferences" ON public.genre_preferences
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their genre preferences" ON public.genre_preferences
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their genre preferences" ON public.genre_preferences
  FOR UPDATE
  USING (user_id = auth.uid());

-- AI insights policies
CREATE POLICY "Couple members can view their AI insights" ON public.ai_insights
  FOR SELECT
  USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "System can create AI insights" ON public.ai_insights
  FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_couples_updated_at
  BEFORE UPDATE ON public.couples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watched_movies_updated_at
  BEFORE UPDATE ON public.watched_movies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genre_preferences_updated_at
  BEFORE UPDATE ON public.genre_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

import { createClient } from "@/lib/supabase/server"
import type { CoupleProfile, WatchedMovie, GenreRating } from "@/types/recommendations"

/**
 * Get or create a couple profile for the current user
 */
export async function getOrCreateCouple(
  user1Id: string,
  user2Id: string,
  user1Name: string,
  user2Name: string
): Promise<CoupleProfile | null> {
  const supabase = await createClient()

  // Try to find existing couple
  const { data: existing, error: fetchError } = await supabase
    .from("couples")
    .select("*")
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single()

  if (existing && !fetchError) {
    return {
      id: existing.id,
      user1Id: existing.user1_id,
      user2Id: existing.user2_id,
      user1Name: existing.user1_name,
      user2Name: existing.user2_name,
      createdAt: new Date(existing.created_at),
      updatedAt: new Date(existing.updated_at),
    }
  }

  // Create new couple
  const { data: newCouple, error: createError } = await supabase
    .from("couples")
    .insert({
      user1_id: user1Id,
      user2_id: user2Id,
      user1_name: user1Name,
      user2_name: user2Name,
    })
    .select()
    .single()

  if (createError || !newCouple) {
    console.error("Error creating couple:", createError)
    return null
  }

  return {
    id: newCouple.id,
    user1Id: newCouple.user1_id,
    user2Id: newCouple.user2_id,
    user1Name: newCouple.user1_name,
    user2Name: newCouple.user2_name,
    createdAt: new Date(newCouple.created_at),
    updatedAt: new Date(newCouple.updated_at),
  }
}

/**
 * Get watched movies for a couple
 */
export async function getWatchedMovies(coupleId: string): Promise<WatchedMovie[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("couple_id", coupleId)
    .order("watched_date", { ascending: false })

  if (error) {
    console.error("Error fetching watched movies:", error)
    return []
  }

  return data.map((movie) => ({
    id: movie.id,
    movieId: movie.movie_id,
    title: movie.title,
    genres: movie.genres,
    posterPath: movie.poster_path,
    overview: movie.overview,
    releaseDate: movie.release_date,
    ratings: {
      user1: movie.user1_rating,
      user2: movie.user2_rating,
    },
    watchedDate: new Date(movie.watched_date),
    coupleId: movie.couple_id,
  }))
}

/**
 * Add a watched movie for a couple
 */
export async function addWatchedMovie(
  coupleId: string,
  movieId: string,
  title: string,
  genres: string[],
  user1Rating: number,
  user2Rating: number,
  posterPath?: string,
  overview?: string,
  releaseDate?: string
): Promise<WatchedMovie | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("watched_movies")
    .insert({
      couple_id: coupleId,
      movie_id: movieId,
      title,
      genres,
      user1_rating: user1Rating,
      user2_rating: user2Rating,
      poster_path: posterPath,
      overview,
      release_date: releaseDate,
    })
    .select()
    .single()

  if (error || !data) {
    console.error("Error adding watched movie:", error)
    return null
  }

  return {
    id: data.id,
    movieId: data.movie_id,
    title: data.title,
    genres: data.genres,
    posterPath: data.poster_path,
    overview: data.overview,
    releaseDate: data.release_date,
    ratings: {
      user1: data.user1_rating,
      user2: data.user2_rating,
    },
    watchedDate: new Date(data.watched_date),
    coupleId: data.couple_id,
  }
}

/**
 * Update ratings for a watched movie
 */
export async function updateMovieRatings(
  movieId: string,
  user1Rating: number,
  user2Rating: number
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("watched_movies")
    .update({
      user1_rating: user1Rating,
      user2_rating: user2Rating,
    })
    .eq("id", movieId)

  if (error) {
    console.error("Error updating movie ratings:", error)
    return false
  }

  return true
}

/**
 * Get genre preferences for a user
 */
export async function getGenrePreferences(
  coupleId: string,
  userId: string
): Promise<GenreRating[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("genre_preferences")
    .select("*")
    .eq("couple_id", coupleId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching genre preferences:", error)
    return []
  }

  return data.map((pref) => ({
    genre: pref.genre as any,
    rating: pref.rating as any,
  }))
}

/**
 * Save genre preferences for a user
 */
export async function saveGenrePreferences(
  coupleId: string,
  userId: string,
  preferences: GenreRating[]
): Promise<boolean> {
  const supabase = await createClient()

  // Delete existing preferences
  await supabase
    .from("genre_preferences")
    .delete()
    .eq("couple_id", coupleId)
    .eq("user_id", userId)

  // Insert new preferences
  const { error } = await supabase.from("genre_preferences").insert(
    preferences.map((pref) => ({
      couple_id: coupleId,
      user_id: userId,
      genre: pref.genre,
      rating: pref.rating,
    }))
  )

  if (error) {
    console.error("Error saving genre preferences:", error)
    return false
  }

  return true
}

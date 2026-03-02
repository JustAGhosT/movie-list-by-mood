/**
 * Client-side storage using localStorage for watch history and preferences
 * This is suitable for a small user base (2-3 users) and keeps data local
 */

import type { WatchedMovie, CoupleProfile, GenreRating } from "@/types/recommendations"

const STORAGE_KEYS = {
  COUPLE_PROFILE: 'couple_profile',
  WATCHED_MOVIES: 'watched_movies',
  GENRE_PREFERENCES: 'genre_preferences',
  USER_1_PREFS: 'user_1_genre_prefs',
  USER_2_PREFS: 'user_2_genre_prefs',
}

/**
 * Get or create couple profile
 */
export function getCoupleProfile(): CoupleProfile | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEYS.COUPLE_PROFILE)
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

/**
 * Save couple profile
 */
export function saveCoupleProfile(profile: CoupleProfile): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(STORAGE_KEYS.COUPLE_PROFILE, JSON.stringify(profile))
}

/**
 * Get all watched movies
 */
export function getWatchedMovies(): WatchedMovie[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.WATCHED_MOVIES)
  if (stored) {
    const movies = JSON.parse(stored)
    // Convert date strings back to Date objects
    return movies.map((m: any) => ({
      ...m,
      watchedDate: new Date(m.watchedDate),
    }))
  }
  return []
}

/**
 * Add a watched movie
 */
export function addWatchedMovie(movie: Omit<WatchedMovie, 'id'>): WatchedMovie {
  if (typeof window === 'undefined') throw new Error('Cannot add movie on server')
  
  const movies = getWatchedMovies()
  const newMovie: WatchedMovie = {
    ...movie,
    id: `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }
  
  movies.push(newMovie)
  localStorage.setItem(STORAGE_KEYS.WATCHED_MOVIES, JSON.stringify(movies))
  
  return newMovie
}

/**
 * Update ratings for a watched movie
 */
export function updateMovieRatings(
  movieId: string,
  user1Rating: number,
  user2Rating: number
): boolean {
  if (typeof window === 'undefined') return false
  
  const movies = getWatchedMovies()
  const movieIndex = movies.findIndex(m => m.id === movieId)
  
  if (movieIndex === -1) return false
  
  movies[movieIndex].ratings = {
    user1: user1Rating,
    user2: user2Rating,
  }
  
  localStorage.setItem(STORAGE_KEYS.WATCHED_MOVIES, JSON.stringify(movies))
  return true
}

/**
 * Delete a watched movie
 */
export function deleteWatchedMovie(movieId: string): boolean {
  if (typeof window === 'undefined') return false
  
  const movies = getWatchedMovies()
  const filtered = movies.filter(m => m.id !== movieId)
  
  if (filtered.length === movies.length) return false
  
  localStorage.setItem(STORAGE_KEYS.WATCHED_MOVIES, JSON.stringify(filtered))
  return true
}

/**
 * Get genre preferences for a user
 */
export function getGenrePreferences(userNumber: 1 | 2): GenreRating[] {
  if (typeof window === 'undefined') return []
  
  const key = userNumber === 1 ? STORAGE_KEYS.USER_1_PREFS : STORAGE_KEYS.USER_2_PREFS
  const stored = localStorage.getItem(key)
  
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

/**
 * Save genre preferences for a user
 */
export function saveGenrePreferences(userNumber: 1 | 2, preferences: GenreRating[]): void {
  if (typeof window === 'undefined') return
  
  const key = userNumber === 1 ? STORAGE_KEYS.USER_1_PREFS : STORAGE_KEYS.USER_2_PREFS
  localStorage.setItem(key, JSON.stringify(preferences))
}

/**
 * Clear all data (for testing or reset)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

/**
 * Export all data as JSON (for backup)
 */
export function exportData(): string {
  if (typeof window === 'undefined') return '{}'
  
  const data = {
    coupleProfile: getCoupleProfile(),
    watchedMovies: getWatchedMovies(),
    user1Preferences: getGenrePreferences(1),
    user2Preferences: getGenrePreferences(2),
    exportedAt: new Date().toISOString(),
  }
  
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON (for restore)
 */
export function importData(jsonData: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const data = JSON.parse(jsonData)
    
    if (data.coupleProfile) {
      saveCoupleProfile(data.coupleProfile)
    }
    
    if (data.watchedMovies) {
      localStorage.setItem(STORAGE_KEYS.WATCHED_MOVIES, JSON.stringify(data.watchedMovies))
    }
    
    if (data.user1Preferences) {
      saveGenrePreferences(1, data.user1Preferences)
    }
    
    if (data.user2Preferences) {
      saveGenrePreferences(2, data.user2Preferences)
    }
    
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

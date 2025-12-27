import { getContainer, CONTAINERS } from "./client"
import type { CoupleProfile, WatchedMovie, GenreRating } from "@/types/recommendations"

/**
 * Get or create couple profile
 */
export async function getOrCreateCouple(
  user1Id: string,
  user2Id: string,
  user1Name: string,
  user2Name: string
): Promise<CoupleProfile | null> {
  try {
    const container = await getContainer(CONTAINERS.COUPLES, "/user1Id")
    
    // Try to find existing couple
    const querySpec = {
      query: "SELECT * FROM c WHERE (c.user1Id = @user1Id AND c.user2Id = @user2Id) OR (c.user1Id = @user2Id AND c.user2Id = @user1Id)",
      parameters: [
        { name: "@user1Id", value: user1Id },
        { name: "@user2Id", value: user2Id },
      ],
    }
    
    const { resources } = await container.items.query(querySpec).fetchAll()
    
    if (resources.length > 0) {
      const couple = resources[0]
      return {
        id: couple.id,
        user1Id: couple.user1Id,
        user2Id: couple.user2Id,
        user1Name: couple.user1Name,
        user2Name: couple.user2Name,
        createdAt: new Date(couple.createdAt),
        updatedAt: new Date(couple.updatedAt),
      }
    }
    
    // Create new couple
    const newCouple = {
      id: `couple-${Date.now()}`,
      user1Id,
      user2Id,
      user1Name,
      user2Name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const { resource } = await container.items.create(newCouple)
    
    if (!resource) return null
    
    return {
      id: resource.id,
      user1Id: resource.user1Id,
      user2Id: resource.user2Id,
      user1Name: resource.user1Name,
      user2Name: resource.user2Name,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
    }
  } catch (error) {
    console.error("Error in getOrCreateCouple:", error)
    return null
  }
}

/**
 * Get watched movies for a couple
 */
export async function getWatchedMovies(coupleId: string): Promise<WatchedMovie[]> {
  try {
    const container = await getContainer(CONTAINERS.WATCHED_MOVIES, "/coupleId")
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.coupleId = @coupleId ORDER BY c.watchedDate DESC",
      parameters: [{ name: "@coupleId", value: coupleId }],
    }
    
    const { resources } = await container.items.query(querySpec).fetchAll()
    
    return resources.map((movie) => ({
      id: movie.id,
      movieId: movie.movieId,
      title: movie.title,
      genres: movie.genres,
      posterPath: movie.posterPath,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      ratings: {
        user1: movie.ratings.user1,
        user2: movie.ratings.user2,
      },
      watchedDate: new Date(movie.watchedDate),
      coupleId: movie.coupleId,
    }))
  } catch (error) {
    console.error("Error in getWatchedMovies:", error)
    return []
  }
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
  try {
    const container = await getContainer(CONTAINERS.WATCHED_MOVIES, "/coupleId")
    
    const newMovie = {
      id: `watched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coupleId,
      movieId,
      title,
      genres,
      posterPath,
      overview,
      releaseDate,
      ratings: {
        user1: user1Rating,
        user2: user2Rating,
      },
      watchedDate: new Date().toISOString(),
    }
    
    const { resource } = await container.items.create(newMovie)
    
    if (!resource) return null
    
    return {
      id: resource.id,
      movieId: resource.movieId,
      title: resource.title,
      genres: resource.genres,
      posterPath: resource.posterPath,
      overview: resource.overview,
      releaseDate: resource.releaseDate,
      ratings: resource.ratings,
      watchedDate: new Date(resource.watchedDate),
      coupleId: resource.coupleId,
    }
  } catch (error) {
    console.error("Error in addWatchedMovie:", error)
    return null
  }
}

/**
 * Update ratings for a watched movie
 */
export async function updateMovieRatings(
  movieId: string,
  coupleId: string,
  user1Rating: number,
  user2Rating: number
): Promise<boolean> {
  try {
    const container = await getContainer(CONTAINERS.WATCHED_MOVIES, "/coupleId")
    
    const { resource: movie } = await container.item(movieId, coupleId).read()
    
    if (!movie) return false
    
    movie.ratings = {
      user1: user1Rating,
      user2: user2Rating,
    }
    movie.updatedAt = new Date().toISOString()
    
    await container.item(movieId, coupleId).replace(movie)
    
    return true
  } catch (error) {
    console.error("Error in updateMovieRatings:", error)
    return false
  }
}

/**
 * Get genre preferences for a user
 */
export async function getGenrePreferences(
  coupleId: string,
  userId: string
): Promise<GenreRating[]> {
  try {
    const container = await getContainer(CONTAINERS.GENRE_PREFERENCES, "/coupleId")
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.coupleId = @coupleId AND c.userId = @userId",
      parameters: [
        { name: "@coupleId", value: coupleId },
        { name: "@userId", value: userId },
      ],
    }
    
    const { resources } = await container.items.query(querySpec).fetchAll()
    
    return resources.map((pref) => ({
      genre: pref.genre,
      rating: pref.rating,
    }))
  } catch (error) {
    console.error("Error in getGenrePreferences:", error)
    return []
  }
}

/**
 * Save genre preferences for a user
 */
export async function saveGenrePreferences(
  coupleId: string,
  userId: string,
  preferences: GenreRating[]
): Promise<boolean> {
  try {
    const container = await getContainer(CONTAINERS.GENRE_PREFERENCES, "/coupleId")
    
    // Delete existing preferences
    const querySpec = {
      query: "SELECT * FROM c WHERE c.coupleId = @coupleId AND c.userId = @userId",
      parameters: [
        { name: "@coupleId", value: coupleId },
        { name: "@userId", value: userId },
      ],
    }
    
    const { resources } = await container.items.query(querySpec).fetchAll()
    
    for (const pref of resources) {
      await container.item(pref.id, coupleId).delete()
    }
    
    // Insert new preferences
    for (const pref of preferences) {
      await container.items.create({
        id: `pref-${coupleId}-${userId}-${pref.genre}-${Date.now()}`,
        coupleId,
        userId,
        genre: pref.genre,
        rating: pref.rating,
        createdAt: new Date().toISOString(),
      })
    }
    
    return true
  } catch (error) {
    console.error("Error in saveGenrePreferences:", error)
    return false
  }
}

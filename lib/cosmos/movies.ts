import { getContainer, CONTAINERS } from "./client"

export interface Movie {
  id: string
  title: string
  genre: string
  actors: string
  description: string
  moodCategory: string
  moodNumber: number
  orderInMood: number
}

export interface UserMovie {
  id: string
  userId: string
  movieId: string
  watched: boolean
  rating?: number
  comment?: string
  watchedAt?: string
}

export interface MovieWithUserData extends Movie {
  userMovie?: UserMovie
}

/**
 * Get all movies, optionally filtered by mood
 */
export async function getMovies(
  userId: string,
  moodCategory?: string
): Promise<MovieWithUserData[]> {
  try {
    const moviesContainer = await getContainer(CONTAINERS.MOVIES, "/id")
    const userMoviesContainer = await getContainer(CONTAINERS.USER_MOVIES, "/userId")
    
    // Get movies
    let moviesQuery = "SELECT * FROM c ORDER BY c.moodNumber ASC, c.orderInMood ASC"
    const parameters: any[] = []
    
    if (moodCategory && moodCategory !== "all") {
      moviesQuery = "SELECT * FROM c WHERE c.moodCategory = @moodCategory ORDER BY c.moodNumber ASC, c.orderInMood ASC"
      parameters.push({ name: "@moodCategory", value: moodCategory })
    }
    
    const { resources: movies } = await moviesContainer.items
      .query({ query: moviesQuery, parameters })
      .fetchAll()
    
    // Get user movie data
    const { resources: userMovies } = await userMoviesContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll()
    
    // Combine movies with user data
    const userMovieMap = new Map(userMovies.map(um => [um.movieId, um]))
    
    return movies.map(movie => ({
      ...movie,
      userMovie: userMovieMap.get(movie.id),
    }))
  } catch (error) {
    console.error("Error in getMovies:", error)
    return []
  }
}

/**
 * Update user movie data (watched status, rating, comment)
 */
export async function updateUserMovie(
  userId: string,
  movieId: string,
  data: {
    watched?: boolean
    rating?: number
    comment?: string
  }
): Promise<boolean> {
  try {
    const container = await getContainer(CONTAINERS.USER_MOVIES, "/userId")
    
    // Check if user movie exists
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId AND c.movieId = @movieId",
      parameters: [
        { name: "@userId", value: userId },
        { name: "@movieId", value: movieId },
      ],
    }
    
    const { resources } = await container.items.query(querySpec).fetchAll()
    
    if (resources.length > 0) {
      // Update existing
      const userMovie = resources[0]
      Object.assign(userMovie, data)
      userMovie.updatedAt = new Date().toISOString()
      
      if (data.watched && !userMovie.watchedAt) {
        userMovie.watchedAt = new Date().toISOString()
      }
      
      await container.item(userMovie.id, userId).replace(userMovie)
    } else {
      // Create new
      const newUserMovie = {
        id: `usermovie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        movieId,
        ...data,
        watchedAt: data.watched ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
      }
      
      await container.items.create(newUserMovie)
    }
    
    return true
  } catch (error) {
    console.error("Error in updateUserMovie:", error)
    return false
  }
}

/**
 * Get unique mood categories
 */
export async function getMoodCategories(): Promise<string[]> {
  try {
    const container = await getContainer(CONTAINERS.MOVIES, "/id")
    
    const { resources } = await container.items
      .query({
        query: "SELECT DISTINCT c.moodCategory FROM c ORDER BY c.moodNumber ASC",
      })
      .fetchAll()
    
    return resources.map(r => r.moodCategory)
  } catch (error) {
    console.error("Error in getMoodCategories:", error)
    return []
  }
}

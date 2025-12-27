import type { TMDBMovie, Genre } from "@/types/recommendations"

const TMDB_API_BASE = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

/**
 * Search for movies by title using TMDB API
 */
export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results.slice(0, 10).map(mapTMDBMovie)
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

/**
 * Get movie details by TMDB ID
 */
export async function getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}?api_key=${apiKey}&language=en-US`
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return mapTMDBMovie(data)
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results.map(mapTMDBMovie)
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return []
  }
}

/**
 * Get movie recommendations from TMDB based on a movie ID
 */
export async function getTMDBRecommendations(
  movieId: number
): Promise<TMDBMovie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results.slice(0, 10).map(mapTMDBMovie)
  } catch (error) {
    console.error("Error fetching TMDB recommendations:", error)
    return []
  }
}

/**
 * Map TMDB API response to our TMDBMovie type
 */
function mapTMDBMovie(tmdbData: any): TMDBMovie {
  return {
    id: tmdbData.id,
    title: tmdbData.title,
    overview: tmdbData.overview || "",
    posterPath: tmdbData.poster_path
      ? `${TMDB_IMAGE_BASE}/w500${tmdbData.poster_path}`
      : null,
    backdropPath: tmdbData.backdrop_path
      ? `${TMDB_IMAGE_BASE}/w1280${tmdbData.backdrop_path}`
      : null,
    releaseDate: tmdbData.release_date || "",
    voteAverage: tmdbData.vote_average || 0,
    genres: mapGenres(tmdbData.genres || tmdbData.genre_ids || []),
    runtime: tmdbData.runtime,
  }
}

/**
 * Map TMDB genre IDs/names to our Genre type
 */
function mapGenres(tmdbGenres: any[]): Genre[] {
  const genreMap: Record<number, Genre> = {
    28: "Action",
    35: "Comedy",
    18: "Drama",
    10749: "Romance",
    53: "Thriller",
    27: "Horror",
    878: "Sci-Fi",
    14: "Fantasy",
    99: "Documentary",
    16: "Animation",
    9648: "Mystery",
    80: "Crime",
  }

  return tmdbGenres
    .map((g) => {
      if (typeof g === "number") {
        return genreMap[g]
      }
      if (g.id && genreMap[g.id]) {
        return genreMap[g.id]
      }
      return null
    })
    .filter((g): g is Genre => g !== null)
}

/**
 * Get the full URL for a TMDB image
 */
export function getTMDBImageUrl(
  path: string | null,
  size: "w200" | "w500" | "w1280" | "original" = "w500"
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

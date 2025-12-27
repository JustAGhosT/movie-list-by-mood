import { NextRequest, NextResponse } from "next/server"
import { searchMovies, getMovieDetails, getPopularMovies } from "@/lib/tmdb/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const movieId = searchParams.get("id")
  const popular = searchParams.get("popular")

  try {
    if (movieId) {
      // Get movie by ID
      const movie = await getMovieDetails(parseInt(movieId))
      if (!movie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 })
      }
      return NextResponse.json(movie)
    }

    if (popular === "true") {
      // Get popular movies
      const page = parseInt(searchParams.get("page") || "1")
      const movies = await getPopularMovies(page)
      return NextResponse.json(movies)
    }

    if (query) {
      // Search movies
      const movies = await searchMovies(query)
      return NextResponse.json(movies)
    }

    return NextResponse.json(
      { error: "Missing query parameter: q, id, or popular" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in movies API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch movies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

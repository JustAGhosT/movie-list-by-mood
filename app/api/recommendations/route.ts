import { NextRequest, NextResponse } from "next/server"
import { generateCoupleRecommendations } from "@/lib/ai/recommendations"
import { searchMovies } from "@/lib/tmdb/client"
import type { RecommendationRequest } from "@/types/recommendations"

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()

    // Validate request
    if (!body.watchHistory || body.watchHistory.length === 0) {
      return NextResponse.json(
        { error: "Watch history is required" },
        { status: 400 }
      )
    }

    // Generate AI recommendations
    const aiRecommendations = await generateCoupleRecommendations(body)

    // Enrich recommendations with TMDB data
    const enrichedRecommendations = await Promise.all(
      aiRecommendations.recommendations.map(async (rec) => {
        // Search for the movie in TMDB
        const tmdbResults = await searchMovies(rec.movie.title)
        if (tmdbResults.length > 0) {
          // Use the first match (usually most accurate)
          const tmdbMovie = tmdbResults[0]
          return {
            ...rec,
            movie: {
              ...tmdbMovie,
              overview: rec.reasoning, // Keep AI reasoning as overview
            },
          }
        }
        return rec
      })
    )

    return NextResponse.json({
      ...aiRecommendations,
      recommendations: enrichedRecommendations,
    })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

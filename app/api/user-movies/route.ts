import { NextRequest, NextResponse } from "next/server"
import { updateUserMovie } from "@/lib/cosmos/movies"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, movieId, watched, rating, comment } = body

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "userId and movieId are required" },
        { status: 400 }
      )
    }

    const success = await updateUserMovie(userId, movieId, {
      watched,
      rating,
      comment,
    })

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update user movie" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in user-movies API:", error)
    return NextResponse.json(
      {
        error: "Failed to update user movie",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

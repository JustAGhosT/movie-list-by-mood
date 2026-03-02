"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, MessageSquare, FileEdit } from "lucide-react"
import { useState } from "react"
import type { MovieWithUserData } from "@/lib/cosmos/movies"
import { MovieDialog } from "@/components/movie-dialog"

export function MovieCard({
  movie,
  userId,
}: {
  movie: MovieWithUserData
  userId: string
}) {
  const userMovie = movie.userMovie
  const [watched, setWatched] = useState(userMovie?.watched || false)
  const [rating, setRating] = useState(userMovie?.rating || 0)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleWatchedToggle = async () => {
    setIsLoading(true)
    try {
      const newWatched = !watched

      await fetch("/api/user-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: movie.id,
          watched: newWatched,
        }),
      })

      setWatched(newWatched)
      window.location.reload()
    } catch (error) {
      console.error("Error toggling watched:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingClick = async (newRating: number) => {
    setIsLoading(true)
    try {
      const ratingValue = rating === newRating ? null : newRating

      await fetch("/api/user-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: movie.id,
          rating: ratingValue,
        }),
      })

      setRating(ratingValue || 0)
      window.location.reload()
    } catch (error) {
      console.error("Error updating rating:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className={watched ? "border-primary/50 bg-primary/5" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-1 text-balance">{movie.title}</CardTitle>
              <CardDescription className="text-sm">{movie.genre}</CardDescription>
            </div>
            <Button
              variant={watched ? "default" : "outline"}
              size="sm"
              onClick={handleWatchedToggle}
              disabled={isLoading}
              className="shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Akteurs</p>
            <p className="text-sm font-medium">{movie.actors}</p>
          </div>

          <p className="text-sm leading-relaxed">{movie.description}</p>

          <div className="space-y-3 pt-2">
            <div>
              <p className="text-sm font-medium mb-2">Gradering</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    disabled={isLoading}
                    className="touch-manipulation"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)} className="flex-1 gap-2">
                <MessageSquare className="h-4 w-4" />
                {userMovie?.comment ? "Wysig Kommentaar" : "Voeg Kommentaar by"}
              </Button>
            </div>

            {userMovie?.comment && (
              <div className="space-y-2 text-sm pt-2 border-t">
                <div>
                  <p className="font-medium text-xs text-muted-foreground mb-1">Kommentaar</p>
                  <p className="leading-relaxed">{userMovie.comment}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MovieDialog open={dialogOpen} onOpenChange={setDialogOpen} movie={movie} userMovie={userMovie} userId={userId} />
    </>
  )
}

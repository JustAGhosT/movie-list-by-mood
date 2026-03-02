"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { MovieWithUserData, UserMovie } from "@/lib/cosmos/movies"

export function MovieDialog({
  open,
  onOpenChange,
  movie,
  userMovie,
  userId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  movie: MovieWithUserData
  userMovie?: UserMovie
  userId: string
}) {
  const [comment, setComment] = useState(userMovie?.comment || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/user-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: movie.id,
          comment: comment || undefined,
        }),
      })

      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("Error saving comment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
          <DialogDescription>{movie.genre}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Jou Kommentaar</Label>
            <Textarea
              id="comment"
              placeholder="Skryf jou gedagtes oor hierdie fliek..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kanselleer
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Besig..." : "Stoor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

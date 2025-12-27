"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MovieWithUserData, UserMovie } from "@/types/database"

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
  const [userComment, setUserComment] = useState(userMovie?.user_comment || "")
  const [adminNote, setAdminNote] = useState(userMovie?.admin_note || "")
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (userMovie) {
        await supabase
          .from("user_movies")
          .update({
            user_comment: userComment || null,
            admin_note: adminNote || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userMovie.id)
      } else {
        await supabase.from("user_movies").insert({
          user_id: userId,
          movie_id: movie.id,
          user_comment: userComment || null,
          admin_note: adminNote || null,
          watched: false,
        })
      }

      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error saving comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-balance">{movie.title}</DialogTitle>
          <DialogDescription>Voeg jou kommentaar en persoonlike notas by</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-comment" className="text-base">
              Kommentaar
            </Label>
            <Textarea
              id="user-comment"
              placeholder="Wat het jy van hierdie fliek gedink?"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-note" className="text-base">
              Persoonlike Nota
            </Label>
            <Textarea
              id="admin-note"
              placeholder="Voeg jou eie notas by (slegs vir jou sigbaar)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kanselleer
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Besig om te stoor..." : "Stoor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

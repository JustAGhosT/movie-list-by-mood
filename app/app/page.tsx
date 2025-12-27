'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, type User } from "@/lib/auth/azure-swa-auth"
import { MovieList } from "@/components/movie-list"
import { MoodFilter } from "@/components/mood-filter"
import { Header } from "@/components/header"

export default function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const params = searchParams
    params.then(p => {
      setSelectedMood(p.mood || "all")
    })
  }, [searchParams])

  useEffect(() => {
    async function checkAuth() {
      const { user: authenticatedUser, isAuthenticated } = await getUser()
      
      if (!isAuthenticated || !authenticatedUser) {
        // Redirect to login
        window.location.href = '/login'
        return
      }
      
      setUser(authenticatedUser)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">Fliek Kyklys</h1>
          <p className="text-lg text-muted-foreground">Kies 'n bui en vind die perfekte fliek</p>
        </div>

        <MoodFilter selectedMood={selectedMood} />
        <MovieList userId={user.id} selectedMood={selectedMood} />
      </main>
    </div>
  )
}

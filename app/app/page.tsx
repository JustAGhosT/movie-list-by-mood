import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MovieList } from "@/components/movie-list"
import { MoodFilter } from "@/components/mood-filter"
import { Header } from "@/components/header"

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const selectedMood = params.mood || "all"

  return (
    <div className="min-h-screen bg-background">
      <Header user={data.user} />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">Fliek Kyklys</h1>
          <p className="text-lg text-muted-foreground">Kies 'n bui en vind die perfekte fliek</p>
        </div>

        <MoodFilter selectedMood={selectedMood} />
        <MovieList userId={data.user.id} selectedMood={selectedMood} />
      </main>
    </div>
  )
}

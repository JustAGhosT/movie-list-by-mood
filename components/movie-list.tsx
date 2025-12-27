import { getMovies, type MovieWithUserData } from "@/lib/cosmos/movies"
import { MovieCard } from "@/components/movie-card"

export async function MovieList({
  userId,
  selectedMood,
}: {
  userId: string
  selectedMood: string
}) {
  const movies = await getMovies(userId, selectedMood)

  if (!movies || movies.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Geen flieks gevind nie.</div>
  }

  const moviesByMood = movies.reduce(
    (acc, movie) => {
      const mood = movie.moodCategory
      if (!acc[mood]) {
        acc[mood] = []
      }
      acc[mood].push(movie)
      return acc
    },
    {} as Record<string, MovieWithUserData[]>,
  )

  return (
    <div className="space-y-12">
      {Object.entries(moviesByMood).map(([mood, moodMovies]) => (
        <div key={mood}>
          <h2 className="text-2xl font-bold mb-6 text-balance">{mood}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moodMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} userId={userId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

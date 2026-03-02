// Couple's movie rating and recommendation types

export interface UserProfile {
  id: string
  name: string
  preferences: GenreRating[]
}

export interface GenreRating {
  genre: Genre
  rating: 1 | 2 | 3 | 4 | 5 // 1 = dislike, 5 = love
}

export type Genre =
  | "Action"
  | "Comedy"
  | "Drama"
  | "Romance"
  | "Thriller"
  | "Horror"
  | "Sci-Fi"
  | "Fantasy"
  | "Documentary"
  | "Animation"
  | "Mystery"
  | "Crime"

export interface WatchedMovie {
  id: string
  movieId: string
  title: string
  genres: Genre[]
  posterPath?: string
  overview?: string
  releaseDate?: string
  ratings: {
    user1: number // 1-10
    user2: number // 1-10
  }
  watchedDate: Date
  coupleId: string
}

export interface CoupleProfile {
  id: string
  user1Id: string
  user2Id: string
  user1Name: string
  user2Name: string
  createdAt: Date
  updatedAt: Date
}

export interface AIInsight {
  sharedTastes: string[]
  user1Preferences: string[]
  user2Preferences: string[]
  avoidPatterns: string[]
  generatedAt: Date
}

export interface MovieRecommendation {
  movie: TMDBMovie
  confidence: number // 0-100
  reasoning: string
  predictedRatings: {
    user1: number
    user2: number
  }
  compatibilityScore: number
}

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  genres: Genre[]
  runtime?: number
}

export interface RecommendationRequest {
  coupleId: string
  watchHistory: WatchedMovie[]
  preferences?: {
    user1: GenreRating[]
    user2: GenreRating[]
  }
  excludeWatched?: boolean
  limit?: number
}

export interface RecommendationResponse {
  recommendations: MovieRecommendation[]
  insights: AIInsight
  generatedAt: Date
}

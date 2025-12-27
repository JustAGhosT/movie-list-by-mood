export interface Movie {
  id: string
  title: string
  genre: string
  actors: string
  description: string
  mood_category: string
  mood_number: number
  order_in_mood: number
  created_at: string
}

export interface UserMovie {
  id: string
  user_id: string
  movie_id: string
  watched: boolean
  rating: number | null
  user_comment: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
}

export interface MovieWithUserData extends Movie {
  user_movies?: UserMovie[]
}

export interface MoodCategory {
  name: string
  number: number
  emoji: string
  description: string
}

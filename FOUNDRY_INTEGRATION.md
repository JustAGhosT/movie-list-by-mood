# Azure AI Foundry Integration Guide

## Overview

This application integrates with Azure AI Foundry to provide intelligent movie recommendations for couples using AI-powered analysis of watch history and preferences.

## Features

### 1. Couple's Movie Matching
- Each person rates genres and movies independently
- AI analyzes both profiles to find overlapping preferences
- Suggests movies both partners will enjoy

### 2. Watch History Analysis
- Track movies watched together with individual ratings (1-10 scale)
- AI identifies patterns in what each person likes
- Generates insights about shared tastes and differences

### 3. Smart Recommendations
- AI-powered suggestions based on combined preferences
- Detailed reasoning for each recommendation
- Predicted ratings for both users
- Compatibility scores for each movie

### 4. Personalized Insights
- What both users enjoy together
- Individual preferences and unique tastes
- Movies/genres to avoid based on low ratings

## Azure AI Foundry Setup

### Prerequisites

1. Azure subscription with AI Foundry access
2. Deployed AI models in Foundry project: `mys-shared-ai-san-project`

### Available Models

The application is configured to use the following models from your Foundry deployment:

- **gpt-4o** (Default): General recommendations and insights
- **gpt-4.1**: Advanced reasoning for complex preferences
- **o3-mini**: Fast recommendations for real-time suggestions
- **text-embedding-3-large**: Semantic search for similar movies

### Configuration

#### 1. Get Your Foundry Endpoint

From Azure AI Foundry portal:
1. Navigate to your project: `mys-shared-ai-san-project`
2. Go to "Models" → "Deployments"
3. Select your deployment (e.g., `gpt-4o`)
4. Copy the endpoint URL

**Format:** `https://[your-foundry].openai.azure.com/`

#### 2. Get Your API Key

From Azure AI Foundry portal:
1. Go to "Models" → "Deployments"
2. Click on your deployment
3. Navigate to "Keys and Endpoint"
4. Copy "Key 1" or "Key 2"

#### 3. Configure Environment Variables

Add to your `.env.local` file or GitHub Secrets:

```bash
# Azure AI Foundry Configuration
AZURE_OPENAI_ENDPOINT=https://your-foundry.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-11-20

# TMDB API for movie metadata
TMDB_API_KEY=your-tmdb-api-key
```

### GitHub Secrets Configuration

For production deployment, add these secrets to your GitHub repository:

1. Go to: `https://github.com/JustAGhosT/movie-list-by-mood/settings/secrets/actions`
2. Add the following secrets:

   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `TMDB_API_KEY`

## TMDB API Setup

### Get Your TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Copy your API key (v3 auth)

## API Endpoints

### 1. Generate Recommendations

**Endpoint:** `POST /api/recommendations`

**Request Body:**
```json
{
  "coupleId": "couple-123",
  "watchHistory": [
    {
      "id": "1",
      "movieId": "550",
      "title": "Fight Club",
      "genres": ["Drama", "Thriller"],
      "ratings": {
        "user1": 9,
        "user2": 7
      },
      "watchedDate": "2024-01-15",
      "coupleId": "couple-123"
    }
  ],
  "preferences": {
    "user1": [
      { "genre": "Action", "rating": 5 },
      { "genre": "Comedy", "rating": 3 }
    ],
    "user2": [
      { "genre": "Romance", "rating": 5 },
      { "genre": "Drama", "rating": 4 }
    ]
  },
  "excludeWatched": true,
  "limit": 5
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "movie": {
        "id": 13,
        "title": "Forrest Gump",
        "overview": "A heartwarming story...",
        "posterPath": "https://image.tmdb.org/t/p/w500/...",
        "genres": ["Drama", "Romance"],
        "voteAverage": 8.5
      },
      "confidence": 85,
      "reasoning": "This movie combines emotional depth (for User 1) with strong character development (for User 2)...",
      "predictedRatings": {
        "user1": 8.5,
        "user2": 9.0
      },
      "compatibilityScore": 8.75
    }
  ],
  "insights": {
    "sharedTastes": ["Character-driven stories", "Emotional depth"],
    "user1Preferences": ["Plot twists", "Mind-bending narratives"],
    "user2Preferences": ["Romance subplots", "Happy endings"],
    "avoidPatterns": ["Horror movies", "Excessive violence"]
  },
  "generatedAt": "2024-12-27T21:30:00Z"
}
```

### 2. Search Movies

**Endpoint:** `GET /api/movies?q=inception`

**Response:**
```json
[
  {
    "id": 27205,
    "title": "Inception",
    "overview": "A thief who steals corporate secrets...",
    "posterPath": "https://image.tmdb.org/t/p/w500/...",
    "genres": ["Action", "Sci-Fi", "Thriller"],
    "voteAverage": 8.4,
    "releaseDate": "2010-07-16"
  }
]
```

### 3. Get Popular Movies

**Endpoint:** `GET /api/movies?popular=true&page=1`

## Data Model

### Couple Profile
```typescript
interface CoupleProfile {
  id: string
  user1Id: string
  user2Id: string
  user1Name: string
  user2Name: string
  createdAt: Date
  updatedAt: Date
}
```

### Watched Movie
```typescript
interface WatchedMovie {
  id: string
  movieId: string
  title: string
  genres: Genre[]
  ratings: {
    user1: number  // 1-10
    user2: number  // 1-10
  }
  watchedDate: Date
  coupleId: string
}
```

## Usage Example

### 1. Create Watch History
```typescript
const watchHistory = [
  {
    id: "1",
    movieId: "550",
    title: "Fight Club",
    genres: ["Drama", "Thriller"],
    ratings: { user1: 9, user2: 7 },
    watchedDate: new Date("2024-01-15"),
    coupleId: "couple-123"
  },
  {
    id: "2",
    movieId: "13",
    title: "Forrest Gump",
    genres: ["Drama", "Romance"],
    ratings: { user1: 8, user2: 10 },
    watchedDate: new Date("2024-01-20"),
    coupleId: "couple-123"
  }
]
```

### 2. Get Recommendations
```typescript
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    coupleId: 'couple-123',
    watchHistory,
    limit: 5
  })
})

const data = await response.json()
console.log(data.recommendations)
console.log(data.insights)
```

## Best Practices

### 1. Rate Enough Movies
- Minimum: 5-10 movies for accurate recommendations
- Optimal: 20+ movies for best results
- Include variety of genres for better insights

### 2. Rating Scale
- 1-3: Didn't enjoy, wouldn't watch again
- 4-6: Okay, watchable but not memorable
- 7-8: Good, would recommend
- 9-10: Excellent, loved it

### 3. Keep Ratings Updated
- Rate movies soon after watching
- Be honest about individual preferences
- Don't just rate movies you both liked

### 4. Use Insights
- Review the AI insights regularly
- Look for patterns in disagreements
- Use the compatibility scores to find compromise movies

## Troubleshooting

### Issue: "AZURE_OPENAI_ENDPOINT is not configured"
**Solution:** Add the Foundry endpoint to your environment variables

### Issue: "TMDB API error: 401"
**Solution:** Verify your TMDB API key is correct and active

### Issue: Poor recommendation quality
**Solution:** 
- Add more movies to watch history (aim for 10+ movies)
- Ensure ratings reflect true preferences
- Include variety of genres in history

### Issue: Slow response times
**Solution:**
- Consider using `o3-mini` deployment for faster responses
- Implement caching for frequent recommendations
- Reduce the limit parameter in requests

## Future Enhancements

- **Multi-person groups**: Support for groups of 3+ people
- **Mood-based filtering**: "Light and funny" vs "Deep and emotional"
- **Streaming availability**: Show where to watch recommended movies
- **Watch party scheduling**: Coordinate movie nights
- **Social sharing**: Share recommendations with friends
- **Advanced ML**: Train custom models on user data

## Support

For issues with:
- Azure Foundry: Check Azure Portal logs
- TMDB API: Visit [TMDB Support](https://www.themoviedb.org/talk)
- Application bugs: Open an issue on GitHub

## Resources

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

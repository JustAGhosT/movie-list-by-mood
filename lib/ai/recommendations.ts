import { getAzureOpenAIClient, getDeploymentName } from "./azure-openai"
import type {
  WatchedMovie,
  GenreRating,
  AIInsight,
  MovieRecommendation,
  RecommendationRequest,
  RecommendationResponse,
} from "@/types/recommendations"

/**
 * Generate AI-powered movie recommendations for a couple based on their watch history
 */
export async function generateCoupleRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const client = getAzureOpenAIClient()
  const deploymentName = getDeploymentName()

  // Build the prompt with watch history and preferences
  const prompt = buildRecommendationPrompt(request)

  try {
    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        {
          role: "system",
          content: `You are an expert movie recommendation system specializing in finding movies that couples will both enjoy. 
You analyze watch history, ratings, and preferences to identify patterns and suggest movies that match both people's tastes.
Always provide detailed reasoning for each recommendation.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from AI")
    }

    const aiResponse = JSON.parse(content)
    return parseAIResponse(aiResponse, request)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw new Error("Failed to generate recommendations")
  }
}

/**
 * Generate insights about a couple's movie preferences
 */
export async function generateCoupleInsights(
  user1Name: string,
  user2Name: string,
  watchHistory: WatchedMovie[]
): Promise<AIInsight> {
  const client = getAzureOpenAIClient()
  const deploymentName = getDeploymentName()

  const prompt = buildInsightsPrompt(user1Name, user2Name, watchHistory)

  try {
    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing movie preferences and identifying patterns in viewing habits.
Provide clear, actionable insights about what each person likes and what they enjoy together.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from AI")
    }

    const aiResponse = JSON.parse(content)
    return {
      sharedTastes: aiResponse.sharedTastes || [],
      user1Preferences: aiResponse.user1Preferences || [],
      user2Preferences: aiResponse.user2Preferences || [],
      avoidPatterns: aiResponse.avoidPatterns || [],
      generatedAt: new Date(),
    }
  } catch (error) {
    console.error("Error generating insights:", error)
    throw new Error("Failed to generate insights")
  }
}

function buildRecommendationPrompt(request: RecommendationRequest): string {
  const { watchHistory, preferences } = request

  let prompt = `Analyze the following movie watch history for a couple and recommend 5 movies they would both enjoy.\n\n`

  // Add watch history
  prompt += `## Watch History:\n\n`
  watchHistory.forEach((movie) => {
    prompt += `**${movie.title}** (${movie.genres.join(", ")})\n`
    prompt += `- User 1 Rating: ${movie.ratings.user1}/10\n`
    prompt += `- User 2 Rating: ${movie.ratings.user2}/10\n\n`
  })

  // Add preferences if available
  if (preferences) {
    prompt += `\n## Genre Preferences:\n\n`
    prompt += `### User 1:\n`
    preferences.user1.forEach((pref) => {
      prompt += `- ${pref.genre}: ${pref.rating}/5\n`
    })
    prompt += `\n### User 2:\n`
    preferences.user2.forEach((pref) => {
      prompt += `- ${pref.genre}: ${pref.rating}/5\n`
    })
  }

  prompt += `\n## Task:\n`
  prompt += `1. Identify what both users enjoy (overlapping preferences)\n`
  prompt += `2. Find patterns in their ratings\n`
  prompt += `3. Recommend 5 movies that both would rate 7+ out of 10\n`
  prompt += `4. For each movie, explain WHY it would work for both\n`
  prompt += `5. Predict individual ratings for each person\n\n`

  prompt += `Return your response as JSON with this structure:\n`
  prompt += `{
  "insights": {
    "sharedTastes": ["string array of shared preferences"],
    "user1Preferences": ["string array of user 1 unique preferences"],
    "user2Preferences": ["string array of user 2 unique preferences"],
    "avoidPatterns": ["string array of what to avoid"]
  },
  "recommendations": [
    {
      "title": "Movie Title",
      "genres": ["Genre1", "Genre2"],
      "reasoning": "Detailed explanation of why both would enjoy it",
      "predictedRatingUser1": 8.5,
      "predictedRatingUser2": 8.0,
      "confidence": 85
    }
  ]
}`

  return prompt
}

function buildInsightsPrompt(
  user1Name: string,
  user2Name: string,
  watchHistory: WatchedMovie[]
): string {
  let prompt = `Analyze the movie preferences of ${user1Name} and ${user2Name} based on their watch history.\n\n`

  watchHistory.forEach((movie) => {
    prompt += `**${movie.title}**\n`
    prompt += `- ${user1Name}: ${movie.ratings.user1}/10\n`
    prompt += `- ${user2Name}: ${movie.ratings.user2}/10\n\n`
  })

  prompt += `\nProvide insights in this JSON format:\n`
  prompt += `{
  "sharedTastes": ["Things both enjoy"],
  "user1Preferences": ["${user1Name}'s unique preferences"],
  "user2Preferences": ["${user2Name}'s unique preferences"],
  "avoidPatterns": ["What to avoid based on low ratings"]
}`

  return prompt
}

function parseAIResponse(
  aiResponse: any,
  request: RecommendationRequest
): RecommendationResponse {
  const recommendations: MovieRecommendation[] = (
    aiResponse.recommendations || []
  ).map((rec: any) => ({
    movie: {
      id: 0, // Will be filled from TMDB
      title: rec.title,
      overview: rec.reasoning,
      posterPath: null,
      backdropPath: null,
      releaseDate: "",
      voteAverage: 0,
      genres: rec.genres || [],
    },
    confidence: rec.confidence || 70,
    reasoning: rec.reasoning || "",
    predictedRatings: {
      user1: rec.predictedRatingUser1 || 7,
      user2: rec.predictedRatingUser2 || 7,
    },
    compatibilityScore:
      ((rec.predictedRatingUser1 || 7) + (rec.predictedRatingUser2 || 7)) / 2,
  }))

  const insights: AIInsight = {
    sharedTastes: aiResponse.insights?.sharedTastes || [],
    user1Preferences: aiResponse.insights?.user1Preferences || [],
    user2Preferences: aiResponse.insights?.user2Preferences || [],
    avoidPatterns: aiResponse.insights?.avoidPatterns || [],
    generatedAt: new Date(),
  }

  return {
    recommendations,
    insights,
    generatedAt: new Date(),
  }
}

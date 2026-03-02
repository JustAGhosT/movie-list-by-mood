import { CosmosClient, Database, Container } from "@azure/cosmos"

// Cosmos DB configuration
const endpoint = process.env.AZURE_COSMOS_ENDPOINT!
const key = process.env.AZURE_COSMOS_KEY!
const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "MovieListDB"

let client: CosmosClient | null = null
let database: Database | null = null

/**
 * Get or create Cosmos DB client
 */
export function getCosmosClient(): CosmosClient {
  if (!endpoint || !key) {
    throw new Error("Azure Cosmos DB credentials not configured. Set AZURE_COSMOS_ENDPOINT and AZURE_COSMOS_KEY environment variables.")
  }

  if (!client) {
    client = new CosmosClient({ endpoint, key })
  }
  
  return client
}

/**
 * Get or create database
 */
export async function getDatabase(): Promise<Database> {
  if (!database) {
    const client = getCosmosClient()
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseId,
    })
    database = db
  }
  
  return database
}

/**
 * Get or create container
 */
export async function getContainer(containerId: string, partitionKey: string = "/id"): Promise<Container> {
  const db = await getDatabase()
  
  const { container } = await db.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: [partitionKey] },
  })
  
  return container
}

/**
 * Container IDs
 */
export const CONTAINERS = {
  MOVIES: "movies",
  USER_MOVIES: "user_movies", 
  COUPLES: "couples",
  WATCHED_MOVIES: "watched_movies",
  GENRE_PREFERENCES: "genre_preferences",
} as const

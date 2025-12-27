import { AzureOpenAI } from "openai"

// Initialize Azure OpenAI client for Foundry
export function getAzureOpenAIClient() {
  if (!process.env.AZURE_OPENAI_ENDPOINT) {
    throw new Error("AZURE_OPENAI_ENDPOINT is not configured")
  }
  if (!process.env.AZURE_OPENAI_API_KEY) {
    throw new Error("AZURE_OPENAI_API_KEY is not configured")
  }

  return new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-11-20",
  })
}

// Get the deployment name from environment
export function getDeploymentName() {
  return process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"
}

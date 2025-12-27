# Required GitHub Secrets Configuration (Azure Cosmos DB)

The app now uses Azure Cosmos DB for data storage and Azure Static Web Apps built-in authentication.

## How to Add Secrets

1. Go to: `https://github.com/JustAGhosT/movie-list-by-mood/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret below

## Required Secrets (8 total)

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN

**Source:** Azure Portal - automatically generated when you create the Static Web App

**How to get it:**
- If you created the Static Web App via Azure Portal → GitHub integration, this is automatically added
- If not, go to Azure Portal → Your Static Web App → "Manage deployment token" → Copy the token

**Format:** Long alphanumeric string

---

### 2. AZURE_COSMOS_ENDPOINT

**Source:** Azure Cosmos DB account

**How to get it:**
1. Go to Azure Portal
2. Navigate to your Cosmos DB account (or create one in `nl-dev-movienametbd-rg-san`)
3. Go to "Keys" section
4. Copy the "URI" field

**Format:** `https://[your-account].documents.azure.com:443/`

**Example:** `https://my-cosmos-db.documents.azure.com:443/`

---

### 3. AZURE_COSMOS_KEY

**Source:** Azure Cosmos DB account

**How to get it:**
1. Go to Azure Portal
2. Navigate to your Cosmos DB account
3. Go to "Keys" section
4. Copy the "PRIMARY KEY" or "SECONDARY KEY"

**Format:** Long base64 encoded string

**Note:** Keep this secret - it provides full access to your database

---

### 4. AZURE_COSMOS_DATABASE_ID (Optional)

**Source:** Your choice

**Default:** `MovieListDB`

**Format:** Database name (alphanumeric, no spaces)

**Note:** The database will be created automatically if it doesn't exist

---

### 5. AZURE_OPENAI_ENDPOINT

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Select your deployment (e.g., `gpt-4o`)
4. Copy the endpoint URL

**Format:** `https://[your-foundry].openai.azure.com/`

---

### 6. AZURE_OPENAI_API_KEY

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Click on your deployment
4. Go to "Keys and Endpoint" section
5. Copy "Key 1" or "Key 2"

**Format:** Long alphanumeric string

---

### 7. AZURE_OPENAI_DEPLOYMENT_NAME

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Copy the deployment name from the list

**Format:** Model deployment name

**Example:** `gpt-4o` or `gpt-4.1`

**Available options:** `gpt-4o`, `gpt-4.1`, `o3`, `o3-mini`, `o4-mini`, `gpt-4o-mini`

---

### 8. TMDB_API_KEY

**Source:** The Movie Database (TMDB) API

**How to get it:**
1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Fill in the application form
5. Copy your API key (v3 auth)

**Format:** 32-character hexadecimal string

---

## Azure Cosmos DB Setup

### Create Cosmos DB Account

1. Go to Azure Portal → Resource group: `nl-dev-movienametbd-rg-san`
2. Click "+ Create" → Search for "Azure Cosmos DB"
3. Select "Azure Cosmos DB for NoSQL"
4. Configure:
   - **Account name**: `movielist-cosmos-db` (or your choice)
   - **API**: Core (SQL)
   - **Location**: Same as your resource group (North Europe recommended)
   - **Capacity mode**: Serverless (cheapest for small apps) or Provisioned (predictable performance)
   - **Free tier**: Apply if available (first 1000 RU/s and 25 GB free)
5. Click "Review + create" → "Create"

### Database Schema

The app will automatically create:
- **Database**: `MovieListDB`
- **Containers**:
  - `movies` - 240 movies organized by mood
  - `user_movies` - User watch history, ratings, comments
  - `couples` - Couple profiles
  - `watched_movies` - Couple watch history
  - `genre_preferences` - Genre preferences per user

Containers are created on first use with appropriate partition keys.

---

## Benefits of Azure Cosmos DB

✅ **Uses your Azure credits**  
✅ **Global distribution** - Low latency worldwide  
✅ **Serverless option** - Pay only for what you use  
✅ **99.999% availability** SLA  
✅ **Automatic scaling**  
✅ **Multi-device sync** - Data accessible everywhere  
✅ **Professional solution** - Production-ready database

---

## Cost Estimate (with Azure Credits)

**Serverless mode (recommended for <10 users):**
- First 1000 RU/s and 25 GB: **Free** (if you have Free Tier)
- Beyond that: ~$0.25 per million RU operations
- Storage: $0.25/GB/month
- **Estimated monthly cost for 2-3 users: $0-5** (using your Azure credits)

**Provisioned throughput:**
- 400 RU/s minimum: ~$24/month
- Better for consistent high usage

---

## Authentication

Uses Azure Static Web Apps built-in authentication:
- Free, secure, supports GitHub/Google/Twitter/Azure AD
- No additional configuration needed
- Login: `/.auth/login/github`
- Logout: `/.auth/logout`

---

## Testing Locally

To test locally without GitHub Actions:

1. Create a `.env.local` file in the project root (this is gitignored)
2. Add the environment variables:

```bash
AZURE_COSMOS_ENDPOINT=your-cosmos-endpoint
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE_ID=MovieListDB
AZURE_OPENAI_ENDPOINT=your-foundry-endpoint
AZURE_OPENAI_API_KEY=your-foundry-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
TMDB_API_KEY=your-tmdb-api-key
```

3. Run `pnpm dev` to start the development server

# Required GitHub Secrets Configuration (Updated - No Supabase!)

The app now uses Azure Static Web Apps built-in authentication and local storage. Supabase has been removed!

## How to Add Secrets

1. Go to: `https://github.com/JustAGhosT/movie-list-by-mood/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret below

## Required Secrets (5 total - Down from 8!)

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN

**Source:** Azure Portal - automatically generated when you create the Static Web App

**How to get it:**
- If you created the Static Web App via Azure Portal → GitHub integration, this is automatically added
- If not, go to Azure Portal → Your Static Web App → "Manage deployment token" → Copy the token

**Format:** Long alphanumeric string (e.g., `abc123def456...`)

---

### 2. AZURE_OPENAI_ENDPOINT

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Select your deployment (e.g., `gpt-4o`)
4. Copy the endpoint URL

**Format:** `https://[your-foundry].openai.azure.com/`

---

### 3. AZURE_OPENAI_API_KEY

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Click on your deployment
4. Go to "Keys and Endpoint" section
5. Copy "Key 1" or "Key 2"

**Format:** Long alphanumeric string (32+ characters)

---

### 4. AZURE_OPENAI_DEPLOYMENT_NAME

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Copy the deployment name from the list

**Format:** Model deployment name

**Example:** `gpt-4o` or `gpt-4.1`

**Available options:** `gpt-4o`, `gpt-4.1`, `o3`, `o3-mini`, `o4-mini`, `gpt-4o-mini`

---

### 5. TMDB_API_KEY

**Source:** The Movie Database (TMDB) API

**How to get it:**
1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Fill in the application form
5. Copy your API key (v3 auth)

**Format:** 32-character hexadecimal string

---

## What Changed?

### ❌ Removed (No Longer Needed):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase database removed
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase auth removed
- `AZURE_OPENAI_API_VERSION` - Optional, uses default now

### ✅ Authentication Now Uses:
**Azure Static Web Apps Built-in Authentication**
- Free, secure, supports GitHub/Google/Twitter/Azure AD
- No configuration needed (works automatically)

### ✅ Data Storage Now Uses:
**Browser LocalStorage**
- Keeps data on the device
- Perfect for 2-3 users
- No database costs
- Privacy-friendly (data never leaves the device)

---

## Benefits of Removing Supabase

✅ **Simpler** - No database setup required  
✅ **Cheaper** - $0 monthly cost  
✅ **Faster** - Everything loads from CDN  
✅ **More Private** - Data stays on user's device  
✅ **Fewer Secrets** - 5 secrets instead of 8  
✅ **Production Ready** - Works immediately after deployment

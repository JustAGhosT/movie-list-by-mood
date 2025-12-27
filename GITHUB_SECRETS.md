# Required GitHub Secrets Configuration

Before the Azure Static Web Apps deployment can work, you need to configure the following secrets in your GitHub repository.

## How to Add Secrets

1. Go to: `https://github.com/JustAGhosT/movie-list-by-mood/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret below

## Required Secrets

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN

**Source:** Azure Portal - automatically generated when you create the Static Web App

**How to get it:**
- If you created the Static Web App via Azure Portal → GitHub integration, this is automatically added
- If not, go to Azure Portal → Your Static Web App → "Manage deployment token" → Copy the token

**Format:** Long alphanumeric string (e.g., `abc123def456...`)

---

### 2. NEXT_PUBLIC_SUPABASE_URL

**Source:** Supabase project dashboard

**How to get it:**
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Go to "API" section
4. Copy the "Project URL"

**Format:** `https://[project-id].supabase.co`

**Example:** `https://xyzabc123def.supabase.co`

---

### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Source:** Supabase project dashboard

**How to get it:**
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Go to "API" section
4. Copy the "anon" / "public" key (under "Project API keys")

**Format:** Long JWT token starting with `eyJ...`

**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 4. AZURE_OPENAI_ENDPOINT

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Select your deployment (e.g., `gpt-4o`)
4. Copy the endpoint URL

**Format:** `https://[your-foundry].openai.azure.com/`

**Example:** `https://my-foundry-instance.openai.azure.com/`

---

### 5. AZURE_OPENAI_API_KEY

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Click on your deployment
4. Go to "Keys and Endpoint" section
5. Copy "Key 1" or "Key 2"

**Format:** Long alphanumeric string (32+ characters)

**Example:** `a1b2c3d4e5f6g7h8i9j0...`

---

### 6. AZURE_OPENAI_DEPLOYMENT_NAME

**Source:** Azure AI Foundry portal

**How to get it:**
1. Go to Azure AI Foundry: `mys-shared-ai-san-project`
2. Navigate to "Models" → "Deployments"
3. Copy the deployment name from the list

**Format:** Model deployment name

**Example:** `gpt-4o` or `gpt-4.1`

**Available options:** `gpt-4o`, `gpt-4.1`, `o3`, `o3-mini`, `o4-mini`, `gpt-4o-mini`

---

### 7. AZURE_OPENAI_API_VERSION (Optional)

**Source:** Azure OpenAI API documentation

**Default value:** `2024-11-20`

**Format:** Date string (YYYY-MM-DD)

**Note:** Only change if Azure recommends a different API version

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

**Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## Verification

After adding all secrets:

1. Go to the "Actions" tab in your repository
2. The workflow should automatically run on the next push to `main`
3. Check the workflow logs to ensure the secrets are being used correctly
4. If you see errors about missing environment variables, double-check the secret names match exactly

## Security Notes

- Never commit these secrets to your repository
- The `.env.example` file is for reference only - actual values should only be in GitHub Secrets
- The `NEXT_PUBLIC_` prefix means these values will be included in the client-side bundle
- Keep your Supabase keys secure and rotate them if compromised

## Testing Locally

To test locally without GitHub Actions:

1. Create a `.env.local` file in the project root (this is gitignored)
2. Add the environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run `pnpm dev` to start the development server
4. The app will automatically use these environment variables

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

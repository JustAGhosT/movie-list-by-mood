# Azure Static Web Apps Deployment Guide

## Prerequisites

1. Azure account with active subscription
2. Azure CLI installed (optional, for command-line deployment)
3. GitHub repository access

## Setup Instructions

### Step 1: Create Azure Static Web App

Using Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to the resource group: `nl-dev-movienametbd-rg-san`
3. Click "Create" → Search for "Static Web App"
4. Configure the Static Web App:
   - **Basics:**
     - Subscription: Your Azure subscription
     - Resource Group: `nl-dev-movienametbd-rg-san`
     - Name: `movie-list-by-mood` (or your preferred name)
     - Plan type: Free (or Standard for production)
     - Region: North Europe (or your preferred region)
   - **Deployment:**
     - Source: GitHub
     - Organization: JustAGhosT
     - Repository: movie-list-by-mood
     - Branch: main
   - **Build Details:**
     - Build Presets: Custom
     - App location: `/`
     - Api location: `` (leave empty)
     - Output location: `.next`

5. Click "Review + create" then "Create"

### Step 2: Configure GitHub Secrets

The Azure Static Web Apps creation process automatically adds the deployment token to your GitHub repository secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`.

You also need to add the following secrets manually:

1. Go to your GitHub repository: `https://github.com/JustAGhosT/movie-list-by-mood`
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret" and add:

   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase project URL (from Supabase dashboard)

   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anonymous key (from Supabase dashboard)

### Step 3: Configure Supabase

Ensure your Supabase project allows the Azure Static Web App domain:

1. Go to your Supabase project dashboard
2. Navigate to Authentication → URL Configuration
3. Add your Azure Static Web App URL to the allowed redirect URLs:
   - Format: `https://<your-app-name>.azurestaticapps.net/**`
   - Example: `https://movie-list-by-mood.azurestaticapps.net/**`

### Step 4: Deploy

The deployment will automatically trigger when you:

1. Push to the `main` branch
2. Create or update a pull request to `main`

Monitor the deployment:

1. Go to the GitHub repository
2. Click on "Actions" tab
3. View the "Azure Static Web Apps CI/CD" workflow runs

### Step 5: Verify Deployment

1. Once deployment completes, find your app URL:
   - Azure Portal → Static Web App → Overview → URL
   - Format: `https://<your-app-name>.azurestaticapps.net`

2. Test the application:
   - Visit the URL
   - Try signing up / logging in
   - Verify all features work correctly

## Troubleshooting

### Build Fails

- Check the GitHub Actions logs for errors
- Verify all secrets are correctly configured
- Ensure `pnpm-lock.yaml` is committed to the repository

### Authentication Issues

- Verify Supabase URL configuration
- Check that the Azure app URL is in Supabase allowed redirects
- Confirm environment variables are set correctly in GitHub secrets

### 404 Errors

- Verify the `staticwebapp.config.json` is in the root directory
- Check that routing fallback is configured correctly
- Ensure the build output location is set to `.next`

## Manual Deployment (Alternative)

If you prefer to deploy without GitHub Actions:

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the application
pnpm build

# Deploy using SWA CLI
swa deploy .next --deployment-token <your-deployment-token>
```

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Next.js on Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid)
- [Supabase Authentication Guide](https://supabase.com/docs/guides/auth)

## Support

For issues specific to:
- Azure deployment: Check Azure Portal logs and GitHub Actions output
- Application features: Review application logs in browser console
- Supabase: Check Supabase dashboard logs

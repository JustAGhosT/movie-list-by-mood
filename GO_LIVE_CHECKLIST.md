# Go Live Checklist - Movie List by Mood for Couples

## Overview
This checklist covers everything needed to deploy the app for your mom and her fiance to use.

## ✅ Phase 1: Azure Infrastructure Setup

### 1. Create Azure Static Web App
- [ ] Log into Azure Portal
- [ ] Navigate to resource group: `nl-dev-movienametbd-rg-san`
- [ ] Create new Static Web App resource
  - Name: `movie-list-by-mood` (or your choice)
  - Region: North Europe
  - Plan: Free (sufficient for 2 users)
  - Link to GitHub repository
  - Branch: `main`
  - Build preset: Custom
  - App location: `/`
  - Output location: `.next`

### 2. Configure GitHub Secrets
Go to: `https://github.com/JustAGhosT/movie-list-by-mood/settings/secrets/actions`

Add these secrets:
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` (auto-added by Azure)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (from Supabase project)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase project)
- [ ] `AZURE_OPENAI_ENDPOINT` (from Foundry: mys-shared-ai-san-project)
- [ ] `AZURE_OPENAI_API_KEY` (from Foundry)
- [ ] `AZURE_OPENAI_DEPLOYMENT_NAME` (e.g., `gpt-4o`)
- [ ] `AZURE_OPENAI_API_VERSION` (use `2024-11-20`)
- [ ] `TMDB_API_KEY` (from themoviedb.org)

## ✅ Phase 2: Supabase Database Setup

### 1. Run Database Migration
- [ ] Go to your Supabase project dashboard
- [ ] Navigate to SQL Editor
- [ ] Create a new query
- [ ] Copy the contents of `supabase/migrations/001_create_couples_schema.sql`
- [ ] Run the migration
- [ ] Verify all tables were created:
  - `couples`
  - `watched_movies`
  - `genre_preferences`
  - `ai_insights`

### 2. Configure Supabase Auth
- [ ] Go to Authentication → URL Configuration
- [ ] Add your Azure Static Web App URL to allowed redirect URLs
  - Format: `https://<your-app-name>.azurestaticapps.net/**`
- [ ] Configure email templates (optional)
- [ ] Set up email provider (for sign-up/login)

### 3. Create User Accounts
- [ ] Sign up your mom's account
- [ ] Sign up her fiance's account
- [ ] Note down both user IDs (from Supabase Authentication dashboard)

## ✅ Phase 3: Get TMDB API Key

### 1. Create TMDB Account
- [ ] Go to https://www.themoviedb.org/
- [ ] Sign up for a free account
- [ ] Verify your email

### 2. Request API Key
- [ ] Go to Settings → API
- [ ] Click "Request an API Key"
- [ ] Choose "Developer" option
- [ ] Fill in the application details:
  - **Application Name**: Movie List by Mood
  - **Application URL**: Your Azure Static Web App URL
  - **Application Summary**: Personal movie recommendation app for couples
- [ ] Accept the terms
- [ ] Copy your API key (v3 auth)

## ✅ Phase 4: Deploy Application

### 1. Merge to Main Branch
- [ ] Merge this PR to `main` branch
- [ ] GitHub Actions will automatically trigger deployment
- [ ] Monitor the "Actions" tab for deployment progress

### 2. Verify Deployment
- [ ] Go to Azure Portal → Your Static Web App
- [ ] Copy the URL (e.g., `https://movie-list-by-mood.azurestaticapps.net`)
- [ ] Visit the URL and verify the app loads
- [ ] Test the sign-up/login flow

## ✅ Phase 5: Initial Setup & Testing

### 1. Create Couple Profile
- [ ] Have your mom log in
- [ ] Navigate to couple setup page
- [ ] Enter her fiance's email to link accounts
- [ ] Her fiance logs in and accepts the invitation

### 2. Add First Movies
- [ ] Add 5-10 movies they've both watched
- [ ] Have each person rate them (1-10)
- [ ] Test the search functionality
- [ ] Verify ratings are saved

### 3. Set Genre Preferences
- [ ] Each person rates their genre preferences (1-5 stars)
- [ ] Save preferences
- [ ] Verify they're stored correctly

### 4. Test AI Recommendations
- [ ] Click "Get Recommendations" button
- [ ] Verify AI generates suggestions
- [ ] Check that reasoning makes sense
- [ ] Verify movie posters and details load

## ✅ Phase 6: User Training & Documentation

### 1. Create Simple User Guide
- [ ] Write a 1-page guide for your mom
- [ ] Include:
  - How to log in
  - How to add a movie
  - How to rate movies
  - How to see recommendations
  - How to use "Tonight's Pick"

### 2. Share Access
- [ ] Send your mom the app URL
- [ ] Send login credentials
- [ ] Walk through the app together (video call or in-person)
- [ ] Make sure both she and her fiance can use it

## ✅ Phase 7: Monitoring & Support

### 1. Monitor Usage
- [ ] Check Azure Application Insights (if enabled)
- [ ] Monitor API usage in Foundry
- [ ] Check TMDB API usage (free tier: 500 requests/day)

### 2. Set Up Basic Support
- [ ] Create a simple feedback mechanism
- [ ] Share your contact info for issues
- [ ] Plan for weekly check-ins initially

## 🎯 Success Criteria

The app is ready to go live when:
- [ ] Both users can sign up and log in
- [ ] Users can add and rate movies
- [ ] AI recommendations work and are relevant
- [ ] Movie posters and details display correctly
- [ ] The app is responsive on their devices (phone/tablet/desktop)
- [ ] No errors in browser console
- [ ] Both users understand how to use the app

## 🚀 Quick Start Commands

### For Local Testing:
```bash
# 1. Clone and install
git clone https://github.com/JustAGhosT/movie-list-by-mood
cd movie-list-by-mood
pnpm install

# 2. Create .env.local with all secrets
cp .env.example .env.local
# Edit .env.local with your actual values

# 3. Run locally
pnpm dev

# 4. Open http://localhost:3000
```

### For Production Deployment:
```bash
# 1. Ensure all GitHub secrets are configured
# 2. Merge PR to main
# 3. GitHub Actions will auto-deploy
# 4. Visit your Azure Static Web App URL
```

## 📞 Support Contacts

**Azure Issues:**
- Azure Portal: https://portal.azure.com
- Azure Support: Through Azure Portal

**Supabase Issues:**
- Dashboard: https://app.supabase.com
- Support: support@supabase.io

**TMDB Issues:**
- Dashboard: https://www.themoviedb.org/settings/api
- Forum: https://www.themoviedb.org/talk

**AI Foundry Issues:**
- Portal: Azure AI Foundry
- Your project: `mys-shared-ai-san-project`

## 💡 Pro Tips

1. **Start Small**: Add 5-10 movies first, test recommendations, then add more
2. **Be Honest**: Ratings work best when genuine - don't just rate what you think the other person wants
3. **Explore Genres**: Try rating all genre preferences for better recommendations
4. **Regular Updates**: Add new movies after watching them
5. **Trust the AI**: The AI learns from your patterns - the more data, the better recommendations

## 🐛 Common Issues & Fixes

### Issue: "Can't log in"
**Fix**: Check Supabase is configured with correct redirect URLs

### Issue: "No movie recommendations"
**Fix**: Ensure you have at least 5 rated movies in watch history

### Issue: "Movie posters not loading"
**Fix**: Verify TMDB_API_KEY is correctly configured

### Issue: "AI recommendations seem off"
**Fix**: Add more diverse movies to watch history; rate honestly

## 📅 Timeline Estimate

- **Azure Setup**: 30 minutes
- **Supabase Setup**: 30 minutes
- **TMDB API Key**: 15 minutes
- **Initial Deployment**: 15 minutes (automated)
- **Testing**: 30 minutes
- **User Training**: 30 minutes

**Total**: ~2.5 hours to go live

---

## Ready to Launch? 🚀

Once all checkboxes are checked, you're ready to go live!

**Remember**: This is a private app for 2 users. The Free tier of all services should be more than sufficient.

**Next Steps After Launch**:
1. Monitor usage for the first week
2. Gather feedback from users
3. Iterate on features based on their needs
4. Consider adding more features like:
   - Streaming service availability
   - Watch party scheduling
   - Movie night reminders
   - Shared watchlist

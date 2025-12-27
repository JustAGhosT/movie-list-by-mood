# Fliek Kyklys - Movie List by Mood

A Next.js application for organizing movies by mood, deployed on Azure Static Web Apps.

[![Deployed on Azure](https://img.shields.io/badge/Deployed%20on-Azure%20Static%20Web%20Apps-blue?style=for-the-badge&logo=microsoft-azure)](https://azure.microsoft.com/services/app-service/static/)

## Overview

This application helps users discover and track movies organized by different moods. With 240 films categorized across 12 different moods, users can easily find the perfect movie for any occasion.

## Features

- **Track Watched Movies**: Mark films as watched and maintain a complete viewing history
- **Rate Movies**: Give up to 5 stars and remember your favorites
- **Add Comments**: Write your thoughts and share your opinions about each film
- **12 Different Moods**: From light and cheerful to action and drama - there's a mood for every day
- **User-Friendly Design**: Designed with large buttons and clear text for easy use

## Azure Deployment

### Resource Group
- **Name**: `nl-dev-movienametbd-rg-san`
- **Region**: North Europe

### CI/CD Pipeline

This project uses GitHub Actions for continuous deployment to Azure Static Web Apps. The workflow automatically:

1. Builds the Next.js application on every push to `main`
2. Runs build validation on pull requests
3. Deploys to Azure Static Web Apps using static export
4. Creates preview environments for pull requests

### Required Secrets

Configure the following secrets in your GitHub repository:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Azure Static Web Apps deployment token
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint
```

## Technology Stack

- **Framework**: Next.js 16
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Contributing

This project is automatically synced with deployments. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

# bored.fish

A full-stack movie/TV show discovery and recommendation app with AI-powered chat.

## Features

- **Discover**: Search TMDB or browse upcoming movies/TV shows
- **Watchlist & Archive**: Organize media with like/dislike ratings
- **AI Chat**: Context-aware recommendations based on your preferences
- **Authentication**: Email/password via Better Auth

## Tech Stack

Express • Prisma • Better Auth • Vercel AI SDK • Vite • React

## Quick Start

```sh
# Install dependencies
fnm use && npm install

# Setup environment
cp .env.example .env
# Fill in: BETTER_AUTH_SECRET, TMDB_ACCESS_TOKEN, OPENAI_API_KEY

# Start local PostgreSQL
docker compose up -d

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Seed the database with sample data
npx prisma db seed

# Start dev server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── client/          # React frontend (pages, components, hooks)
├── server/          # Express backend (routes, services, middleware)
│   └── prisma/      # Database schema & migrations
└── shared/          # Shared Zod schemas
```

## Environment Variables

```sh
DATABASE_PROVIDER=postgres                    # or prisma-accelerate
PRISMA_DATABASE_URL=postgresql://...          # DB connection string
BETTER_AUTH_SECRET=                           # npx @better-auth/cli@latest secret
TMDB_ACCESS_TOKEN=                            # TMDB API v4 token
OPENAI_API_KEY=                               # OpenAI API key
DISABLE_SIGNUP=true                           # Optional: disable registration
```

## Scripts

```sh
npm run dev              # Dev server with hot reload
npm run build            # Build frontend
npm start                # Production server
npm test                 # Run tests
npm run lint:fix         # Lint and fix
npx prisma studio        # Database GUI
```

## Deployment

### Vercel

1. Connect repo to Vercel
2. Set environment variables (use `DATABASE_PROVIDER=prisma-accelerate`)
3. Deploy

### Traditional Hosting (Railway, Render, etc.)

```sh
npm run build
npm start
```

Set `NODE_ENV=production` and ensure PostgreSQL is accessible.

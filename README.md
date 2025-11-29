# bored.fish

bored.fish is a full-stack application designed to help users manage movie/TV show watchlists and engage in AI-powered conversations about media. It leverages the TMDB API for media data and OpenAI for intelligent chat capabilities.

## Repository Structure

```
boredfish/
├── src/
│   ├── client/        # React frontend (Vite + Tailwind)
│   └── server/        # Express backend
│       ├── routes/    # API routes
│       ├── middleware/# Express middleware
│       ├── services/  # Business logic
│       ├── lib/       # Utilities
│       ├── prisma/    # Database schema and migrations
│       └── main.ts    # Server entry point
├── public/            # Static assets
├── index.html         # HTML entry point
└── package.json       # Dependencies
```

This is a unified monorepo with both frontend and backend in a single `src/` directory.

## Features

- **User Authentication**: Secure authentication managed by [Better Auth](https://better-auth.com).
- **Watchlist Management**: Add, remove, and view movies and TV shows in your personal watchlist.
- **AI Chat**: Chat interface powered by the Vercel AI SDK and OpenAI to discuss movies and get recommendations.
- **Media Data**: Integration with The Movie Database (TMDB) for rich media information.

## Tech Stack

### Backend (Root)

- **Runtime**: [Node.js](https://nodejs.org/) 22+
- **Framework**: [Express](https://expressjs.com/) with [vite-express](https://github.com/szymmis/vite-express)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **External APIs**: TMDB, OpenAI

### Frontend (`src/client/`)

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Routing**: [React Router](https://reactrouter.com/)

## Installation

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd boredfish
    ```

2.  **Install dependencies:**

    ```sh
    fnm use
    npm install
    ```

3.  **Configure Environment Variables:**

    Copy the example environment file and fill in the required values.

    ```sh
    cp .env.example .env
    ```

    You will need to provide keys for:
    - `PRISMA_DATABASE_URL` (Prisma accelerate connection string)
    - `BETTER_AUTH_SECRET`
    - `TMDB_ACCESS_TOKEN`
    - `OPENAI_API_KEY` (for chat features)

4.  **Database Setup:**

    Ensure PostgreSQL is running, then generate the Prisma client and run migrations.

    ```sh
    npx @better-auth/cli@latest secret # Generate auth secret if needed
    npx prisma generate
    npx prisma migrate deploy
    npx prisma db seed
    ```

## Running the Application

### Development Mode

Start the development server:

```sh
npm run dev
```

This will start both the backend and frontend on `http://localhost:3000` with Hot Module Replacement (HMR) enabled for instant feedback on frontend changes.

### Production Mode

Build and start the production server:

```sh
npm run build
npm start
```

The build command compiles the frontend to `dist/` for production serving.

## Running Tests

To run the backend test suite:

```sh
npm test
```

## Linting and Formatting

```sh
# Lint server code
npm run lint

# Format all files
npm run prettier
```

## Deployment

The application uses `vite-express` to serve both the API and frontend on a single port.

### Vercel

The project includes a `vercel.json` configuration for seamless Vercel deployment:

1. Connect your repository to Vercel
2. Configure environment variables in the Vercel dashboard:
   - `PRISMA_DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `TMDB_ACCESS_TOKEN`
   - `OPENAI_API_KEY`
3. Deploy

Vercel will automatically:

- Build the frontend with Vite
- Deploy the backend as a serverless function
- Route API requests to `/api/*` and serve the frontend for all other routes

### Other Platforms

For traditional Node.js hosting (Railway, Render, Fly.io, etc.):

1. Set environment variables
2. Run `npm run build` during the build phase
3. Set `NODE_ENV=production` and run `npm start`
4. The server will run on port 3000 (or `PORT` environment variable)

# bored.fish

bored.fish is a full-stack application designed to help users manage movie/TV show watchlists and engage in AI-powered conversations about media. It leverages the TMDB API for media data and OpenAI for intelligent chat capabilities.

## Repository Structure

```
boredfish/
├── app/            # React frontend (Vite + Tailwind)
├── routes/         # Express API routes
├── middleware/     # Express middleware
├── services/       # Business logic
├── prisma/         # Database schema and migrations
├── server.ts       # Server entry point
└── package.json    # Server dependencies
```

The server is the main application at the root, with the frontend in the `app/` subdirectory.

## Features

- **User Authentication**: Secure authentication managed by [Better Auth](https://better-auth.com).
- **Watchlist Management**: Add, remove, and view movies and TV shows in your personal watchlist.
- **AI Chat**: Chat interface powered by the Vercel AI SDK and OpenAI to discuss movies and get recommendations.
- **Media Data**: Integration with The Movie Database (TMDB) for rich media information.

## Tech Stack

### Backend (Root)

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: Postgres (via [Prisma ORM](https://www.prisma.io/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **External APIs**: TMDB, OpenAI

### Frontend (`app/`)

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

2.  **Install server dependencies:**

    ```sh
    fnm use
    npm install
    ```

3.  **Install frontend dependencies:**

    ```sh
    cd app
    npm install
    cd ..
    ```

4.  **Configure Environment Variables:**

    Copy the example environment file and fill in the required values.

    ```sh
    cp .env.example .env
    ```

    You will need to provide keys for:
    - `DATABASE_URL` (defaults to `file:./dev.db`)
    - `BETTER_AUTH_SECRET`
    - `TMDB_ACCESS_TOKEN`
    - `OPENAI_API_KEY` (for chat features)

5.  **Database Setup:**

    Generate the Prisma client, push the schema to the database, and seed it.

    ```sh
    npx @better-auth/cli@latest secret # Generate auth secret if needed
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    ```

## Running the Application

### Development Mode

Start the server and app in separate terminals:

```sh
# Start the backend server
npm start

# Start the frontend dev server
npm run start:app
```

This will start:

- Backend server on `http://localhost:3000`
- Frontend dev server on `http://localhost:8080`

### Production Build

Build the frontend for production:

```sh
npm run build:app
```

The built files will be in `app/dist`.

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
npm run format
```

## Deployment

The application is configured to run on a single port in production.

### Production Build

1. Build the frontend:

   ```sh
   npm run build:app
   ```

   This creates optimized static files in `app/dist`.

2. Start the production server:
   ```sh
   npm run start:prod
   ```
   The server will:
   - Serve the API on `/api/*` routes
   - Serve the built React app for all other routes
   - Run on port 3000

### Deployment Options

- Deploy the entire repository to your Node.js hosting provider (Railway, Render, Fly.io, etc.)
- Run `npm run build:app` during the build phase
- Run `npm run start:prod` to start the server
- The server handles both API and frontend on the same port

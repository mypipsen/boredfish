# bored.fish

bored.fish is a node.js backend application designed to help users manage movie/TV show watchlists and engage in AI-powered conversations about media. It leverages the TMDB API for media data and OpenAI for intelligent chat capabilities.

## Features

- **User Authentication**: Secure authentication managed by [Better Auth](https://better-auth.com).
- **Watchlist Management**: Add, remove, and view movies and TV shows in your personal watchlist.
- **AI Chat**: Chat interface powered by the Vercel AI SDK and OpenAI to discuss movies and get recommendations.
- **Media Data**: Integration with The Movie Database (TMDB) for rich media information.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **External APIs**: TMDB, OpenAI

## Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd boredfish
    ```

2.  **Install dependencies:**
    ```sh
    fnm use
    npm ci
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file and fill in the required values.
    ```sh
    cp .env.example .env
    ```
    You will need to provide keys for:
    - `DATABASE_URL` (defaults to local sqlite file)
    - `BETTER_AUTH_SECRET`
    - `TMDB_API_KEY` (if applicable)
    - `OPENAI_API_KEY` (for chat features)

4.  **Database Setup:**
    Generate the Prisma client, push the schema to the database, and seed it.
    ```sh
    npx @better-auth/cli@latest secret # Generate auth secret if needed
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    ```

## Running the Application

To start the development server with hot-reloading:

```sh
npm start
```

The server will start on `http://localhost:3000`.

## Running Tests

To run the test suite using Vitest:

```sh
npm test
```

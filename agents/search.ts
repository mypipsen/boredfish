import { Agent, tool, run as runAgent } from "@openai/agents";
import { z } from "zod";

import tmdb from "../lib/tmdb.ts";

const multiSearch = tool({
  name: "multi_search",
  description: `Search for movies or TV shows based on a query string.
Return up to 5 movies, with title, year, and rating.

Format the results as a numbered list in plain text for readability like this:

1. Title (Year) — Rating: X.X

Include line breaks between each entry.
Do not put multiple movies on the same line.
`,
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    console.info(`Using multi_search tool with query ${query}`);
    return await tmdb.search.multi({ query });
  },
});

const upcomingMovies = tool({
  name: "upcoming_movies",
  description: `
Get a list of movies that are being released soon.
Return up to 10 movies with title, release date and a short description.

1. Black Phone 2 (2025-10-15) — After escaping The Grabber, Finney and his sister face a new supernatural threat.

Include line breaks between each entry.
Do not put multiple movies on the same line.
`,
  parameters: z.object({}),
  execute: async () => {
    console.info("Using upcoming_movies tool");
    return await tmdb.movies.upcoming();
  },
});

class SearchAgent {
  readonly _agent: Agent;

  constructor() {
    this._agent = new Agent({
      name: "Movie and tv show expert",
      instructions: `You are a helpful assistant and an expert in finding movies and tv shows based on vague keyword searches.`,
      tools: [multiSearch, upcomingMovies],
    });
  }

  async run(query: string) {
    console.info(`Starting SearchAgent run with query: ${query}`);
    return runAgent(this._agent, query, { stream: true });
  }
}

export default SearchAgent;

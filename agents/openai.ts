import { Agent, tool, run as runAgent } from "@openai/agents";
import type { Response } from "express";
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

class OpenaiAgent {
  readonly _agent: Agent;

  constructor() {
    this._agent = new Agent({
      name: "Movie and tv show expert",
      instructions: `You are a helpful assistant and an expert in finding movies and tv shows based on vague keyword searches.`,
      tools: [multiSearch, upcomingMovies],
    });
  }

  async run(query: string, res: Response) {
    console.info(`Starting OpenaiAgent run with query: ${query}`);
    const stream = await runAgent(this._agent, query, { stream: true });

    const textStream = stream.toTextStream({
      compatibleWithNodeStreams: false,
    });

    for await (const text of textStream) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    await stream.completed;
    res.write("event: end\ndata: done\n\n");
    res.end();
  }
}

export default OpenaiAgent;

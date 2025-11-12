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
Do not put multiple movies on the same line.`,
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    return await tmdb.search.multi({ query });
  },
});

class SearchAgent {
  readonly _agent: Agent;

  constructor() {
    this._agent = new Agent({
      name: "Movie and tv show expert",
      instructions:
        "You are a helpful assistant and an expert in finding movies and tv shows based on vague keyword searches.",
      tools: [multiSearch],
    });
  }

  async run(query: string) {
    console.info(`Starting SearchAgent run with query: ${query}`);
    return runAgent(this._agent, query, { stream: true });
  }
}

export default SearchAgent;

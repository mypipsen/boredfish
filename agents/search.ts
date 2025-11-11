import { Agent, tool, run as runAgent } from "@openai/agents";
import { z } from "zod";

import tmdb from "../lib/tmdb.ts";

const multiSearch = tool({
  name: "multi_search",
  description: "Search for a movies or tv shows based on a query string",
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
        "You provide assistance with finding movies and tv shows based on vague keyword searches.",
      tools: [multiSearch],
    });
  }

  async run(query: string) {
    return runAgent(this._agent, query);
  }
}

export default SearchAgent;

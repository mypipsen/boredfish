import type { Response } from "express";
import ollama, { type Message } from "ollama";

import tmdb from "../lib/tmdb.ts";

class OllamaAgent {
  readonly messages: Message[];
  readonly model: string;

  constructor() {
    this.messages = [];
    this.model = "qwen3:0.6b";
  }

  get tools() {
    return [
      {
        type: "function",
        function: {
          name: "multiSearch",
          description: `Search for movies or TV shows based on a query string.
Return up to 5 movies, with title, year, and rating.

Format the results as a numbered list in plain text for readability like this:

1. Title (Year) — Rating: X.X

Include line breaks between each entry.
Do not put multiple movies on the same line.
`,
          parameters: {
            type: "object",
            required: ["query"],
            properties: {
              query: { type: "query", description: "The search string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "upcomingMovies",
          description: `
Get a list of movies that are being released soon.
Return up to 10 movies with title, release date and a short description.

1. Black Phone 2 (2025-10-15) — After escaping The Grabber, Finney and his sister face a new supernatural threat.

Include line breaks between each entry.
Do not put multiple movies on the same line.
`,
        },
      },
    ];
  }

  async runTool(name: string, args: any) {
    const toolMap: Record<string, (args: any) => Promise<string>> = {
      multiSearch: async ({ query }: { query: string }) => {
        const response = await tmdb.search.multi({ query });
        return JSON.stringify(response);
      },

      upcomingMovies: async () => {
        const response = await tmdb.movies.upcoming();
        return JSON.stringify(response);
      },
    };

    if (typeof toolMap[name] === "function") {
      console.info(`Using ${name} tool`);
      return toolMap[name](args);
    }

    return "Unknown tool";
  }

  async run(query: string, res: Response) {
    console.info(`Starting OllamaAgent run with query: ${query}`);

    this.messages.push({
      role: "user",
      content: query,
    });

    const response = await ollama.chat({
      model: this.model,
      messages: this.messages,
      tools: this.tools,
      think: true,
    });

    if (response.message.tool_calls) {
      for (const call of response.message.tool_calls) {
        const result = await this.runTool(
          call.function.name,
          call.function.arguments
        );

        this.messages.push({
          role: "tool",
          tool_name: call.function.name,
          content: result,
        });
      }

      const stream = await ollama.chat({
        model: this.model,
        messages: this.messages,
        tools: this.tools,
        think: false,
        stream: true,
      });

      let content = "";
      let thinking = "";

      for await (const chunk of stream) {
        if (chunk.message.thinking) {
          thinking += chunk.message.thinking;

          res.write(
            `data: ${JSON.stringify({ text: chunk.message.thinking })}\n\n`
          );
        } else if (chunk.message.content) {
          content += chunk.message.content;

          res.write(
            `data: ${JSON.stringify({ text: chunk.message.content })}\n\n`
          );
        }
      }

      this.messages.push({
        role: "assistant",
        thinking: thinking,
        content: content,
      });

      res.write("event: end\ndata: done\n\n");
      res.end();
    }
  }
}

export default OllamaAgent;

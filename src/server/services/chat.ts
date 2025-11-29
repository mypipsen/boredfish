import { openai } from '@ai-sdk/openai';
import { ModelMessage, Output, tool, ToolLoopAgent } from 'ai';
import { z } from 'zod';

import { chatResponseSchema } from '../../shared/schema.js';
import { tmdb } from '../lib/tmdb.js';

export async function chat(messages: ModelMessage[]) {
  const agent = new ToolLoopAgent({
    model: openai('gpt-4o'),
    instructions:
      'You are a helpful assistant and an expert in finding movies and tv shows based on keyword searches.' +
      'You can also provide help with recommendations of movies or tv shows to watch.' +
      'Use the available tools to find information.' +
      'Do not just dump all search results; curate the list for the user.' +
      'Never list any movies or tv shows in the text response.',
    tools: {
      multiSearch: tool({
        description: 'Search for movies or TV shows based on a query string.',
        inputSchema: z.object({
          query: z.string(),
        }),
        execute: async ({ query }: { query: string }) => {
          console.info(`Using multiSearch tool with query ${query}`);
          return tmdb.search.multi({ query });
        },
      }),
      upcomingMovies: tool({
        description: 'Get a list of movies that are being released soon.',
        inputSchema: z.object({}),
        execute: async () => {
          console.info('Using upcomingMovies tool');
          return tmdb.movies.upcoming();
        },
      }),
    },
    output: Output.object({ schema: chatResponseSchema }),
  });

  return agent.stream({ messages });
}
